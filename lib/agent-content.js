import { getArticle, getArticles } from "./blog";
import { stripLocaleFromPathname } from "./i18n-config";
import { projects } from "./projects";
import { SITE_URL } from "./site";
import { getTrustPageText, TRUST_PAGES } from "./trust-pages";

const HOME_MARKDOWN = `# Joseph Mukorivo

AI product engineer and engineering leader based in Harare, Zimbabwe.

I build production software and AI systems, from secure full-stack products to tool-using agents, conversational and voice interfaces, automation, analytics, and human-in-the-loop workflows. I focus on systems that people can depend on beyond a demo.

I founded [Complexus](https://complexus.tech), an independent Zimbabwean software company, and built [FortyOne](https://www.fortyone.app), an agentic project management platform connecting company goals, customer feedback, planning, and delivery. I currently lead engineering at Art Circles, setting technical direction, shaping AI strategy, and guiding product delivery.

My work combines technical leadership, product strategy, project management, and hands-on engineering across secure full-stack systems, cloud architecture, analytics, and integrations. Much of that experience comes from fintech and regulated environments where reliability and details matter.

## Selected work

- **FortyOne** — Strategy, feedback, and agentic project management.
- **Config** — An open-source configuration package for reliable Go applications.
- **Complexus** — Product engineering and practical AI for complex work.

## Education

I earned a First Class BSc Honours in Information Technology from Chinhoyi University of Technology in 2019. I am completing a Master of Business Administration at the National University of Science and Technology.

## Explore

- [About](${SITE_URL}/about)
- [Projects](${SITE_URL}/projects)
- [Writing](${SITE_URL}/blog)
- [Contact](${SITE_URL}/contact)
- [Privacy](${SITE_URL}/privacy)
- [Agent instructions](${SITE_URL}/llms.txt)
`;

const ASSISTANT_MARKDOWN = `# Maya — Joseph Mukorivo's website assistant

Maya is an interactive guide to the public information on this website. Ask about Joseph's professional background, projects, technical writing, engineering leadership, or applied AI work.

Maya can search public profile, project, and article data. She does not have access to private systems or unpublished client information. If you ask to contact Joseph, Maya prepares a message for your review; the message is not sent until you explicitly confirm it in the interface.

- [Open the assistant](${SITE_URL}/assistant)
- [Read the agent instructions](${SITE_URL}/llms.txt)
- [Contact Joseph directly](${SITE_URL}/contact)
`;

const NOT_FOUND_MARKDOWN = `# 404 — Page not found

The requested resource does not exist or may have moved.

## Look next

- [Homepage](${SITE_URL}/)
- [Sitemap](${SITE_URL}/sitemap.xml)
- [Agent instructions](${SITE_URL}/llms.txt)
- [Writing index](${SITE_URL}/blog)
- [Projects](${SITE_URL}/projects)
`;

function trustPageMarkdown(key) {
  const page = TRUST_PAGES[key];

  return `# ${page.title}\n\n${page.description}\n\n${getTrustPageText(page)}\n\n- [Homepage](${SITE_URL}/)\n- [Agent instructions](${SITE_URL}/llms.txt)\n`;
}

function projectsMarkdown() {
  const entries = projects
    .map(
      (project) =>
        `## [${project.name}](${project.href})\n\n${project.description}`
    )
    .join("\n\n");

  return `# Projects\n\nSelected products, companies, and open-source work built by Joseph Mukorivo.\n\n${entries}\n`;
}

function cleanMdx(markdown) {
  const lines = markdown.split("\n");
  const output = [];
  let skippingComponent = false;

  for (const line of lines) {
    if (!skippingComponent && /^<[A-Z][A-Za-z0-9]*/.test(line.trim())) {
      skippingComponent = !line.includes("/>");
      continue;
    }

    if (skippingComponent) {
      if (line.includes("/>")) {
        skippingComponent = false;
      }
      continue;
    }

    output.push(line);
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

async function blogIndexMarkdown() {
  const articles = await getArticles();
  const links = articles
    .map(
      (article) =>
        `- [${article.title}](${SITE_URL}/blog/${article.slug}): ${article.description}`
    )
    .join("\n");

  return `# Writing\n\nJoseph Mukorivo's writing on AI product engineering, software architecture, engineering leadership, and building complex systems.\n\n${links}\n`;
}

async function articleMarkdown(slug) {
  const article = await getArticle(slug);

  if (!article) {
    return null;
  }

  const details = [
    `Published: ${article.publishedAt}`,
    `Updated: ${article.updatedAt}`,
    article.tags.length > 0 ? `Tags: ${article.tags.join(", ")}` : null
  ]
    .filter(Boolean)
    .join("  \n");

  return `# ${article.title}\n\n> ${article.description}\n\n${details}\n\n${cleanMdx(article.content)}\n`;
}

export async function getAgentContent(pathname) {
  const normalizedPath = stripLocaleFromPathname(pathname).replace(/\/$/, "") || "/";

  if (normalizedPath === "/") {
    return HOME_MARKDOWN;
  }

  if (normalizedPath === "/assistant") {
    return ASSISTANT_MARKDOWN;
  }

  const trustPage = normalizedPath.slice(1);

  if (Object.hasOwn(TRUST_PAGES, trustPage)) {
    return trustPageMarkdown(trustPage);
  }

  if (normalizedPath === "/projects") {
    return projectsMarkdown();
  }

  if (normalizedPath === "/blog") {
    return blogIndexMarkdown();
  }

  if (normalizedPath.startsWith("/blog/")) {
    return articleMarkdown(normalizedPath.slice("/blog/".length));
  }

  return null;
}

export function getAgentNotFoundContent() {
  return NOT_FOUND_MARKDOWN;
}
