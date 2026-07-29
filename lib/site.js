export const SITE_URL = "https://www.josemukorivo.com";
export const SITE_NAME = "Joseph Mukorivo";
export const SITE_TITLE =
  "Joseph Mukorivo — AI Product Engineer & Engineering Leader";
export const SITE_DESCRIPTION =
  "Joseph Mukorivo is an AI product engineer and engineering leader building production AI systems, secure software, and thoughtful digital products.";
export const SITE_LOCALE = "en_ZW";
export const SITE_LANGUAGE = "en";
export const SITE_EMAIL = "hello@josemukorivo.com";
export const SITE_HANDLE = "@josemukorivo";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BLOG_ID = `${SITE_URL}/blog#blog`;

export const SOCIAL_PROFILES = [
  "https://github.com/josemukorivo",
  "https://www.linkedin.com/in/josemukorivo/",
  "https://x.com/josemukorivo"
];

export const SITE_KEYWORDS = [
  "Joseph Mukorivo",
  "AI product engineer",
  "applied AI engineer",
  "AI engineer Zimbabwe",
  "AI agents",
  "conversational AI",
  "voice AI",
  "human-in-the-loop AI",
  "engineering leader",
  "head of engineering",
  "software architect",
  "product engineer",
  "fintech engineering",
  "Next.js",
  "Go",
  "Harare",
  "Zimbabwe"
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
