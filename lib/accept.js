const DEFAULT_REPRESENTATIONS = Object.freeze([
  "text/html",
  "text/markdown"
]);

function parseQuality(parameters) {
  for (const parameter of parameters) {
    const separator = parameter.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const name = parameter.slice(0, separator).trim().toLowerCase();

    if (name !== "q") {
      continue;
    }

    const quality = Number(parameter.slice(separator + 1).trim());
    return Number.isFinite(quality)
      ? Math.max(0, Math.min(1, quality))
      : 0;
  }

  return 1;
}

function parseAccept(header) {
  return header
    .split(",")
    .map((value, position) => {
      const [type = "", ...parameters] = value
        .trim()
        .split(";")
        .map((part) => part.trim());
      const normalizedType = type.toLowerCase();

      return {
        position,
        quality: parseQuality(parameters),
        specificity:
          normalizedType === "*/*"
            ? 0
            : normalizedType.endsWith("/*")
              ? 1
              : 2,
        type: normalizedType
      };
    })
    .filter((entry) => entry.type.includes("/"));
}

function matches(entry, representation) {
  if (entry.type === "*/*") {
    return true;
  }

  if (entry.type.endsWith("/*")) {
    return representation.startsWith(entry.type.slice(0, -1));
  }

  return entry.type === representation;
}

export function preferredRepresentation(
  header,
  representations = DEFAULT_REPRESENTATIONS
) {
  if (!header?.trim()) {
    return representations[0];
  }

  const entries = parseAccept(header);

  if (entries.length === 0) {
    return representations[0];
  }

  let preference = null;

  for (const representation of representations) {
    let match = null;

    for (const entry of entries) {
      if (!matches(entry, representation)) {
        continue;
      }

      if (
        match === null ||
        entry.specificity > match.specificity ||
        (entry.specificity === match.specificity &&
          entry.position < match.position)
      ) {
        match = entry;
      }
    }

    if (!match || match.quality <= 0) {
      continue;
    }

    if (
      preference === null ||
      match.quality > preference.quality ||
      (match.quality === preference.quality &&
        match.position < preference.position)
    ) {
      preference = {
        position: match.position,
        quality: match.quality,
        representation
      };
    }
  }

  return preference?.representation ?? null;
}

export function appendVary(headers, names = ["Accept", "Accept-Encoding"]) {
  const existing = headers.get("Vary") ?? "";
  const existingNames = new Set(
    existing
      .split(",")
      .map((name) => name.trim().toLowerCase())
      .filter(Boolean)
  );
  const additions = names.filter(
    (name) => !existingNames.has(name.toLowerCase())
  );

  headers.set(
    "Vary",
    [existing, ...additions].filter(Boolean).join(", ")
  );
}
