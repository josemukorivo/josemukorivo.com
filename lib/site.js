export const SITE_URL = "https://www.josemukorivo.com";
export const SITE_NAME = "Joseph Mukorivo";
export const SITE_TITLE = "Joseph Mukorivo — Head of Engineering & founder";
export const SITE_DESCRIPTION =
  "Joseph Mukorivo is an engineering leader, founder, and product builder creating secure software systems and thoughtful digital products.";
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
  "engineering leader",
  "head of engineering",
  "software architect",
  "product engineer",
  "AI product development",
  "fintech engineering",
  "Next.js",
  "Go",
  "Harare",
  "Zimbabwe"
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
