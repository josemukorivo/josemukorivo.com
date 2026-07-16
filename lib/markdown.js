import "server-only";

import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const LANGUAGE_LABELS = {
  bash: "Bash",
  css: "CSS",
  go: "Go",
  html: "HTML",
  javascript: "JavaScript",
  js: "JavaScript",
  jsx: "JSX",
  json: "JSON",
  makefile: "Makefile",
  nginx: "Nginx",
  python: "Python",
  sh: "Shell",
  shell: "Shell",
  text: "Text",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  yaml: "YAML",
  yml: "YAML"
};

const prettyCodeOptions = {
  theme: "github-light-default",
  keepBackground: false,
  defaultLang: "text"
};

function findChild(node, predicate) {
  return node.children?.find(
    (child) => child.type === "element" && predicate(child)
  );
}

function rehypeCodeBlockControls() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (
        node.tagName !== "figure" ||
        !Object.hasOwn(
          node.properties ?? {},
          "data-rehype-pretty-code-figure"
        )
      ) {
        return;
      }

      const pre = findChild(node, (child) => child.tagName === "pre");
      const code = pre
        ? findChild(pre, (child) => child.tagName === "code")
        : null;
      const language = String(
        code?.properties?.["data-language"] ??
          pre?.properties?.["data-language"] ??
          "text"
      ).toLowerCase();

      node.properties.className = ["codeBlock"];
      pre.properties.className = ["codeBlockPre"];
      code.properties.className = ["codeBlockCode"];
      node.children.unshift({
        type: "element",
        tagName: "figcaption",
        properties: {
          className: ["codeBlockHeader"]
        },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: {
              className: ["codeBlockLanguage"]
            },
            children: [
              {
                type: "text",
                value: LANGUAGE_LABELS[language] ?? language
              }
            ]
          },
          {
            type: "element",
            tagName: "button",
            properties: {
              type: "button",
              className: ["codeBlockCopy"],
              "data-copy-code": "",
              ariaLabel: "Copy code",
              ariaLive: "polite"
            },
            children: [
              {
                type: "text",
                value: "Copy"
              }
            ]
          }
        ]
      });
    });
  };
}

function rehypeArticleElements() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "img") {
        node.properties.loading = "lazy";
        node.properties.decoding = "async";
      }

      if (node.tagName !== "a") {
        return;
      }

      const href = String(node.properties?.href ?? "");

      if (href.startsWith("http://") || href.startsWith("https://")) {
        node.properties.target = "_blank";
        node.properties.rel = ["noreferrer", "noopener"];
      }
    });
  };
}

export async function renderMarkdown(markdown) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: {
        className: ["headingAnchor"]
      }
    })
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeCodeBlockControls)
    .use(rehypeArticleElements)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
