import Image from "next/image";
import { ExternalMark } from "../_components/external-link";
import { IndexLink } from "../_components/index-link";
import { JsonLd } from "../_components/json-ld";
import { PageShell } from "../_components/page-shell";
import { PreviewLink } from "../_components/preview-link";
import { getLinkPreview } from "../../lib/link-previews";
import { projects } from "../../lib/projects";
import { createPageMetadata } from "../../lib/seo";
import { PERSON_ID, SITE_URL, WEBSITE_ID } from "../../lib/site";

const description =
  "Selected products, open-source tools, and companies built by Joseph Mukorivo.";

export const metadata = createPageMetadata({
  title: "Projects",
  socialTitle: "Projects — Joseph Mukorivo",
  description,
  path: "/projects",
  keywords: [
    "Joseph Mukorivo projects",
    "FortyOne",
    "Complexus",
    "Go open source"
  ]
});

export default function ProjectsPage() {
  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/projects#projects`,
    url: `${SITE_URL}/projects`,
    name: "Joseph Mukorivo projects",
    description,
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@id": PERSON_ID },
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
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
        className="grid grid-cols-[160px_minmax(0,640px)] items-start gap-x-10 max-[680px]:grid-cols-1"
        data-reveal="page-header"
      >
        <div data-reveal-item>
          <IndexLink href="/" />
        </div>
        <div
          className="reveal-page-heading max-[680px]:mt-10"
          data-reveal-item
        >
          <h1 className="text-base font-medium leading-6">Projects</h1>
          <p className="mt-4 max-w-[560px] text-subtle">
            Products, open-source tools, and companies I have built with care.
            Each one started with a problem worth understanding properly.
          </p>
        </div>
      </header>

      <section
        aria-label="Selected projects"
        className="project-index ml-[200px] mt-[64px] max-w-[640px] max-[680px]:ml-0 max-[680px]:mt-12 max-[680px]:max-w-none"
        data-reveal="project-list"
      >
        {projects.map((project) => (
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
