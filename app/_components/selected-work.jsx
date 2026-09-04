import Image from "next/image";
import { ExternalMark } from "./external-link";

export function SelectedWork({ projects }) {
  return (
    <div className="selected-work">
      {projects.map((project) => (
        <a
          className="selected-project"
          data-featured={project.id === "fortyone" ? "true" : undefined}
          href={project.href}
          key={project.id}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span aria-hidden="true" className="project-slide-media">
            <Image
              alt=""
              fill
              sizes={project.id === "fortyone"
                ? "(max-width: 640px) calc(100vw - 36px), 580px"
                : "(max-width: 640px) calc((100vw - 52px) / 2), 278px"}
              src={project.image}
            />
          </span>
          <span className="project-slide-copy selected-project-copy">
            <span className="selected-project-identity">
              <strong>{project.name}</strong>
              <ExternalMark />
            </span>
            <span className="selected-project-meta">{project.meta}</span>
            <span className="selected-project-description">
              {project.shortDescription}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
