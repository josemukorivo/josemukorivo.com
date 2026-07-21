"use client";

import { useEffect, useRef, useState } from "react";

const READING_OFFSET = 144;

function MapLinks({ activeId, headings, onNavigate }) {
  return (
    <ol className="article-map-list">
      {headings.map((heading) => (
        <li data-level={heading.level} key={heading.id}>
          <a
            aria-current={activeId === heading.id ? "location" : undefined}
            href={`#${heading.id}`}
            onClick={onNavigate}
          >
            <span aria-hidden="true" className="article-map-tick" />
            <span>{heading.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function ArticleMap({ headings }) {
  const detailsRef = useRef(null);
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    let animationFrame = null;

    function measure() {
      animationFrame = null;
      let nextActive = elements[0]?.id;

      for (const element of elements) {
        if (element.getBoundingClientRect().top <= READING_OFFSET) {
          nextActive = element.id;
        } else {
          break;
        }
      }

      setActiveId((current) => (current === nextActive ? current : nextActive));
    }

    function scheduleMeasure() {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(measure);
      }
    }

    measure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [headings]);

  if (headings.length < 2) {
    return null;
  }

  function closeMobileMap() {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }

  return (
    <>
      <nav aria-label="Article map" className="article-map-desktop">
        <MapLinks activeId={activeId} headings={headings} />
      </nav>
      <details className="article-map-mobile" ref={detailsRef}>
        <summary aria-label="Open article map">
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="M5 5h10M5 10h10M5 15h7" />
          </svg>
          <span>On this page</span>
        </summary>
        <nav aria-label="Article map">
          <MapLinks
            activeId={activeId}
            headings={headings}
            onNavigate={closeMobileMap}
          />
        </nav>
      </details>
    </>
  );
}
