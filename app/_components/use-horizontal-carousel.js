"use client";

import { useEffect, useRef, useState } from "react";

export function useHorizontalCarousel(itemCount, step = 0.82) {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ end: false, start: true });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    function updateEdges() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      setEdges({
        end: maxScroll - track.scrollLeft < 2,
        start: track.scrollLeft < 2
      });
    }

    updateEdges();
    track.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);

    return () => {
      track.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [itemCount]);

  function move(direction) {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      behavior: "smooth",
      left: direction * track.clientWidth * step
    });
  }

  return { edges, move, trackRef };
}
