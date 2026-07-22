import "server-only";

import { tool } from "ai";
import { z } from "zod";
import { RESUME_HREF, searchWriting } from "./assistant-profile";

const contactMessageSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  message: z.string().trim().min(10).max(2_000),
  name: z.string().trim().min(2).max(80)
});

const TOOL_DEFINITIONS = {
  prepareContactMessage: {
    description:
      "Prepare a visitor's completed message for explicit review and confirmation before it is emailed to Joseph. This tool does not send the message. Call it only after the visitor has provided their name, email address, and complete message.",
    inputSchema: contactMessageSchema,
    execute: ({ email, message, name }) => ({
      kind: "contact-draft",
      email,
      message,
      name
    })
  },
  showResume: {
    description:
      "Show Joseph's public resume when a visitor asks to see, open, or download it.",
    inputSchema: z.object({}),
    execute: () => ({
      kind: "resume",
      title: "Joseph Mukorivo — Head of Engineering",
      href: RESUME_HREF,
      description:
        "A two-page resume covering engineering leadership, AI products, full-stack systems, fintech, cloud infrastructure, and selected impact."
    })
  },
  showJosephPhotos: {
    description:
      "Show approved photos of Joseph. Use both for a general request; use professional or workspace only when the visitor explicitly requests that image or asks for a single image.",
    inputSchema: z.object({
      view: z
        .enum(["professional", "workspace", "both"])
        .describe(
          "Choose both unless the visitor explicitly requests one image or a specific view."
        )
    }),
    execute: ({ view }) => {
      const photos = {
        professional: {
          src: "/assets/joseph-professional.webp",
          alt: "Professional portrait of Joseph Mukorivo",
          label: "Joseph Mukorivo"
        },
        workspace: {
          src: "/assets/joseph-workspace.webp",
          alt: "Joseph Mukorivo at his home workspace",
          label: "At his workspace"
        }
      };

      return {
        kind: "photos",
        images:
          view === "both"
            ? [photos.professional, photos.workspace]
            : [photos[view]]
      };
    }
  },
  showProject: {
    description:
      "Show a project card when a visitor asks about FortyOne, Config, or Complexus.",
    inputSchema: z.object({
      project: z.enum(["fortyone", "config", "complexus"])
    }),
    execute: ({ project }, { projects }) => {
      const selectedProject = projects.find((item) => item.id === project);

      return selectedProject
        ? {
            kind: "project",
            name: selectedProject.name,
            href: selectedProject.href,
            description: selectedProject.description
          }
        : null;
    }
  },
  searchWriting: {
    description:
      "Search Joseph's published writing for relevant articles and supporting context.",
    inputSchema: z.object({
      query: z.string().min(2).max(160)
    }),
    execute: ({ query }, { articles }) => ({
      kind: "articles",
      results: searchWriting(articles, query)
    })
  },
  readArticle: {
    description:
      "Load the complete content of one of Joseph's published articles before summarizing, explaining, or discussing its ideas.",
    inputSchema: z.object({
      slug: z.string().min(2).max(180)
    }),
    execute: ({ slug }, { articles }) => {
      const article = articles.find((item) => item.slug === slug);

      if (!article) {
        return {
          kind: "article-not-found",
          error: "That article could not be found."
        };
      }

      return {
        kind: "article",
        title: article.title,
        href: `/blog/${article.slug}`,
        description: article.description,
        publishedAt: article.publishedAt,
        readingTimeMinutes: article.readingTimeMinutes,
        content: article.content
      };
    }
  },
  openArticle: {
    description:
      "Navigate the visitor to one of Joseph's published articles when they ask to open, view, visit, or read it on the website.",
    inputSchema: z.object({
      slug: z.string().min(2).max(180)
    }),
    execute: ({ slug }, { articles }) => {
      const article = articles.find((item) => item.slug === slug);

      if (!article) {
        return {
          kind: "navigation-error",
          error: "That article could not be found."
        };
      }

      return {
        kind: "navigation",
        route: `/blog/${article.slug}`,
        title: article.title,
        message: `Opening “${article.title}”`
      };
    }
  },
  setTheme: {
    description:
      "Change the website's color theme when the visitor explicitly asks to use light mode, dark mode, or their system preference.",
    inputSchema: z.object({
      theme: z
        .enum(["light", "dark", "system"])
        .describe("The color theme the visitor asked to use.")
    }),
    execute: ({ theme }) => ({
      kind: "theme",
      theme
    })
  },
  endConversation: {
    description:
      "End the realtime voice conversation after the visitor clearly says bye, goodbye, that's all, talk later, or otherwise indicates they are finished.",
    inputSchema: z.object({}),
    realtimeOnly: true,
    execute: () => ({
      kind: "conversation-end",
      success: true
    })
  }
};

function getToolEntries({ includeRealtimeOnly = false } = {}) {
  return Object.entries(TOOL_DEFINITIONS).filter(
    ([, definition]) => includeRealtimeOnly || !definition.realtimeOnly
  );
}

function toRealtimeParameters(inputSchema) {
  const { $schema: _schema, ...parameters } = z.toJSONSchema(inputSchema);
  return parameters;
}

export function createAssistantTools(context) {
  return Object.fromEntries(
    getToolEntries().map(([name, definition]) => [
      name,
      tool({
        description: definition.description,
        inputSchema: definition.inputSchema,
        execute: (input) => definition.execute(input, context)
      })
    ])
  );
}

export function createRealtimeAssistantTools() {
  return getToolEntries({ includeRealtimeOnly: true }).map(
    ([name, definition]) => ({
      type: "function",
      name,
      description: definition.description,
      parameters: toRealtimeParameters(definition.inputSchema)
    })
  );
}

export async function executeAssistantTool(name, input, context) {
  const definition = TOOL_DEFINITIONS[name];

  if (!definition) {
    throw new Error("Unsupported assistant tool.");
  }

  const parsedInput = definition.inputSchema.parse(input ?? {});
  return definition.execute(parsedInput, context);
}
