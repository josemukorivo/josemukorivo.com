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
      home: "Home",
      writing: "Writing",
      projects: "Projects",
      assistant: "Talk to Maya"
    },
    headerRole: "AI Product Engineer & Engineering Leader",
    home: {
      sections: {
        writing: "Writing",
        projects: "Projects",
        building: "Building",
        education: "Education",
        connect: "Connect"
      },
      rolePrefix: "I’m an",
      role: "AI product engineer and engineering leader🔧",
      introLocation:
        "Harare, Zimbabwe 🇿🇼 is home. I build production software and AI systems—from secure full-stack products to agents, conversational and voice interfaces, automation, and human-in-the-loop workflows—that people can depend on beyond a demo.",
      introBeforeEdit:
        "Harare, Zimbabwe 🇿🇼 is home. I build production software and AI systems—from secure full-stack products to agents, conversational and voice interfaces, automation, and human-in-the-loop workflows—that people can depend on beyond a",
      introDraft: "prototype",
      introCorrection: "demo",
      founderPrefix: "I founded",
      founderJoin: "and built",
      founderAfter:
        "an agentic project management platform connecting company goals, customer feedback, planning, and delivery. I currently lead engineering at Art Circles, setting technical direction, shaping AI strategy, and guiding product delivery.",
      workPrefix: "My work combines",
      technicalLeadership: "technical leadership",
      workAfter:
        "product strategy, project management, and hands-on engineering across secure full-stack systems, cloud architecture, analytics, and integrations—often in fintech and regulated environments where details matter.",
      care:
        "I care about useful software, clear interfaces, reliable systems, and thoughtful details.",
      askMaya: "Ask Maya, my AI assistant",
      askMayaAfter: "to learn more about me.",
      findPrefix: "Find me on",
      readMy: "read my",
      writingLink: "writing",
      emailLink: "send me an email",
      socialOr: "or",
      allWriting: "All writing",
      allProjects: "All projects",
      liveProduct: "Live product",
      buildingParagraphs: [
        "FortyOne is an agentic project management platform that connects strategy, customer feedback, planning, and daily delivery. I built Maya to turn requests into planned work, suggest owners and estimates, answer workspace questions, and surface delivery risk while keeping important changes reviewable.",
        "Company strategy starts with objectives and key results. Teams can map how goals relate, connect them to roadmaps and planned work, and see whether daily delivery is moving the outcomes they committed to.",
        "Customer feedback lives in the same flow. Teams can collect and prioritize requests, move accepted ideas into the plan, and let customers follow their progress on a public roadmap."
      ],
      mba: "Master of Business Administration (MBA)",
      mbaAfter:
        "National University of Science and Technology (NUST) — in progress.",
      degreePrefix: "I earned a",
      degree: "First Class BSc Honours in Information Technology",
      degreeAfter: "from Chinhoyi University of Technology in 2019.",
      connectPrefix: "Reach me at",
      connectLinkedIn: "find me on",
      connectX: "follow me on",
      connectResume: "or view my",
      resume: "résumé"
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
          short: "Strategy, feedback, and agentic project management.",
          description:
            "An agentic project management platform where Maya helps teams connect strategy to delivery, act on customer feedback, plan work, surface risk, and keep important AI-assisted changes reviewable."
        },
        config: {
          short: "Reliable configuration for Go applications.",
          description:
            "An open-source configuration package for Go applications, designed to keep runtime settings clear, reliable, and easy to manage."
        },
        complexus: {
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
      home: "Kumba",
      writing: "Zvinyorwa",
      projects: "Maprojects",
      assistant: "Taura naMaya"
    },
    headerRole: "Nyanzvi yeAI nemasoftware",
    home: {
      sections: {
        writing: "Zvinyorwa",
        projects: "Maprojects",
        building: "Zvandiri kubuilda",
        education: "Dzidzo",
        connect: "Bata neni"
      },
      rolePrefix: "Ndiri",
      role: "nyanzvi yeAI nemasoftware🔧",
      introLocation:
        "Harare, Zimbabwe 🇿🇼 ndiko kumba. Ndinogadzira ma software nema AI systems anoshandiswa zvechokwadi—kubva kuma secure full-stack products kusvika kuma agents, automation, nema workflows ekuti vanhu ndivo vanofinaliza ma decisions—zvinhu zvinogona kuvimbwa nazvo kupfuura kungova demo.",
      introBeforeEdit:
        "Harare, Zimbabwe 🇿🇼 ndiko kumba. Ndinogadzira ma software nema AI systems anoshandiswa zvechokwadi—kubva kuma secure full-stack products kusvika kuma agents, automation, nema workflows ekuti vanhu ndivo vanofinaliza ma decisions—zvinhu zvinogona kuvimbwa nazvo kupfuura kungova",
      introDraft: "prototype",
      introCorrection: "demo",
      founderPrefix: "Ndakavhura company inonzi",
      founderJoin: "uye ndikagadzira system inonzi",
      founderAfter:
        "inobatsira paagentic project management, ichibatanidza ma goals ecompany, feedback kubva kuma customers, planning, neku delivery. Parizvino ndinotungamira engineering kuArt Circles, ndichiseta technical direction, AI strategy, nekuona kuti ma products asvika chaipo chaipo 😂.",
      workPrefix: "Basa rangu rinosanganisa",
      technicalLeadership: "technical leadership",
      workAfter:
        "product strategy, project management, ne hands-on engineering kuma secure full-stack systems, cloud architecture, analytics, ne integrations. Experience yangu yakawandira mu FinTech nemamwe ma regulated environments.",
      care:
        "Ndinofarira ma software anobatsira, ma interface akajeka, ma systems akavimbika, nema details akanyatsofungwa.",
      askMaya: "Bvunza Maya, AI agent wangu",
      askMayaAfter: "kuti uzive zvakawanda nezvangu.",
      findPrefix: "Ndiwane pa",
      readMy: "verenga",
      writingLink: "zvinyorwa zvangu",
      emailLink: "nditumire email",
      socialOr: "kana",
      allWriting: "Zvinyorwa zvose",
      allProjects: "Maprojects ose",
      liveProduct: "Live product",
      buildingParagraphs: [
        "FortyOne iagentic project management system inobatanidza strategy, customer feedback, planning, ne daily delivery. Ndakagadzira Maya kuti achinje ma requests kuita planned work, ape suggestions dzeowners nema estimates, apindure mibvunzo yeworkspace, uye aratidze delivery risks achichengeta ma changes akakosha achigona kureviewiwa.",
        "Company strategy inotanga nema objectives nema key results. Ma teams anogona kuona kuti ma goals akabatana sei, kuconnecta kuma roadmaps ne planned work, uye kuona kana daily delivery iri kufambisa ma outcomes avakavimbisa.",
        "Customer feedback inogara muflow imwe chete. Ma teams anogona kucollecta nekuprioritiza ma requests, kuisa ma ideas agamuchirwa muplan, uye kurega ma customers vachiona progress paparuzhinji roadmap."
      ],
      mba: "Master of Business Administration (MBA)",
      mbaAfter:
        "National University of Science and Technology (NUST) — ndichiri kuidzidza.",
      degreePrefix: "Ndakawana",
      degree: "First Class BSc Honours in Information Technology",
      degreeAfter: "kuChinhoyi University of Technology muna 2019.",
      connectPrefix: "Ndisvikire pa",
      connectLinkedIn: "ndiwane pa",
      connectX: "nditevere pa",
      connectResume: "kana kuona",
      resume: "CV yangu"
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
          short: "Strategy, customer feedback, ne agentic project management.",
          description:
            "Agentic project management system umo Maya anobatsira ma teams kuconnecta strategy ne delivery, kushandisa customer feedback, kuplana work, kuona risks, uye kuchengeta ma AI-assisted changes achigona kureviewiwa."
        },
        config: {
          short: "Reliable configuration yema Go applications.",
          description:
            "Open-source configuration package yema Go applications, inoita kuti runtime settings dzive clear, reliable, uye easy kumanage."
        },
        complexus: {
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
      home: "Accueil",
      writing: "Écrits",
      projects: "Projets",
      assistant: "Parler à Maya"
    },
    headerRole: "Ingénieur produit IA & responsable de l’ingénierie",
    home: {
      sections: {
        writing: "Écrits",
        projects: "Projets",
        building: "En construction",
        education: "Formation",
        connect: "Contact"
      },
      rolePrefix: "Je suis",
      role: "ingénieur produit IA et responsable de l’ingénierie🔧",
      introLocation:
        "Harare, Zimbabwe 🇿🇼 est chez moi. Je construis des logiciels et des systèmes d’IA en production — des produits full-stack sécurisés aux agents, interfaces conversationnelles et vocales, automatisations et workflows avec supervision humaine — sur lesquels les gens peuvent compter au-delà d’une simple démo.",
      introBeforeEdit:
        "Harare, Zimbabwe 🇿🇼 est chez moi. Je construis des logiciels et des systèmes d’IA en production — des produits full-stack sécurisés aux agents, interfaces conversationnelles et vocales, automatisations et workflows avec supervision humaine — sur lesquels les gens peuvent compter au-delà d’un simple",
      introDraft: "prototype",
      introCorrection: "démo",
      founderPrefix: "J’ai fondé",
      founderJoin: "et construit",
      founderAfter:
        "une plateforme de gestion de projet agentique qui relie objectifs d’entreprise, retours clients, planification et livraison. Je dirige actuellement l’ingénierie chez Art Circles, où je définis la direction technique, la stratégie IA et la livraison produit.",
      workPrefix: "Mon travail associe",
      technicalLeadership: "leadership technique",
      workAfter:
        "stratégie produit, gestion de projet et ingénierie pratique sur des systèmes full-stack sécurisés, l’architecture cloud, l’analytique et les intégrations — souvent dans la fintech et des environnements réglementés où les détails comptent.",
      care:
        "J’accorde de l’importance aux logiciels utiles, aux interfaces claires, aux systèmes fiables et aux détails bien pensés.",
      askMaya: "Demandez à Maya, mon assistante IA",
      askMayaAfter: "pour en savoir plus sur moi.",
      findPrefix: "Retrouvez-moi sur",
      readMy: "lisez mes",
      writingLink: "articles",
      emailLink: "envoyez-moi un e-mail",
      socialOr: "ou",
      allWriting: "Tous les articles",
      allProjects: "Tous les projets",
      liveProduct: "Produit en ligne",
      buildingParagraphs: [
        "FortyOne est une plateforme de gestion de projet agentique qui relie stratégie, retours clients, planification et livraison quotidienne. J’ai conçu Maya pour transformer les demandes en travail planifié, suggérer responsables et estimations, répondre aux questions de l’espace de travail et signaler les risques tout en gardant les changements importants vérifiables.",
        "La stratégie d’entreprise commence par les objectifs et résultats clés. Les équipes peuvent relier leurs objectifs, les connecter aux feuilles de route et au travail planifié, puis voir si la livraison quotidienne produit les résultats attendus.",
        "Les retours clients suivent le même flux. Les équipes peuvent collecter et prioriser les demandes, intégrer les idées acceptées au plan et permettre aux clients de suivre leur progression sur une feuille de route publique."
      ],
      mba: "Master of Business Administration (MBA)",
      mbaAfter:
        "National University of Science and Technology (NUST) — en cours.",
      degreePrefix: "J’ai obtenu un",
      degree: "BSc Honours en technologies de l’information, mention First Class",
      degreeAfter: "à la Chinhoyi University of Technology en 2019.",
      connectPrefix: "Écrivez-moi à",
      connectLinkedIn: "retrouvez-moi sur",
      connectX: "suivez-moi sur",
      connectResume: "ou consultez mon",
      resume: "CV"
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
          short: "Stratégie, retours clients et gestion de projet agentique.",
          description:
            "Une plateforme de gestion de projet agentique où Maya aide les équipes à relier stratégie et livraison, exploiter les retours clients, planifier, signaler les risques et garder les changements assistés par IA vérifiables."
        },
        config: {
          short: "Configuration fiable pour les applications Go.",
          description:
            "Un package de configuration open source pour les applications Go, conçu pour rendre les paramètres d’exécution clairs, fiables et faciles à gérer."
        },
        complexus: {
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
      home: "Inicio",
      writing: "Artículos",
      projects: "Proyectos",
      assistant: "Hablar con Maya"
    },
    headerRole: "Ingeniero de producto de IA y líder de ingeniería",
    home: {
      sections: {
        writing: "Artículos",
        projects: "Proyectos",
        building: "Construyendo",
        education: "Educación",
        connect: "Contacto"
      },
      rolePrefix: "Soy",
      role: "ingeniero de producto de IA y líder de ingeniería🔧",
      introLocation:
        "Harare, Zimbabue 🇿🇼 es mi hogar. Construyo software y sistemas de IA en producción —desde productos full-stack seguros hasta agentes, interfaces conversacionales y de voz, automatización y flujos con supervisión humana— en los que las personas pueden confiar más allá de una demostración.",
      introBeforeEdit:
        "Harare, Zimbabue 🇿🇼 es mi hogar. Construyo software y sistemas de IA en producción —desde productos full-stack seguros hasta agentes, interfaces conversacionales y de voz, automatización y flujos con supervisión humana— en los que las personas pueden confiar más allá de un simple",
      introDraft: "prototipo",
      introCorrection: "demo",
      founderPrefix: "Fundé",
      founderJoin: "y construí",
      founderAfter:
        "una plataforma de gestión de proyectos agéntica que conecta objetivos empresariales, comentarios de clientes, planificación y entrega. Actualmente lidero ingeniería en Art Circles, definiendo la dirección técnica, la estrategia de IA y la entrega de producto.",
      workPrefix: "Mi trabajo combina",
      technicalLeadership: "liderazgo técnico",
      workAfter:
        "estrategia de producto, gestión de proyectos e ingeniería práctica en sistemas full-stack seguros, arquitectura cloud, analítica e integraciones, a menudo en fintech y entornos regulados donde los detalles importan.",
      care:
        "Me importa el software útil, las interfaces claras, los sistemas fiables y los detalles bien pensados.",
      askMaya: "Pregúntale a Maya, mi asistente de IA",
      askMayaAfter: "para saber más sobre mí.",
      findPrefix: "Encuéntrame en",
      readMy: "lee mis",
      writingLink: "artículos",
      emailLink: "envíame un correo",
      socialOr: "o",
      allWriting: "Todos los artículos",
      allProjects: "Todos los proyectos",
      liveProduct: "Producto activo",
      buildingParagraphs: [
        "FortyOne es una plataforma de gestión de proyectos agéntica que conecta estrategia, comentarios de clientes, planificación y entrega diaria. Construí Maya para convertir solicitudes en trabajo planificado, sugerir responsables y estimaciones, responder preguntas del espacio de trabajo y señalar riesgos manteniendo los cambios importantes revisables.",
        "La estrategia empresarial comienza con objetivos y resultados clave. Los equipos pueden relacionar objetivos, conectarlos con hojas de ruta y trabajo planificado, y comprobar si la entrega diaria impulsa los resultados comprometidos.",
        "Los comentarios de clientes viven en el mismo flujo. Los equipos pueden recopilar y priorizar solicitudes, incorporar las ideas aceptadas al plan y permitir que los clientes sigan su progreso en una hoja de ruta pública."
      ],
      mba: "Máster en Administración de Empresas (MBA)",
      mbaAfter:
        "National University of Science and Technology (NUST) — en curso.",
      degreePrefix: "Obtuve un",
      degree: "BSc Honours en Tecnologías de la Información con First Class",
      degreeAfter: "en Chinhoyi University of Technology en 2019.",
      connectPrefix: "Escríbeme a",
      connectLinkedIn: "encuéntrame en",
      connectX: "sígueme en",
      connectResume: "o consulta mi",
      resume: "currículum"
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
          short: "Estrategia, comentarios y gestión de proyectos agéntica.",
          description:
            "Una plataforma de gestión de proyectos agéntica donde Maya ayuda a los equipos a conectar estrategia y entrega, actuar sobre comentarios de clientes, planificar, detectar riesgos y mantener revisables los cambios importantes asistidos por IA."
        },
        config: {
          short: "Configuración fiable para aplicaciones Go.",
          description:
            "Un paquete de configuración de código abierto para aplicaciones Go, diseñado para mantener los ajustes de ejecución claros, fiables y fáciles de gestionar."
        },
        complexus: {
          short: "Ingeniería de producto e IA práctica para trabajos complejos.",
          description:
            "Una empresa de producto que une estrategia, ingeniería de software e IA práctica para convertir ideas complejas en sistemas fiables."
        }
      }
    }
  }
});
