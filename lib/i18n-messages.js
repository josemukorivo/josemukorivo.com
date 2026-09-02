import "server-only";

export const MESSAGES = Object.freeze({
  en: {
    common: {
      index: "Index",
      language: "Language",
      switchLanguage: "Choose a language",
      viewInShona: "View in Shona",
      shonaSuggestion: "A little closer to home.",
      englishArticle: "This article is currently available in English.",
      readInEnglish: "Read the English version"
    },
    navigation: {
      ariaLabel: "Main navigation",
      home: "Home",
      writing: "Writing",
      projects: "Projects",
      assistant: "Talk to Maya",
      openAssistant: "Open Maya, Joseph’s AI assistant"
    },
    theme: {
      ariaLabel: "Color theme",
      toggle: {
        light: { action: "Switch to light mode" },
        dark: { action: "Switch to dark mode" }
      },
      options: {
        light: { label: "Light", action: "Use light theme" },
        system: { label: "System", action: "Use system theme" },
        dark: { label: "Dark", action: "Use dark theme" }
      }
    },
    assistantInvitation: {
      ariaLabel: "Maya invitation",
      dismissLabel: "Dismiss Maya invitation",
      general: {
        title: "Talk to Maya",
        description: "Ask about me, my work, and what I’m building."
      },
      article: {
        title: "Ask about this article",
        description: "Get a quick summary or explore the ideas behind it."
      },
      writing: {
        title: "Ask about my writing",
        description: "Explore an article or ask for a quick summary."
      },
      projects: {
        title: "Ask about these projects",
        description: "Get the story behind what I built and why."
      }
    },
    headerRole: "AI Product Engineer & Engineering Leader",
    home: {
      sections: {
        activity: "GitHub activity",
        experience: "Experience",
        writing: "Writing",
        projects: "Selected work",
        education: "Education"
      },
      introLead:
        "I build AI products and dependable software for complex work.",
      introProgress:
        "Over the past seven years, I’ve helped turn ambitious ideas into production systems people can rely on.",
      currentWorkPrefix: "Today, I lead engineering at",
      currentWorkCompanySuffix: "",
      currentWorkFounder: "and run",
      currentWorkJoin: "and",
      currentWorkEnd: ".",
      currentWorkAfter:
        "I set direction, build teams, and guide products from idea to launch.",
      introLocation:
        "I build AI products and dependable software for complex work, turning ambitious ideas into production systems people can rely on.",
      carePrefix: "I care about",
      careEdit: {
        draft: "myself",
        correction: "useful software"
      },
      careAfter:
        ", clear interfaces, reliable systems, and thoughtful details.",
      askMaya: "Ask Maya, my AI assistant",
      askMayaAfter: "to learn more about me.",
      socialLinks: {
        label: "Social and contact links",
        x: "X (Twitter)",
        github: "GitHub",
        linkedin: "LinkedIn",
        email: "Email Joseph",
        resume: "Résumé"
      },
      projectSlider: {
        previous: "Previous project",
        next: "Next project"
      },
      experienceSlider: {
        previous: "Previous experience",
        next: "Next experience"
      },
      allWriting: "All writing",
      allProjects: "All projects",
      github: {
        summary: "{count} public contributions in the last year",
        unavailable: "Public GitHub activity is temporarily unavailable.",
        profile: "View GitHub profile"
      },
      experienceItems: [
        {
          company: "Art Circles",
          role: "Head of Engineering",
          country: "United Kingdom",
          flag: "🇬🇧",
          arrangement: "Remote",
          date: "Jan 2026 — Now"
        },
        {
          company: "AMAKA Studio",
          role: "Lead Software Engineer",
          country: "United Kingdom",
          flag: "🇬🇧",
          arrangement: "Remote",
          date: "May 2024 — Dec 2025"
        },
        {
          company: "Fin",
          role: "Snr. Software Engineer",
          country: "Kenya",
          flag: "🇰🇪",
          arrangement: "On-site",
          date: "Dec 2022 — May 2024"
        },
        {
          company: "Vocinity",
          role: "Snr. Software Engineer",
          country: "United States",
          flag: "🇺🇸",
          arrangement: "Remote",
          date: "Apr 2021 — Mar 2023"
        },
        {
          company: "SIVIO Institute",
          role: "Software Engineer",
          country: "Zimbabwe",
          flag: "🇿🇼",
          arrangement: "On-site",
          date: "Mar 2020 — Jun 2021"
        },
        {
          company: "Reserve Bank of Zimbabwe",
          role: "Software Developer Intern",
          country: "Zimbabwe",
          flag: "🇿🇼",
          arrangement: "On-site",
          date: "2018"
        }
      ],
      mba: "Master of Business Administration (MBA)",
      mbaAfter:
        "National University of Science and Technology (NUST) — in progress.",
      degreePrefix: "I earned a",
      degree: "First Class BSc Honours in Information Technology",
      degreeAfter: "from Chinhoyi University of Technology in 2019."
    },
    writing: {
      title: "Writing",
      description:
        "Joseph Mukorivo’s writing on AI product engineering, software architecture, engineering leadership, and building complex systems.",
      empty: "No articles are available right now. Please check back soon.",
      minuteRead: "min read",
      minutesRead: "mins read",
      previous: "Previous article",
      next: "Next article"
    },
    projects: {
      title: "Projects",
      description:
        "Products, open-source tools, and companies I have built with care. Each one started with a problem worth understanding properly.",
      items: {
        fortyone: {
          meta: "Founder · Live product",
          short: "Strategy, feedback, and agentic project management.",
          description:
            "An agentic project management platform where Maya helps teams connect strategy to delivery, act on customer feedback, plan work, surface risk, and keep important AI-assisted changes reviewable."
        },
        config: {
          meta: "Open source · Go",
          short: "Reliable configuration for Go applications.",
          description:
            "An open-source configuration package for Go applications, designed to keep runtime settings clear, reliable, and easy to manage."
        },
        complexus: {
          meta: "Founder · Product company",
          short: "Product engineering and practical AI for complex work.",
          description:
            "A product company that brings product strategy, software engineering, and practical AI together to turn complex ideas into dependable systems."
        }
      }
    }
  },
  sn: {
    common: {
      index: "Kutanga",
      language: "Mutauro",
      switchLanguage: "Sarudza mutauro",
      viewInShona: "Verenga neChiShona",
      shonaSuggestion: "Zviri pedyo nekumba.",
      englishArticle: "Chinyorwa ichi parizvino chiri kuwanikwa neChirungu.",
      readInEnglish: "Verenga neChirungu"
    },
    navigation: {
      ariaLabel: "Main navigation",
      home: "Kumba",
      writing: "Zvinyorwa",
      projects: "Maprojects",
      assistant: "Taura naMaya",
      openAssistant: "Vhura Maya, AI agent yaJoseph"
    },
    theme: {
      ariaLabel: "Theme yemacolour",
      toggle: {
        light: { action: "Shandisa light theme" },
        dark: { action: "Shandisa dark theme" }
      },
      options: {
        light: { label: "Light", action: "Shandisa light theme" },
        system: { label: "System", action: "Shandisa system theme" },
        dark: { label: "Dark", action: "Shandisa dark theme" }
      }
    },
    assistantInvitation: {
      ariaLabel: "Invitation yaMaya",
      dismissLabel: "Vhara invitation yaMaya",
      general: {
        title: "Taura naMaya",
        description: "Bvunza nezvangu, basa rangu, nezvandiri kubuilda."
      },
      article: {
        title: "Bvunza nezve article iyi",
        description: "Wana summary pfupi kana kuona ma ideas ari mukati."
      },
      writing: {
        title: "Bvunza nezvezvinyorwa zvangu",
        description: "Tsvaga article kana kukumbira summary pfupi."
      },
      projects: {
        title: "Bvunza nezvema projects aya",
        description: "Inzwa story yekuti ndakaavakirei."
      }
    },
    headerRole: "Nyanzvi yeAI nemasoftware",
    home: {
      sections: {
        activity: "Basa paGitHub",
        experience: "Experience",
        writing: "Zvinyorwa",
        projects: "Basa rakasarudzwa",
        education: "Dzidzo"
      },
      introLead:
        "Ndinogadzira maAI products nemasoftware akavimbika emabasa akaoma.",
      introProgress:
        "Kwemakore anodarika seven, ndabatsira kushandura maideas makuru kuita masystems anoshandiswa zvechokwadi uye anovimbwa nevanhu.",
      currentWorkPrefix: "Parizvino, ndinotungamira engineering ku",
      currentWorkCompanySuffix: "",
      currentWorkFounder: "uye ndinotungamira",
      currentWorkJoin: "ne",
      currentWorkEnd: ".",
      currentWorkAfter:
        "Ndinoisa direction, ndinovaka teams, uye ndinotungamira maproducts kubva paidea kusvika palaunch.",
      introLocation:
        "Ndinogadzira maAI products nemasoftware akavimbika emabasa akaoma, ndichishandura maideas makuru kuita masystems anovimbwa nevanhu.",
      carePrefix: "Ndine hanya",
      careEdit: {
        draft: "neni",
        correction: "nesoftware inobatsira"
      },
      careAfter:
        ", mainterfaces akajeka, masystems akavimbika, nema details akanyatsofungwa.",
      askMaya: "Bvunza Maya, AI agent wangu",
      askMayaAfter: "kuti uzive zvakawanda nezvangu.",
      socialLinks: {
        label: "Masocial necontact links",
        x: "X (Twitter)",
        github: "GitHub",
        linkedin: "LinkedIn",
        email: "Tumira Joseph email",
        resume: "CV"
      },
      projectSlider: {
        previous: "Project yapfuura",
        next: "Project inotevera"
      },
      experienceSlider: {
        previous: "Experience yapfuura",
        next: "Experience inotevera"
      },
      allWriting: "Zvinyorwa zvose",
      allProjects: "Maprojects ose",
      github: {
        summary: "{count} public contributions mugore rapfuura",
        unavailable: "Public GitHub activity haisi kuwanikwa parizvino.",
        profile: "Ona GitHub profile"
      },
      experienceItems: [
        {
          company: "Art Circles",
          role: "Head of Engineering",
          country: "United Kingdom",
          flag: "🇬🇧",
          arrangement: "Remote",
          date: "Ndira 2026 — Iye zvino"
        },
        {
          company: "AMAKA Studio",
          role: "Lead Software Engineer",
          country: "United Kingdom",
          flag: "🇬🇧",
          arrangement: "Remote",
          date: "Chivabvu 2024 — Zvita 2025"
        },
        {
          company: "Fin",
          role: "Snr. Software Engineer",
          country: "Kenya",
          flag: "🇰🇪",
          arrangement: "On-site",
          date: "Zvita 2022 — Chivabvu 2024"
        },
        {
          company: "Vocinity",
          role: "Snr. Software Engineer",
          country: "United States",
          flag: "🇺🇸",
          arrangement: "Remote",
          date: "Kubvumbi 2021 — Kurume 2023"
        },
        {
          company: "SIVIO Institute",
          role: "Software Engineer",
          country: "Zimbabwe",
          flag: "🇿🇼",
          arrangement: "On-site",
          date: "Kurume 2020 — Chikumi 2021"
        },
        {
          company: "Reserve Bank of Zimbabwe",
          role: "Software Developer Intern",
          country: "Zimbabwe",
          flag: "🇿🇼",
          arrangement: "On-site",
          date: "2018"
        }
      ],
      mba: "Master of Business Administration (MBA)",
      mbaAfter:
        "National University of Science and Technology (NUST) — ndichiri kuidzidza.",
      degreePrefix: "Ndakawana",
      degree: "First Class BSc Honours in Information Technology",
      degreeAfter: "kuChinhoyi University of Technology muna 2019."
    },
    writing: {
      title: "Zvinyorwa",
      description:
        "Zvinyorwa zvaJoseph Mukorivo pamusoro peAI product engineering, software architecture, engineering leadership, nekuvaka masisitimu akaoma.",
      empty: "Parizvino hapana zvinyorwa. Dzokazve munguva pfupi.",
      minuteRead: "min yekuverenga",
      minutesRead: "mins dzekuverenga",
      previous: "Chinyorwa chapfuura",
      next: "Chinyorwa chinotevera"
    },
    projects: {
      title: "Maprojects",
      description:
        "Ma products, open-source tools, nema companies andakavaka zvine hanya. Chimwe nechimwe chakatanga neproblem yaifanira kunyatsonzwisiswa.",
      items: {
        fortyone: {
          meta: "Founder · Live product",
          short: "Strategy, customer feedback, ne agentic project management.",
          description:
            "Agentic project management system umo Maya anobatsira ma teams kuconnecta strategy ne delivery, kushandisa customer feedback, kuplana work, kuona risks, uye kuchengeta ma AI-assisted changes achigona kureviewiwa."
        },
        config: {
          meta: "Open source · Go",
          short: "Reliable configuration yema Go applications.",
          description:
            "Open-source configuration package yema Go applications, inoita kuti runtime settings dzive clear, reliable, uye easy kumanage."
        },
        complexus: {
          meta: "Founder · Product company",
          short: "Product engineering ne practical AI yezvinhu zvakaoma.",
          description:
            "Product company inosanganisa product strategy, software engineering, ne practical AI kuti ichinje ma ideas akaoma kuita reliable systems."
        }
      }
    }
  },
  fr: {
    common: {
      index: "Accueil",
      language: "Langue",
      switchLanguage: "Choisir une langue",
      viewInShona: "Voir en shona",
      shonaSuggestion: "Un peu plus près de chez moi.",
      englishArticle: "Cet article est actuellement disponible en anglais.",
      readInEnglish: "Lire la version anglaise"
    },
    navigation: {
      ariaLabel: "Navigation principale",
      home: "Accueil",
      writing: "Écrits",
      projects: "Projets",
      assistant: "Parler à Maya",
      openAssistant: "Ouvrir Maya, l’assistante IA de Joseph"
    },
    theme: {
      ariaLabel: "Thème de couleur",
      toggle: {
        light: { action: "Passer au thème clair" },
        dark: { action: "Passer au thème sombre" }
      },
      options: {
        light: { label: "Clair", action: "Utiliser le thème clair" },
        system: { label: "Système", action: "Utiliser le thème système" },
        dark: { label: "Sombre", action: "Utiliser le thème sombre" }
      }
    },
    assistantInvitation: {
      ariaLabel: "Invitation de Maya",
      dismissLabel: "Fermer l’invitation de Maya",
      general: {
        title: "Parler à Maya",
        description: "Posez vos questions sur mon travail et mes projets."
      },
      article: {
        title: "Interroger Maya sur cet article",
        description: "Obtenez un résumé rapide ou explorez ses idées."
      },
      writing: {
        title: "Interroger Maya sur mes écrits",
        description: "Découvrez un article ou demandez un résumé rapide."
      },
      projects: {
        title: "Interroger Maya sur ces projets",
        description: "Découvrez leur histoire et pourquoi je les ai créés."
      }
    },
    headerRole: "Ingénieur produit IA & responsable de l’ingénierie",
    home: {
      sections: {
        activity: "Activité GitHub",
        experience: "Expérience",
        writing: "Écrits",
        projects: "Travaux sélectionnés",
        education: "Formation"
      },
      introLead:
        "Je conçois des produits d’IA et des logiciels fiables pour des environnements complexes.",
      introProgress:
        "Depuis plus de sept ans, j’aide à transformer des idées ambitieuses en systèmes de production sur lesquels les utilisateurs peuvent compter.",
      currentWorkPrefix: "Aujourd’hui, je dirige l’ingénierie chez",
      currentWorkCompanySuffix: "",
      currentWorkFounder: "et je pilote",
      currentWorkJoin: "et",
      currentWorkEnd: ".",
      currentWorkAfter:
        "Je définis la direction, construis les équipes et guide les produits de l’idée au lancement.",
      introLocation:
        "Je conçois des produits d’IA et des logiciels fiables pour des environnements complexes, en transformant des idées ambitieuses en systèmes de production.",
      carePrefix: "Je me soucie",
      careEdit: {
        draft: "de moi-même",
        correction: "des logiciels utiles"
      },
      careAfter:
        ", des interfaces claires, des systèmes fiables et des détails bien pensés.",
      askMaya: "Demandez à Maya, mon assistante IA",
      askMayaAfter: "pour en savoir plus sur moi.",
      socialLinks: {
        label: "Réseaux sociaux et contact",
        x: "X (Twitter)",
        github: "GitHub",
        linkedin: "LinkedIn",
        email: "Écrire à Joseph",
        resume: "CV"
      },
      projectSlider: {
        previous: "Projet précédent",
        next: "Projet suivant"
      },
      experienceSlider: {
        previous: "Expérience précédente",
        next: "Expérience suivante"
      },
      allWriting: "Tous les articles",
      allProjects: "Tous les projets",
      github: {
        summary: "{count} contributions publiques au cours de l’année écoulée",
        unavailable: "L’activité GitHub publique est temporairement indisponible.",
        profile: "Voir le profil GitHub"
      },
      experienceItems: [
        {
          company: "Art Circles",
          role: "Head of Engineering",
          country: "Royaume-Uni",
          flag: "🇬🇧",
          arrangement: "À distance",
          date: "Jan. 2026 — Aujourd’hui"
        },
        {
          company: "AMAKA Studio",
          role: "Lead Software Engineer",
          country: "Royaume-Uni",
          flag: "🇬🇧",
          arrangement: "À distance",
          date: "Mai 2024 — Déc. 2025"
        },
        {
          company: "Fin",
          role: "Snr. Software Engineer",
          country: "Kenya",
          flag: "🇰🇪",
          arrangement: "Sur site",
          date: "Déc. 2022 — Mai 2024"
        },
        {
          company: "Vocinity",
          role: "Snr. Software Engineer",
          country: "États-Unis",
          flag: "🇺🇸",
          arrangement: "À distance",
          date: "Avr. 2021 — Mars 2023"
        },
        {
          company: "SIVIO Institute",
          role: "Software Engineer",
          country: "Zimbabwe",
          flag: "🇿🇼",
          arrangement: "Sur site",
          date: "Mars 2020 — Juin 2021"
        },
        {
          company: "Reserve Bank of Zimbabwe",
          role: "Software Developer Intern",
          country: "Zimbabwe",
          flag: "🇿🇼",
          arrangement: "Sur site",
          date: "2018"
        }
      ],
      mba: "Master of Business Administration (MBA)",
      mbaAfter:
        "National University of Science and Technology (NUST) — en cours.",
      degreePrefix: "J’ai obtenu un",
      degree: "BSc Honours en technologies de l’information, mention First Class",
      degreeAfter: "à la Chinhoyi University of Technology en 2019."
    },
    writing: {
      title: "Écrits",
      description:
        "Les écrits de Joseph Mukorivo sur l’ingénierie produit IA, l’architecture logicielle, le leadership technique et la construction de systèmes complexes.",
      empty: "Aucun article n’est disponible pour le moment.",
      minuteRead: "min de lecture",
      minutesRead: "min de lecture",
      previous: "Article précédent",
      next: "Article suivant"
    },
    projects: {
      title: "Projets",
      description:
        "Des produits, outils open source et entreprises que j’ai construits avec soin. Chacun est parti d’un problème qui méritait d’être bien compris.",
      items: {
        fortyone: {
          meta: "Fondateur · Produit en ligne",
          short: "Stratégie, retours clients et gestion de projet agentique.",
          description:
            "Une plateforme de gestion de projet agentique où Maya aide les équipes à relier stratégie et livraison, exploiter les retours clients, planifier, signaler les risques et garder les changements assistés par IA vérifiables."
        },
        config: {
          meta: "Open source · Go",
          short: "Configuration fiable pour les applications Go.",
          description:
            "Un package de configuration open source pour les applications Go, conçu pour rendre les paramètres d’exécution clairs, fiables et faciles à gérer."
        },
        complexus: {
          meta: "Fondateur · Entreprise produit",
          short: "Ingénierie produit et IA pratique pour les sujets complexes.",
          description:
            "Une entreprise produit qui associe stratégie produit, ingénierie logicielle et IA pratique pour transformer des idées complexes en systèmes fiables."
        }
      }
    }
  },
  es: {
    common: {
      index: "Inicio",
      language: "Idioma",
      switchLanguage: "Elegir un idioma",
      viewInShona: "Ver en shona",
      shonaSuggestion: "Un poco más cerca de casa.",
      englishArticle: "Este artículo está disponible actualmente en inglés.",
      readInEnglish: "Leer la versión en inglés"
    },
    navigation: {
      ariaLabel: "Navegación principal",
      home: "Inicio",
      writing: "Artículos",
      projects: "Proyectos",
      assistant: "Hablar con Maya",
      openAssistant: "Abrir Maya, la asistente de IA de Joseph"
    },
    theme: {
      ariaLabel: "Tema de color",
      toggle: {
        light: { action: "Cambiar al tema claro" },
        dark: { action: "Cambiar al tema oscuro" }
      },
      options: {
        light: { label: "Claro", action: "Usar el tema claro" },
        system: { label: "Sistema", action: "Usar el tema del sistema" },
        dark: { label: "Oscuro", action: "Usar el tema oscuro" }
      }
    },
    assistantInvitation: {
      ariaLabel: "Invitación de Maya",
      dismissLabel: "Cerrar la invitación de Maya",
      general: {
        title: "Hablar con Maya",
        description: "Pregunta por mí, mi trabajo y lo que estoy creando."
      },
      article: {
        title: "Pregunta por este artículo",
        description: "Obtén un resumen rápido o explora sus ideas."
      },
      writing: {
        title: "Pregunta por mis artículos",
        description: "Descubre un artículo o pide un resumen rápido."
      },
      projects: {
        title: "Pregunta por estos proyectos",
        description: "Descubre su historia y por qué los construí."
      }
    },
    headerRole: "Ingeniero de producto de IA y líder de ingeniería",
    home: {
      sections: {
        activity: "Actividad en GitHub",
        experience: "Experiencia",
        writing: "Artículos",
        projects: "Trabajo seleccionado",
        education: "Educación"
      },
      introLead:
        "Creo productos de IA y software fiable para entornos complejos.",
      introProgress:
        "Durante más de siete años, he ayudado a convertir ideas ambiciosas en sistemas de producción en los que las personas pueden confiar.",
      currentWorkPrefix: "Hoy lidero ingeniería en",
      currentWorkCompanySuffix: "",
      currentWorkFounder: "y dirijo",
      currentWorkJoin: "y",
      currentWorkEnd: ".",
      currentWorkAfter:
        "Marco la dirección, construyo equipos y guío los productos desde la idea hasta el lanzamiento.",
      introLocation:
        "Creo productos de IA y software fiable para entornos complejos, convirtiendo ideas ambiciosas en sistemas de producción.",
      carePrefix: "Me preocupo por",
      careEdit: {
        draft: "mí mismo",
        correction: "el software útil"
      },
      careAfter:
        ", las interfaces claras, los sistemas fiables y los detalles bien pensados.",
      askMaya: "Pregúntale a Maya, mi asistente de IA",
      askMayaAfter: "para saber más sobre mí.",
      socialLinks: {
        label: "Redes sociales y contacto",
        x: "X (Twitter)",
        github: "GitHub",
        linkedin: "LinkedIn",
        email: "Escribir a Joseph",
        resume: "Currículum"
      },
      projectSlider: {
        previous: "Proyecto anterior",
        next: "Proyecto siguiente"
      },
      experienceSlider: {
        previous: "Experiencia anterior",
        next: "Experiencia siguiente"
      },
      allWriting: "Todos los artículos",
      allProjects: "Todos los proyectos",
      github: {
        summary: "{count} contribuciones públicas en el último año",
        unavailable: "La actividad pública de GitHub no está disponible temporalmente.",
        profile: "Ver perfil de GitHub"
      },
      experienceItems: [
        {
          company: "Art Circles",
          role: "Head of Engineering",
          country: "Reino Unido",
          flag: "🇬🇧",
          arrangement: "Remoto",
          date: "Ene. 2026 — Actualidad"
        },
        {
          company: "AMAKA Studio",
          role: "Lead Software Engineer",
          country: "Reino Unido",
          flag: "🇬🇧",
          arrangement: "Remoto",
          date: "May. 2024 — Dic. 2025"
        },
        {
          company: "Fin",
          role: "Snr. Software Engineer",
          country: "Kenia",
          flag: "🇰🇪",
          arrangement: "Presencial",
          date: "Dic. 2022 — May. 2024"
        },
        {
          company: "Vocinity",
          role: "Snr. Software Engineer",
          country: "Estados Unidos",
          flag: "🇺🇸",
          arrangement: "Remoto",
          date: "Abr. 2021 — Mar. 2023"
        },
        {
          company: "SIVIO Institute",
          role: "Software Engineer",
          country: "Zimbabue",
          flag: "🇿🇼",
          arrangement: "Presencial",
          date: "Mar. 2020 — Jun. 2021"
        },
        {
          company: "Reserve Bank of Zimbabwe",
          role: "Software Developer Intern",
          country: "Zimbabue",
          flag: "🇿🇼",
          arrangement: "Presencial",
          date: "2018"
        }
      ],
      mba: "Máster en Administración de Empresas (MBA)",
      mbaAfter:
        "National University of Science and Technology (NUST) — en curso.",
      degreePrefix: "Obtuve un",
      degree: "BSc Honours en Tecnologías de la Información con First Class",
      degreeAfter: "en Chinhoyi University of Technology en 2019."
    },
    writing: {
      title: "Artículos",
      description:
        "Los artículos de Joseph Mukorivo sobre ingeniería de producto de IA, arquitectura de software, liderazgo de ingeniería y construcción de sistemas complejos.",
      empty: "No hay artículos disponibles en este momento.",
      minuteRead: "min de lectura",
      minutesRead: "min de lectura",
      previous: "Artículo anterior",
      next: "Artículo siguiente"
    },
    projects: {
      title: "Proyectos",
      description:
        "Productos, herramientas de código abierto y empresas que he construido con cuidado. Cada uno comenzó con un problema que merecía entenderse bien.",
      items: {
        fortyone: {
          meta: "Fundador · Producto activo",
          short: "Estrategia, comentarios y gestión de proyectos agéntica.",
          description:
            "Una plataforma de gestión de proyectos agéntica donde Maya ayuda a los equipos a conectar estrategia y entrega, actuar sobre comentarios de clientes, planificar, detectar riesgos y mantener revisables los cambios importantes asistidos por IA."
        },
        config: {
          meta: "Código abierto · Go",
          short: "Configuración fiable para aplicaciones Go.",
          description:
            "Un paquete de configuración de código abierto para aplicaciones Go, diseñado para mantener los ajustes de ejecución claros, fiables y fáciles de gestionar."
        },
        complexus: {
          meta: "Fundador · Empresa de producto",
          short: "Ingeniería de producto e IA práctica para trabajos complejos.",
          description:
            "Una empresa de producto que une estrategia, ingeniería de software e IA práctica para convertir ideas complejas en sistemas fiables."
        }
      }
    }
  }
});
