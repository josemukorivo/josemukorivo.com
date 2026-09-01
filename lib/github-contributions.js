import "server-only";

import { parseGitHubContributions } from "./github-contributions-parser";

const GITHUB_CONTRIBUTIONS_URL =
  "https://github.com/users/josemukorivo/contributions";

export async function getGitHubContributions() {
  const response = await fetch(GITHUB_CONTRIBUTIONS_URL, {
    headers: {
      Accept: "text/html",
      "User-Agent": "josemukorivo.com contribution graph"
    },
    next: { revalidate: 21_600 }
  });

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status}.`);
  }

  return parseGitHubContributions(await response.text());
}
