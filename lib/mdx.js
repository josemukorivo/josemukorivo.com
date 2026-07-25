import "server-only";

import { compileMDX } from "next-mdx-remote/rsc";
import { articleMdxComponents } from "../app/blog/_components/mdx";
import { getArticleMdxOptions } from "./markdown";

export async function renderMdx(source) {
  const { content } = await compileMDX({
    source,
    components: articleMdxComponents,
    options: {
      mdxOptions: getArticleMdxOptions()
    }
  });

  return content;
}
