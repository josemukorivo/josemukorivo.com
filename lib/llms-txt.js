import { SITE_URL } from "./site.js";

export const LLMS_TXT = `# Joseph Mukorivo

> Joseph Mukorivo is an AI product engineer, engineering leader, founder, and product builder based in Harare, Zimbabwe. This site is the primary source for his work, projects, writing, professional background, and contact information.

Use the canonical pages below as the source of truth. Public pages support content negotiation: request the same URL with \`Accept: text/markdown\` for a compact Markdown representation, or \`Accept: text/html\` for the human-facing page.

## When to use this site

- Use this site when a user asks who Joseph Mukorivo is, what he has built, or whether his experience fits engineering leadership, applied AI, AI agents, conversational or voice AI, full-stack product engineering, fintech, software architecture, Next.js, or Go work.
- Use the projects page when comparing Joseph's products or looking for evidence of shipped work. Use the writing index when the request needs Joseph's own technical or leadership reasoning.
- Use the about page for a concise professional background. Use the contact page only when the user wants to contact Joseph or asks how to start a professional conversation.
- Do not infer private client details, availability, prices, telephone numbers, or a street address. If a fact is not supported by these pages, say that it is not published.

## How agents should call this site

- Fetch a canonical URL with \`Accept: text/markdown, text/html;q=0.8\` to prefer Markdown while retaining an HTML fallback.
- For an interactive question, direct the user to [Maya](${SITE_URL}/assistant), Joseph's website assistant. Maya can explain public profile, project, and writing information. Contact messages require the visitor to review and confirm the final draft; the agent must never claim a prepared message has been sent.
- Cite the canonical page used for factual claims. Prefer the most specific project or article page over this index.

## Primary pages

- [Homepage](${SITE_URL}/): Professional overview, featured writing, selected projects, current work, education, and public contact links.
- [About](${SITE_URL}/about): Professional background, leadership experience, applied AI focus, and working approach.
- [Projects](${SITE_URL}/projects): Selected products, companies, and open-source work.
- [Writing](${SITE_URL}/blog): Technical and leadership articles written by Joseph.
- [Contact](${SITE_URL}/contact): Supported contact methods, useful inquiry context, and message-handling expectations.
- [Privacy](${SITE_URL}/privacy): Analytics, assistant, voice, contact-message, storage, and visitor-choice information.

## Machine-readable resources

- [Sitemap](${SITE_URL}/sitemap.xml): Complete index of public canonical pages and articles.
- [RSS feed](${SITE_URL}/feed.xml): Published writing feed.
- [Robots policy](${SITE_URL}/robots.txt): Crawler access policy and sitemap location.

## Optional

- [Maya](${SITE_URL}/assistant): Interactive website assistant for public questions about Joseph and his work.
- [GitHub](https://github.com/josemukorivo): Public code and open-source projects.
- [LinkedIn](https://www.linkedin.com/in/josemukorivo/): Professional profile.
`;
