"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const COMPACT_PREVIEW_WIDTH = 252;
const MEDIA_PREVIEW_WIDTH = 288;
const VIEWPORT_GUTTER = 14;
const OPEN_DELAY_MS = 260;
const CLOSE_DELAY_MS = 90;

function getPreviewPosition(anchor, previewWidth, estimatedHeight) {
  const rect = anchor.getBoundingClientRect();
  const halfWidth = previewWidth / 2;
  const left = Math.min(
    window.innerWidth - halfWidth - VIEWPORT_GUTTER,
    Math.max(halfWidth + VIEWPORT_GUTTER, rect.left + rect.width / 2)
  );
  const spaceAbove = rect.top - VIEWPORT_GUTTER;
  const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_GUTTER;
  const opensAbove =
    spaceAbove >= estimatedHeight || spaceAbove > spaceBelow;

  return {
    left,
    placement: opensAbove ? "above" : "below",
    top: opensAbove ? rect.top - 12 : rect.bottom + 12
  };
}

function PreviewIcon({ name }) {
  if (name === "github") {
    return (
      <svg className="link-preview-icon" viewBox="0 0 24 24">
        <path d="M12 .9a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.5-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.17 1.73 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.39-1.23.71-1.51-2.5-.29-5.13-1.25-5.13-5.54 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.15A10.7 10.7 0 0 1 12 6.25c.96 0 1.9.13 2.8.38 2.13-1.45 3.07-1.15 3.07-1.15.62 1.55.23 2.7.12 2.98.72.79 1.16 1.8 1.16 3.02 0 4.3-2.64 5.25-5.15 5.53.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .9Z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg className="link-preview-icon" viewBox="0 0 24 24">
        <path d="M5.3 7.7A2.2 2.2 0 1 0 5.3 3.3a2.2 2.2 0 0 0 0 4.4ZM3.4 20.7h3.8V9.3H3.4v11.4ZM9.5 9.3h3.6v1.56h.05c.5-.95 1.73-1.96 3.56-1.96 3.8 0 4.5 2.5 4.5 5.76v6.04h-3.75v-5.35c0-1.28-.03-2.92-1.78-2.92-1.78 0-2.05 1.39-2.05 2.82v5.45H9.5V9.3Z" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg className="link-preview-icon" viewBox="0 0 24 24">
        <path d="M18.24 2.25h3.31l-7.23 8.26 8.51 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
      </svg>
    );
  }

  return (
    <svg className="link-preview-icon link-preview-icon-mail" viewBox="0 0 24 24">
      <rect x="2.75" y="5" width="18.5" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function PreviewLink({
  children,
  className = "",
  href,
  preview,
  rel = "noopener noreferrer",
  target,
  ...props
}) {
  const anchorRef = useRef(null);
  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const previewId = useId();
  const [previewState, setPreviewState] = useState(null);
  const desiredPreviewWidth = preview?.image
    ? MEDIA_PREVIEW_WIDTH
    : COMPACT_PREVIEW_WIDTH;
  const previewHeight = preview?.image ? 245 : 116;
  const linkTarget =
    target ?? (href.startsWith("mailto:") ? undefined : "_blank");

  function openPreview(input = "pointer") {
    if (!preview || !anchorRef.current) {
      return;
    }

    if (
      input === "pointer" &&
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    const show = () => {
      if (!anchorRef.current) {
        return;
      }

      const previewWidth = Math.min(
        desiredPreviewWidth,
        window.innerWidth - VIEWPORT_GUTTER * 2
      );

      setPreviewState({
        ...getPreviewPosition(anchorRef.current, previewWidth, previewHeight),
        input,
        width: previewWidth
      });
    };

    if (input === "keyboard") {
      window.clearTimeout(openTimerRef.current);
      show();
      return;
    }

    openTimerRef.current = window.setTimeout(show, OPEN_DELAY_MS);
  }

  function closePreview() {
    window.clearTimeout(openTimerRef.current);
    closeTimerRef.current = window.setTimeout(
      () => setPreviewState(null),
      CLOSE_DELAY_MS
    );
  }

  useEffect(
    () => () => {
      window.clearTimeout(openTimerRef.current);
      window.clearTimeout(closeTimerRef.current);
    },
    []
  );

  return (
    <>
      <a
        {...props}
        aria-describedby={previewState ? previewId : undefined}
        className={className}
        href={href}
        onBlur={closePreview}
        onFocus={() => openPreview("keyboard")}
        onPointerEnter={() => openPreview("pointer")}
        onPointerLeave={closePreview}
        ref={anchorRef}
        rel={linkTarget === "_blank" ? rel : undefined}
        target={linkTarget}
      >
        {children}
      </a>
      {preview && previewState &&
        createPortal(
          <span
            className="link-preview"
            data-input={previewState.input}
            data-placement={previewState.placement}
            data-variant={preview.image ? "media" : "compact"}
            id={previewId}
            role="tooltip"
            style={{
              "--preview-width": `${previewState.width}px`,
              left: previewState.left,
              top: previewState.top
            }}
          >
            {preview.image ? (
              <span className="link-preview-media" aria-hidden="true">
                <Image
                  alt=""
                  height={165}
                  sizes="288px"
                  src={preview.image}
                  width={288}
                />
              </span>
            ) : (
              <span className="link-preview-mark" aria-hidden="true">
                <PreviewIcon name={preview.icon} />
              </span>
            )}
            <span className="link-preview-content">
              <span className="link-preview-title">{preview.title}</span>
              <span className="link-preview-description">
                {preview.description}
              </span>
            </span>
          </span>,
          document.body
        )}
    </>
  );
}
