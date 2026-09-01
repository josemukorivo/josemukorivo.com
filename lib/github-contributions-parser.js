const CONTRIBUTION_DAY_PATTERN =
  /data-date="([^"]+)"[^>]*data-level="([0-4])"[^>]*><\/td>\s*<tool-tip[^>]*>([^<]+)<\/tool-tip>/g;

const CONTRIBUTION_COUNT_PATTERN = /([\d,]+) contributions?/i;

function contributionCountFromLabel(label) {
  const match = label.match(CONTRIBUTION_COUNT_PATTERN);
  return match ? Number.parseInt(match[1].replaceAll(",", ""), 10) : 0;
}

export function parseGitHubContributions(html) {
  const days = Array.from(html.matchAll(CONTRIBUTION_DAY_PATTERN), (match) => ({
    date: match[1],
    level: Number.parseInt(match[2], 10),
    count: contributionCountFromLabel(match[3])
  })).sort((first, second) => first.date.localeCompare(second.date));

  if (days.length < 300) {
    throw new Error("GitHub contribution data was incomplete.");
  }

  return {
    days,
    total: days.reduce((sum, day) => sum + day.count, 0)
  };
}
