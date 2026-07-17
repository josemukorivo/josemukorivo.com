"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const TOP_BLUR_THRESHOLD = 64;
const BOTTOM_BLUR_CLEARANCE = 40;

function makeRevealsVisible() {
  document
    .querySelectorAll("[data-reveal]")
    .forEach((element) => element.setAttribute("data-visible", "true"));
}

function observeViewportEdges(root) {
  let animationFrame = null;

  function updateViewportState() {
    animationFrame = null;

    const distanceToBottom =
      document.documentElement.scrollHeight -
      (window.scrollY + window.innerHeight);

    root.classList.toggle(
      "viewport-blur-active",
      window.scrollY > TOP_BLUR_THRESHOLD
    );
    root.classList.toggle(
      "viewport-blur-at-bottom",
      distanceToBottom <= BOTTOM_BLUR_CLEARANCE
    );
  }

  function scheduleUpdate() {
    if (animationFrame !== null) {
      return;
    }

    animationFrame = window.requestAnimationFrame(updateViewportState);
  }

  root.classList.add("viewport-blur-ready");
  updateViewportState();
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);

  return () => {
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
    }

    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
    root.classList.remove(
      "viewport-blur-ready",
      "viewport-blur-active",
      "viewport-blur-at-bottom"
    );
  };
}

export function RevealObserver() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const shouldReduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const stopObservingViewport = shouldReduceMotion
      ? undefined
      : observeViewportEdges(root);

    if (!("IntersectionObserver" in window) || shouldReduceMotion) {
      makeRevealsVisible();
      return stopObservingViewport;
    }

    const revealElements = Array.from(
      document.querySelectorAll("[data-reveal]")
    );

    root.classList.add("reveal-ready");
    let firstRevealFrame = null;
    let secondRevealFrame = null;

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
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.1
      }
    );

    firstRevealFrame = window.requestAnimationFrame(() => {
      secondRevealFrame = window.requestAnimationFrame(() => {
        revealElements.forEach((element) => observer.observe(element));
      });
    });

    return () => {
      if (firstRevealFrame !== null) {
        window.cancelAnimationFrame(firstRevealFrame);
      }

      if (secondRevealFrame !== null) {
        window.cancelAnimationFrame(secondRevealFrame);
      }

      observer.disconnect();
      root.classList.remove("reveal-ready");
      stopObservingViewport?.();
    };
  }, [pathname]);

  return null;
}
