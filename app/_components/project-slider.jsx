"use client";

import Image from "next/image";
import { CarouselControls } from "./carousel-controls";
import { ExternalMark } from "./external-link";
import { useHorizontalCarousel } from "./use-horizontal-carousel";

export function ProjectSlider({
  labels,
  linkHref,
  linkLabel,
  projects
}) {
  const { edges, move, trackRef } = useHorizontalCarousel(projects.length);

  return (
    <div className="project-slider">
      <CarouselControls
        edges={edges}
        labels={labels}
        linkHref={linkHref}
        linkLabel={linkLabel}
        onMove={move}
      />
      <div className="project-slider-track" ref={trackRef}>
        {projects.map((project) => (
          <a
            className="project-slide"
            href={project.href}
            key={project.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span aria-hidden="true" className="project-slide-media">
              <Image
                alt=""
                fill
                sizes="(max-width: 640px) 82vw, 460px"
                src={project.image}
              />
            </span>
            <span className="project-slide-copy">
              <span className="project-slide-heading">
                <strong>{project.name}</strong>
                <ExternalMark />
                <span>{project.meta}</span>
              </span>
              <span>{project.shortDescription}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
