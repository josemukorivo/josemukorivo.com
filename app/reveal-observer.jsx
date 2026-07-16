"use client";

import { useEffect } from "react";

export function RevealObserver() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return undefined;
    }

    const root = document.documentElement;
    const revealElements = Array.from(
      document.querySelectorAll("[data-reveal]")
    );

    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08
      }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
