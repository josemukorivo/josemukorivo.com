import assert from "node:assert/strict";
import test from "node:test";
import { appendVary, preferredRepresentation } from "../lib/accept.js";
import { LLMS_TXT } from "../lib/llms-txt.js";
import {
  getTrustPageText,
  TRUST_PAGES
} from "../lib/trust-pages.js";

test("defaults browser and wildcard requests to HTML", () => {
  assert.equal(preferredRepresentation(null), "text/html");
  assert.equal(preferredRepresentation("*/*"), "text/html");
  assert.equal(
    preferredRepresentation("text/html,application/xhtml+xml"),
    "text/html"
  );
});

test("selects Markdown using quality, client order, and specificity", () => {
  assert.equal(
    preferredRepresentation("text/markdown, text/html;q=0.8"),
    "text/markdown"
  );
  assert.equal(
    preferredRepresentation("text/markdown;q=0.2, text/html;q=0.9"),
    "text/html"
  );
  assert.equal(
    preferredRepresentation("text/html;q=0, */*;q=1"),
    "text/markdown"
  );
  assert.equal(
    preferredRepresentation("text/markdown;q=0, text/html"),
    "text/html"
  );
});

test("returns no representation when every supported type is rejected", () => {
  assert.equal(preferredRepresentation("application/pdf"), null);
  assert.equal(
    preferredRepresentation("text/html;q=0, text/markdown;q=0"),
    null
  );
});

test("adds cache variation fields without removing existing fields", () => {
  const headers = new Headers({ Vary: "RSC, Accept-Encoding" });

  appendVary(headers);

  assert.equal(headers.get("Vary"), "RSC, Accept-Encoding, Accept");
});

test("llms.txt follows the required orientation format", () => {
  assert.match(LLMS_TXT, /^# Joseph Mukorivo\n\n>/);
  assert.match(LLMS_TXT, /## When to use this site/);
  assert.match(LLMS_TXT, /## How agents should call this site/);
  assert.match(LLMS_TXT, /Accept: text\/markdown/);
  assert.match(LLMS_TXT, /https:\/\/www\.josemukorivo\.com\/sitemap\.xml/);
});

test("each trust page contains substantial, specific content", () => {
  for (const [slug, page] of Object.entries(TRUST_PAGES)) {
    const content = getTrustPageText(page);

    assert.ok(
      content.length >= 500,
      `${slug} must contain at least 500 characters, got ${content.length}`
    );
    assert.match(content, /Joseph|site|information/i);
  }
});
