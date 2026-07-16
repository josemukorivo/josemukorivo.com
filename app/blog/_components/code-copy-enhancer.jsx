"use client";

import { useEffect } from "react";

const COPIED_LABEL_DURATION = 1600;

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function CodeCopyEnhancer({ containerId }) {
  useEffect(() => {
    const container = document.getElementById(containerId);

    if (!container) {
      return undefined;
    }

    const resetTimers = new WeakMap();

    async function handleClick(event) {
      const button = event.target.closest("[data-copy-code]");

      if (!button || !container.contains(button)) {
        return;
      }

      const code = button.closest("figure")?.querySelector("pre code");

      if (!code) {
        return;
      }

      const previousTimer = resetTimers.get(button);

      if (previousTimer) {
        window.clearTimeout(previousTimer);
      }

      try {
        await copyText(code.textContent ?? "");
        button.textContent = "Copied";
      } catch {
        button.textContent = "Couldn’t copy";
      }

      const timer = window.setTimeout(() => {
        button.textContent = "Copy";
        resetTimers.delete(button);
      }, COPIED_LABEL_DURATION);

      resetTimers.set(button, timer);
    }

    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [containerId]);

  return null;
}
