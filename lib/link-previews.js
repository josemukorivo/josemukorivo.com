const LINK_PREVIEWS = {
  "https://www.fortyone.app": {
    id: "fortyone",
    title: "FortyOne",
    description: "AI project management that connects goals to daily work.",
    image: "/assets/previews/fortyone-home.png"
  },
  "https://complexus.tech": {
    id: "complexus",
    title: "Complexus",
    description: "A product company building thoughtful software and new ideas.",
    image: "/assets/previews/complexus-home.png"
  },
  "https://github.com/josemukorivo": {
    id: "github",
    title: "Joseph Mukorivo",
    description: "Open-source tools, product experiments, and engineering work.",
    icon: "github"
  },
  "https://github.com/josemukorivo/config": {
    id: "config",
    title: "Config",
    description: "A configuration package for building reliable Go applications.",
    icon: "github"
  },
  "https://www.linkedin.com/in/josemukorivo": {
    id: "linkedin",
    title: "Joseph Mukorivo",
    description: "Engineering leadership, product building, and technology work.",
    icon: "linkedin"
  },
  "https://x.com/josemukorivo": {
    id: "x",
    title: "@josemukorivo",
    description: "Thoughts on engineering, products, AI, and the work in progress.",
    icon: "x"
  },
  "mailto:hello@josemukorivo.com": {
    id: "email",
    title: "Start a conversation",
    description: "Ideas, interesting products, and difficult systems problems are always welcome.",
    icon: "mail"
  }
};

const LINK_PREVIEW_TRANSLATIONS = {
  sn: {
    fortyone: {
      description: "AI project management inoconnecta ma goals ne daily work."
    },
    complexus: {
      description:
        "Product company inovaka software yakanyatsofungwa nema ideas matsva."
    },
    github: {
      description: "Open-source tools, product experiments, ne engineering work."
    },
    config: {
      description: "Configuration package yekuvaka reliable Go applications."
    },
    linkedin: {
      description: "Engineering leadership, product building, ne technology work."
    },
    x: {
      description: "Ma thoughts eengineering, products, AI, ne work in progress."
    },
    email: {
      title: "Tanga conversation",
      description:
        "Ma ideas, interesting products, nema difficult systems problems zvinogamuchirwa."
    }
  },
  fr: {
    fortyone: {
      description:
        "Gestion de projet par IA qui relie les objectifs au travail quotidien."
    },
    complexus: {
      description:
        "Une entreprise produit qui construit des logiciels réfléchis et de nouvelles idées."
    },
    github: {
      description:
        "Outils open source, expérimentations produit et travaux d’ingénierie."
    },
    config: {
      description:
        "Un package de configuration pour créer des applications Go fiables."
    },
    linkedin: {
      description:
        "Leadership technique, création de produits et travail technologique."
    },
    x: {
      description:
        "Réflexions sur l’ingénierie, les produits, l’IA et les travaux en cours."
    },
    email: {
      title: "Démarrer une conversation",
      description:
        "Les idées, produits intéressants et problèmes systèmes complexes sont les bienvenus."
    }
  },
  es: {
    fortyone: {
      description:
        "Gestión de proyectos con IA que conecta los objetivos con el trabajo diario."
    },
    complexus: {
      description:
        "Una empresa de producto que crea software cuidado y nuevas ideas."
    },
    github: {
      description:
        "Herramientas de código abierto, experimentos de producto y trabajo de ingeniería."
    },
    config: {
      description:
        "Un paquete de configuración para crear aplicaciones Go fiables."
    },
    linkedin: {
      description:
        "Liderazgo de ingeniería, creación de productos y trabajo tecnológico."
    },
    x: {
      description:
        "Ideas sobre ingeniería, productos, IA y el trabajo en curso."
    },
    email: {
      title: "Iniciar una conversación",
      description:
        "Las ideas, los productos interesantes y los problemas de sistemas complejos son bienvenidos."
    }
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

export function getLinkPreview(href, locale = "en") {
  const preview = LINK_PREVIEWS[normalizePreviewUrl(href)];

  if (!preview) {
    return null;
  }

  const translation = LINK_PREVIEW_TRANSLATIONS[locale]?.[preview.id];
  return translation ? { ...preview, ...translation } : preview;
}
