export const TRUST_PAGES = Object.freeze({
  about: {
    title: "About",
    description:
      "About Joseph Mukorivo, his engineering work, leadership experience, and approach to building practical AI products.",
    sections: [
      {
        heading: "Work",
        paragraphs: [
          "I’m Joseph Mukorivo, an AI product engineer, engineering leader, and founder based in Harare, Zimbabwe. I have more than seven years of experience building production software across frontend, backend, cloud, data, and applied AI systems. I currently lead engineering at Art Circles, where I set technical direction, shape AI strategy, and guide product delivery.",
          "I founded Complexus, an independent Zimbabwean software company, and built FortyOne, an agentic project management platform that connects company goals, customer feedback, planning, and delivery. My AI work includes tool-using agents, conversational and voice interfaces, structured automation, analytics, and human review for consequential actions."
        ]
      },
      {
        heading: "How I work",
        paragraphs: [
          "I work from the problem outward: understand the people and constraints, make the system boundaries explicit, and then choose technology that can be operated reliably. I care about useful software, clear interfaces, secure defaults, observable systems, and small details that make a product feel considered.",
          "My experience includes fintech and regulated environments, remote product teams in Africa and the United States, and hands-on delivery from early product definition through architecture, implementation, launch, and iteration. I earned a First Class BSc Honours in Information Technology from Chinhoyi University of Technology and I am completing an MBA at the National University of Science and Technology."
        ]
      }
    ]
  },
  contact: {
    title: "Contact",
    description:
      "How to contact Joseph Mukorivo about engineering leadership, applied AI, product work, writing, and professional collaboration.",
    sections: [
      {
        heading: "The best way to reach me",
        paragraphs: [
          "Email me at hello@josemukorivo.com. Please include who you are, the organization or project you are writing about, the problem you are trying to solve, and any timing that matters. That context helps me give you a useful reply without a long introductory exchange.",
          "I’m most useful for conversations about engineering leadership, product and software architecture, practical AI systems, agent and voice experiences, technical product strategy, and building dependable full-stack products. I also welcome thoughtful questions about my published writing and open-source work."
        ]
      },
      {
        heading: "What happens next",
        paragraphs: [
          "Messages sent through this website’s assistant are prepared for review first. The assistant cannot send a message on a visitor’s behalf until the visitor confirms the final name, email address, and message in the interface. Direct email remains the simplest option when you already know what you want to discuss.",
          "You can also find my public work on GitHub, connect with me on LinkedIn, or follow me on X. I do not publish a telephone number or street address on this site. My professional base and contact address are in Harare, Zimbabwe. Please do not send unsolicited mailing lists, bulk sales messages, or requests involving access to systems or information you are not authorized to use."
        ]
      }
    ]
  },
  privacy: {
    title: "Privacy",
    description:
      "Privacy information for josemukorivo.com, including analytics, the AI assistant, contact messages, cookies, and visitor choices.",
    sections: [
      {
        heading: "Information this site handles",
        paragraphs: [
          "This site can be read without creating an account. Basic technical and usage information may be collected to understand whether pages work, which content is useful, and where errors occur. This can include a truncated or derived network identifier, browser and device information, referring pages, visited routes, interaction events, and approximate location. The site also stores limited preferences, such as language, theme, and whether an assistant invitation was dismissed.",
          "If you use Maya, the AI assistant, the text you submit and relevant page context are sent to the services needed to produce an answer. Voice use additionally processes microphone audio and realtime session events. Usage controls record enough session state to enforce limits and close abandoned sessions. Do not submit confidential, sensitive, or regulated information to the assistant."
        ]
      },
      {
        heading: "Contact messages and your choices",
        paragraphs: [
          "If you choose to send a contact message, the site processes your name, email address, message, and anti-abuse signals so the message can be delivered and answered. The assistant only prepares a draft; you must review and confirm it before it is sent. Submitted messages may be retained for correspondence, security, and abuse prevention, and are shared only with service providers needed to operate the site or when required by law.",
          "You may block optional browser storage, decline microphone access, avoid the assistant, or contact me directly by email. To ask what personal information you have submitted, request correction or deletion, or raise a privacy concern, email hello@josemukorivo.com. Requests are handled subject to reasonable identity verification and any legal or security obligations that require limited retention. This notice may change when the site’s features or providers change; the current version applies from 22 August 2026."
        ]
      }
    ]
  }
});

export function getTrustPageText(page) {
  return page.sections
    .flatMap((section) => [section.heading, ...section.paragraphs])
    .join("\n\n");
}
