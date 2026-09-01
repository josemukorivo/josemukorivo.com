"use client";

import { CarouselControls } from "./carousel-controls";
import { HandDrawnIcon } from "./hand-drawn-icon";
import { useHorizontalCarousel } from "./use-horizontal-carousel";

function ExperienceIcon({ index }) {
  const paths = [
    <path d="M4.2 7.6c4.2-.3 11.4-.2 15.6.1.3 3.4.3 7.4-.1 10.8-4.1.4-11.2.3-15.4-.1-.4-3.4-.4-7.3-.1-10.8ZM8.2 7.4V5.8c0-1.2.9-2.1 2.1-2.1h3.4c1.2 0 2.1.9 2.1 2.1v1.6M4.4 11.3c4.8 2.3 10.2 2.3 15.2 0" key="briefcase" />,
    <path d="M3.5 12.8c1.5-3.6 4.5-5.8 8.5-5.9 4 .1 7 2.3 8.5 5.9-1.6 3.4-4.6 5.5-8.5 5.6-3.9-.1-6.9-2.2-8.5-5.6ZM9.4 12.7a2.7 2.7 0 1 0 5.4 0 2.7 2.7 0 0 0-5.4 0Z" key="eye" />,
    <path d="M4 7.1c4-.3 12-.2 16 .1M5.2 7.4c.2 4 .1 8.5-.2 12.4m14-12.4c.3 4 .2 8.5-.1 12.4M3.4 19.9c4.7-.3 12.6-.2 17.2.1M8.3 7V4.2m7.4 2.8V4.2M7.3 12.1h3m3.4 0h3M7.3 15.7h3m3.4 0h3" key="calendar" />,
    <path d="M5.1 5.7c3.8-.4 10.2-.3 13.9.1.3 3.6.3 8.8-.1 12.5-3.8.4-10 .3-13.8-.1-.4-3.7-.4-8.8 0-12.5ZM8.2 9.1c2.5-.2 5-.2 7.5 0M8.2 12.3c2-.2 4.1-.2 6.1 0M8.2 15.4c1.5-.2 3-.1 4.5 0" key="document" />
  ];

  return <HandDrawnIcon>{paths[index % paths.length]}</HandDrawnIcon>;
}

export function ExperienceTimeline({ items, labels }) {
  const { edges, move, trackRef } = useHorizontalCarousel(items.length, 0.64);

  return (
    <div className="experience-carousel">
      <CarouselControls
        edges={edges}
        labels={labels}
        onMove={move}
      />
      <div className="experience-timeline-scroll" ref={trackRef}>
        <ol className="experience-timeline">
          {items.map((item, index) => (
            <li
              aria-label={`${item.company}, ${item.role}, ${item.date}`}
              data-current={index === 0 ? "true" : undefined}
              key={item.company}
            >
              <span aria-hidden="true" className="experience-timeline-segment">
                <span className="experience-timeline-node" />
              </span>
              <span aria-hidden="true" className="experience-timeline-mark">
                <ExperienceIcon index={index} />
              </span>
              <span
                className="experience-timeline-company"
                title={item.company}
              >
                {item.company}
              </span>
              <span className="experience-timeline-location">
                <span aria-hidden="true">{item.flag}</span>
                <span>{item.country}</span>
                {item.arrangement ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{item.arrangement}</span>
                  </>
                ) : null}
              </span>
              <span className="experience-timeline-role">{item.role}</span>
              <span className="experience-timeline-date">{item.date}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
