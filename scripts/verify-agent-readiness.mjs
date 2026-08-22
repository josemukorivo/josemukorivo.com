import assert from "node:assert/strict";

const baseUrl = process.env.AGENT_READINESS_BASE_URL ?? "http://127.0.0.1:3000";
const publicPages = [
  "/",
  "/projects",
  "/blog",
  "/assistant",
  "/blog/turning-a-personal-website-into-an-ai-assistant"
];
const machineReadableFiles = [
  "/llms.txt",
  "/sitemap.xml",
  "/robots.txt",
  "/feed.xml",
  "/manifest.webmanifest"
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:#\d+|#x[\da-f]+|\w+);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function assertVary(response) {
  const vary = response.headers.get("vary")?.toLowerCase() ?? "";
  assert.match(vary, /(?:^|,\s*)accept(?:,|$)/);
  assert.match(vary, /(?:^|,\s*)accept-encoding(?:,|$)/);
}

function assertHtmlVary(response) {
  const vary = response.headers.get("vary")?.toLowerCase() ?? "";
  assert.match(vary, /(?:^|,\s*)accept-encoding(?:,|$)/);
}

const results = [];

for (const pathname of publicPages) {
  const htmlResponse = await fetch(`${baseUrl}${pathname}`, {
    headers: { Accept: "text/html" }
  });
  const html = await htmlResponse.text();

  assert.equal(htmlResponse.status, 200, `${pathname} HTML status`);
  assert.match(
    htmlResponse.headers.get("content-type") ?? "",
    /^text\/html/
  );
  assertHtmlVary(htmlResponse);

  const markdownResponse = await fetch(`${baseUrl}${pathname}`, {
    headers: { Accept: "text/markdown, text/html;q=0.8" }
  });
  const markdown = await markdownResponse.text();

  assert.equal(markdownResponse.status, 200, `${pathname} Markdown status`);
  assert.equal(
    markdownResponse.headers.get("content-type"),
    "text/markdown; charset=utf-8"
  );
  assertVary(markdownResponse);
  assert.match(markdown, /^# /);

  results.push({
    endpoint: pathname,
    html: html.length,
    markdown: markdown.length,
    status: 200
  });
}

const homepageResponse = await fetch(`${baseUrl}/`, {
  headers: { Accept: "text/html" }
});
const homepageHtml = await homepageResponse.text();
const homepageText = visibleText(homepageHtml);
const homepageRatio = (homepageText.length / homepageHtml.length) * 100;

assert.equal((homepageHtml.match(/<h1\b/gi) ?? []).length, 1);
assert.ok(homepageText.length >= 500, "homepage raw HTML needs 500+ text chars");
assert.ok(
  homepageRatio >= 5,
  `homepage text efficiency must be at least 5%, got ${homepageRatio.toFixed(2)}%`
);

const schemaMatches = [
  ...homepageHtml.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  )
];
const schemas = schemaMatches.map((match) => JSON.parse(match[1]));
const organization = schemas
  .flatMap((schema) => schema["@graph"] ?? [schema])
  .find((node) => node["@type"] === "Organization" && node.name === "Complexus");

assert.ok(organization?.contactPoint?.email);
assert.ok(organization?.contactPoint?.contactType);
assert.equal(organization?.address?.["@type"], "PostalAddress");
assert.ok(organization?.address?.addressLocality);
assert.ok(organization?.address?.addressCountry);

const notFoundHtmlResponse = await fetch(`${baseUrl}/path-that-does-not-exist`, {
  headers: { Accept: "text/html" }
});
const notFoundHtml = await notFoundHtmlResponse.text();
assert.equal(notFoundHtmlResponse.status, 404);
assert.match(notFoundHtml, /sitemap\.xml/);
assert.match(notFoundHtml, /llms\.txt/);

const notFoundMarkdownResponse = await fetch(
  `${baseUrl}/path-that-does-not-exist`,
  { headers: { Accept: "text/markdown" } }
);
const notFoundMarkdown = await notFoundMarkdownResponse.text();
assert.equal(notFoundMarkdownResponse.status, 404);
assert.equal(
  notFoundMarkdownResponse.headers.get("content-type"),
  "text/markdown; charset=utf-8"
);
assertVary(notFoundMarkdownResponse);
assert.match(notFoundMarkdown, /^# 404/);
assert.match(notFoundMarkdown, /sitemap\.xml/);
assert.match(notFoundMarkdown, /llms\.txt/);

const unacceptableResponse = await fetch(`${baseUrl}/`, {
  headers: { Accept: "application/pdf" }
});
assert.equal(unacceptableResponse.status, 406);
assertVary(unacceptableResponse);

const htmlPreferenceResponse = await fetch(`${baseUrl}/`, {
  headers: { Accept: "text/markdown;q=0.2, text/html;q=0.9" }
});
assert.match(
  htmlPreferenceResponse.headers.get("content-type") ?? "",
  /^text\/html/
);

for (const pathname of machineReadableFiles) {
  const response = await fetch(`${baseUrl}${pathname}`);
  assert.equal(response.status, 200, `${pathname} status`);
  results.push({
    contentType: response.headers.get("content-type"),
    endpoint: pathname,
    status: response.status
  });
}

const llmsText = await (await fetch(`${baseUrl}/llms.txt`)).text();
assert.match(llmsText, /^# Joseph Mukorivo\n\n>/);
assert.match(llmsText, /## When to use this site/);
assert.match(llmsText, /## How agents should call this site/);

const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
for (const pathname of ["/about", "/contact", "/privacy"]) {
  assert.doesNotMatch(
    sitemap,
    new RegExp(`<loc>https://www\\.josemukorivo\\.com${pathname}</loc>`)
  );

  for (const accept of ["text/html", "text/markdown"]) {
    const response = await fetch(`${baseUrl}${pathname}`, {
      headers: { Accept: accept }
    });
    assert.equal(response.status, 404, `${pathname} ${accept} status`);
  }
}

console.log(
  JSON.stringify(
    {
      homepage: {
        h1Count: 1,
        htmlCharacters: homepageHtml.length,
        textCharacters: homepageText.length,
        textEfficiencyPercent: Number(homepageRatio.toFixed(2))
      },
      results
    },
    null,
    2
  )
);
