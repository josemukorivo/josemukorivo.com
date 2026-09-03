import Image from "next/image";
import { ExternalMark } from "../_components/external-link";
import { BackLink } from "../_components/back-link";
import { JsonLd } from "../_components/json-ld";
import { PageShell } from "../_components/page-shell";
import { PreviewLink } from "../_components/preview-link";
import { getLinkPreview } from "../../lib/link-previews";
import { localizePath } from "../../lib/i18n-config";
import { getMessages, getRequestLocale } from "../../lib/i18n-server";
import { projects } from "../../lib/projects";
import { createPageMetadata } from "../../lib/seo";
import { PERSON_ID, SITE_URL, WEBSITE_ID } from "../../lib/site";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return createPageMetadata({
    title: messages.projects.title,
    socialTitle: `${messages.projects.title} — Joseph Mukorivo`,
    description: messages.projects.description,
    path: localizePath("/projects", locale),
    locale,
    keywords: [
      "Joseph Mukorivo projects",
      "AI product engineering",
      "AI agents",
      "FortyOne",
      "Complexus",
      "Go open source"
    ]
  });
}

export default async function ProjectsPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const localizedProjects = projects.map((project) => ({
    ...project,
    description:
      messages.projects.items[project.id]?.description ?? project.description
  }));
  const description = messages.projects.description;
  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/projects#projects`,
    url: `${SITE_URL}${localizePath("/projects", locale)}`,
    name: `Joseph Mukorivo — ${messages.projects.title}`,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@id": PERSON_ID },
    numberOfItems: localizedProjects.length,
    itemListElement: localizedProjects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: project.href,
      name: project.name
    }))
  };

  return (
    <PageShell variant="writing">
      <JsonLd data={projectsSchema} />
      <header
        className="grid grid-cols-[160px_minmax(0,1fr)] items-start gap-x-10 max-[680px]:grid-cols-1"
        data-reveal="page-header"
      >
        <div data-reveal-item>
          <BackLink
            href={localizePath("/", locale)}
            label={messages.navigation.home}
          />
        </div>
        <div
          className="reveal-page-heading max-[680px]:mt-10"
          data-reveal-item
        >
          <h1 className="text-base font-medium leading-6">
            {messages.projects.title}
          </h1>
          <p className="mt-4 max-w-[560px] text-subtle">
            {messages.projects.description}
          </p>
        </div>
      </header>

      <section
        aria-label="Selected projects"
        className="project-index ml-[200px] mt-[64px] max-w-[640px] max-[680px]:ml-0 max-[680px]:mt-12 max-[680px]:max-w-none"
        data-reveal="project-list"
      >
        {localizedProjects.map((project) => (
          <PreviewLink
            className="project-index-row"
            data-reveal-item
            href={project.href}
            key={project.id}
            preview={getLinkPreview(project.href)}
          >
            <span aria-hidden="true" className="project-index-media">
              <Image
                alt=""
                fill
                sizes="(max-width: 680px) calc(100vw - 36px), 232px"
                src={project.image}
              />
            </span>
            <span className="project-index-copy">
              <span className="project-index-identity">
                <span className="project-index-name">
                  {project.name}
                  <ExternalMark />
                </span>
                <span className="project-index-domain">{project.domain}</span>
              </span>
              <span className="project-index-description">
                {project.description}
              </span>
            </span>
          </PreviewLink>
        ))}
      </section>
    </PageShell>
  );
}
