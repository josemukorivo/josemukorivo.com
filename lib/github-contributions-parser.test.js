import assert from "node:assert/strict";
import test from "node:test";

import { parseGitHubContributions } from "./github-contributions-parser.js";

function contributionDay({ count, date, index, level }) {
  const label = count === 0 ? "No contributions" : `${count} contributions`;

  return `<td data-date="${date}" id="day-${index}" data-level="${level}"></td>
    <tool-tip for="day-${index}">${label} on September 1st.</tool-tip>`;
}

test("parses, orders, and totals GitHub contribution days", () => {
  const html = Array.from({ length: 301 }, (_, index) => {
    const date = new Date(Date.UTC(2025, 0, 1 + index))
      .toISOString()
      .slice(0, 10);
    const count = index % 5;

    return contributionDay({ count, date, index, level: count });
  })
    .reverse()
    .join("\n");

  const result = parseGitHubContributions(html);

  assert.equal(result.days.length, 301);
  assert.equal(result.days[0].date, "2025-01-01");
  assert.equal(result.days.at(-1).date, "2025-10-28");
  assert.equal(result.total, 600);
});

test("rejects an incomplete contribution response", () => {
  assert.throws(
    () =>
      parseGitHubContributions(
        contributionDay({ count: 1, date: "2026-09-01", index: 0, level: 1 })
      ),
    /incomplete/
  );
});
