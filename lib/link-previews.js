const LINK_PREVIEWS = {
  "https://www.fortyone.app": {
    title: "FortyOne",
    description: "AI project management that connects goals to daily work.",
    image: "/assets/previews/fortyone-home.png"
  },
  "https://complexus.tech": {
    title: "Complexus",
    description: "A product company building thoughtful software and new ideas.",
    image: "/assets/previews/complexus-home.png"
  },
  "https://github.com/josemukorivo": {
    title: "Joseph Mukorivo",
    description: "Open-source tools, product experiments, and engineering work.",
    icon: "github"
  },
  "https://github.com/josemukorivo/config": {
    title: "Config",
    description: "A configuration package for building reliable Go applications.",
    icon: "github"
  },
  "https://www.linkedin.com/in/josemukorivo": {
    title: "Joseph Mukorivo",
    description: "Engineering leadership, product building, and technology work.",
    icon: "linkedin"
  },
  "https://x.com/josemukorivo": {
    title: "@josemukorivo",
    description: "Thoughts on engineering, products, AI, and the work in progress.",
    icon: "x"
  },
  "mailto:hello@josemukorivo.com": {
    title: "Start a conversation",
    description: "Ideas, interesting products, and difficult systems problems are always welcome.",
    icon: "mail"
  }
};

function normalizePreviewUrl(href) {
  try {
    const url = new URL(href);

    if (url.protocol === "mailto:") {
      return `mailto:${url.pathname.toLowerCase()}`;
    }

    const pathname = url.pathname.replace(/\/$/, "");
    return `${url.origin}${pathname}`;
  } catch {
    return href;
  }
}

export function getLinkPreview(href) {
  return LINK_PREVIEWS[normalizePreviewUrl(href)] ?? null;
}
