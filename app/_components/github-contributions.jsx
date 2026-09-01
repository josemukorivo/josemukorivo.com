import { getGitHubContributions } from "../../lib/github-contributions";
import { InlineLink } from "./inline-link";

const GITHUB_PROFILE_URL = "https://github.com/josemukorivo";

function getMonthLabels(days, locale) {
  const formatter = new Intl.DateTimeFormat(locale, { month: "short" });
  const occupiedWeeks = new Set();
  const labels = [];

  for (const [index, day] of days.entries()) {
    const date = new Date(`${day.date}T00:00:00Z`);
    const previous = index > 0 ? days[index - 1].date.slice(0, 7) : null;
    const month = day.date.slice(0, 7);

    if (month === previous) continue;

    const week = Math.floor(index / 7) + 1;
    if (occupiedWeeks.has(week)) continue;

    occupiedWeeks.add(week);
    labels.push({ label: formatter.format(date), week });
  }

  return labels;
}

function formatSummary(template, total, locale) {
  return template.replace(
    "{count}",
    new Intl.NumberFormat(locale).format(total)
  );
}

export function GitHubContributionsFallback({ messages }) {
  return (
    <div className="contribution-fallback">
      <p className="text-subtle">{messages.unavailable}</p>
      <InlineLink href={GITHUB_PROFILE_URL}>{messages.profile}</InlineLink>
    </div>
  );
}

export async function GitHubContributions({ locale, messages }) {
  let contributions;

  try {
    contributions = await getGitHubContributions();
  } catch {
    return <GitHubContributionsFallback messages={messages} />;
  }

  const months = getMonthLabels(contributions.days, locale);
  const summary = formatSummary(messages.summary, contributions.total, locale);

  return (
    <div className="contribution-card">
      <div className="contribution-graph-scroll">
        <div className="contribution-graph-frame">
          <div aria-hidden="true" className="contribution-months">
            {months.map((month) => (
              <span
                key={`${month.label}-${month.week}`}
                style={{ gridColumn: month.week }}
              >
                {month.label}
              </span>
            ))}
          </div>
          <div aria-hidden="true" className="contribution-grid">
            {contributions.days.map((day) => (
              <span
                className="contribution-day"
                data-level={day.level}
                key={day.date}
                title={`${day.count} · ${day.date}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="contribution-summary">
        <span>{summary}</span>
        <InlineLink href={GITHUB_PROFILE_URL}>{messages.profile}</InlineLink>
      </div>
    </div>
  );
}
