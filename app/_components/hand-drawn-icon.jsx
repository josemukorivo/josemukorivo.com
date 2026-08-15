import { useId } from "react";

export function HandDrawnIcon({ children, className = "", viewBox = "0 0 24 24" }) {
  const filterId = `hand-drawn-icon-${useId().replaceAll(":", "")}`;

  return (
    <svg
      aria-hidden="true"
      className={["hand-drawn-icon", className].filter(Boolean).join(" ")}
      viewBox={viewBox}
    >
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          id={filterId}
          x="-12%"
          y="-12%"
          width="124%"
          height="124%"
        >
          <feTurbulence
            baseFrequency="0.035 0.22"
            numOctaves="2"
            result="noise"
            seed="17"
            type="fractalNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.45"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </defs>
      <g className="hand-drawn-icon-echo" filter={`url(#${filterId})`}>
        {children}
      </g>
      <g filter={`url(#${filterId})`}>{children}</g>
    </svg>
  );
}

export function HandDrawnWritingIcon() {
  return (
    <HandDrawnIcon viewBox="0 0 20 20">
      <path d="M4 3.8C7.4 3.5 12.7 3.7 16 4v12.2c-3.5.3-8.5.2-12 0C3.7 12 3.7 8 4 3.8Z" />
      <path d="M6.2 7.1c2.5-.2 5.2-.1 7.6 0M6.2 10.1c2.1-.2 4.4-.1 6.4 0M6.2 13.1c1.4-.2 2.8-.1 4.4 0" />
    </HandDrawnIcon>
  );
}

export function HandDrawnProjectsIcon() {
  return (
    <HandDrawnIcon viewBox="0 0 20 20">
      <path d="M3.5 5.7C4.9 5.4 6.7 5.6 8.1 5.7L9.7 7.3c2.3-.2 4.5-.1 6.8.1-.1 2.7.1 5.4-.2 8-4.1.2-8.5.1-12.8-.1C3.4 12.2 3.3 8.8 3.5 5.7Z" />
      <path d="M3.7 8.4c3.4-.3 8.5-.2 12.7.1" />
    </HandDrawnIcon>
  );
}

export function HandDrawnAssistantIcon() {
  return (
    <HandDrawnIcon viewBox="0 0 24 24">
      <path d="M10.1 4.7c.5 1.9.8 3 1.7 3.8.8.8 1.9 1.2 3.8 1.7-1.9.5-3 1-3.8 1.8-.8.8-1.2 1.9-1.7 3.8-.5-1.9-.9-3-1.7-3.8-.8-.8-1.9-1.3-3.8-1.8 1.9-.5 3-1 3.8-1.7.8-.8 1.2-1.9 1.7-3.8Z" />
      <path d="M17.7 3.5c.2 1 .5 1.5.9 1.9.4.4.9.6 1.9.9-1 .3-1.5.5-1.9.9-.4.4-.7.9-.9 1.9-.3-1-.5-1.5-.9-1.9-.4-.4-.9-.6-1.9-.9 1-.3 1.5-.5 1.9-.9.4-.4.6-.9.9-1.9Z" />
    </HandDrawnIcon>
  );
}

export function HandDrawnArrowIcon() {
  return (
    <HandDrawnIcon viewBox="0 0 16 16">
      <path d="M4 12 12 4M6 4h6v6" />
    </HandDrawnIcon>
  );
}

export function HandDrawnCloseIcon() {
  return (
    <HandDrawnIcon viewBox="0 0 20 20">
      <path d="m5.2 5.1 9.6 9.7m-.1-9.6-9.6 9.7" />
    </HandDrawnIcon>
  );
}

export function HandDrawnLightIcon() {
  return (
    <HandDrawnIcon viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="2.8" />
      <path d="M9 1.7v1.5M9 14.8v1.5M16.3 9h-1.5M3.2 9H1.7M14.2 3.8l-1.1 1.1M4.9 13.1l-1.1 1.1M14.2 14.2l-1.1-1.1M4.9 4.9 3.8 3.8" />
    </HandDrawnIcon>
  );
}

export function HandDrawnDarkIcon() {
  return (
    <HandDrawnIcon viewBox="0 0 18 18">
      <path d="M14.2 11.1A6.2 6.2 0 0 1 6.9 3.8a5.7 5.7 0 1 0 7.3 7.3Z" />
    </HandDrawnIcon>
  );
}

export function HandDrawnSystemIcon() {
  return (
    <HandDrawnIcon viewBox="0 0 18 18">
      <path d="M2.8 3.7c3.4-.3 8.9-.2 12.3.1.2 2.4.1 5.5-.1 8-3.2.3-8.6.2-12.2-.1-.2-2.3-.2-5.6 0-8Z" />
      <path d="M6.7 14.6c1.4-.2 3-.2 4.5 0M9 12c-.1.8-.1 1.7 0 2.5" />
    </HandDrawnIcon>
  );
}

export function HandDrawnSendIcon() {
  return (
    <HandDrawnIcon>
      <path d="M3.1 11.5c5.2-2.2 11.8-4.9 17.2-7.2-1.8 5-4.3 11.2-6.4 16.1-1.2-2.9-2.2-5.3-3.3-7.2-2.7-.5-5.2-1.1-7.5-1.7Z" />
      <path d="M10.7 13.2c2.9-2.3 6.1-6 9.4-8.7" />
    </HandDrawnIcon>
  );
}

export function HandDrawnStopIcon({ className }) {
  return (
    <HandDrawnIcon className={className}>
      <path d="M5 4.8c3.8-.5 8.7-.4 13.9-.1.4 4.1.4 9.3 0 14.1-4.5.5-9.3.4-13.9.1-.5-4.7-.5-9.2 0-14.1Z" />
    </HandDrawnIcon>
  );
}

export function HandDrawnVoiceIcon() {
  return (
    <HandDrawnIcon>
      <path d="M3.5 11.1c-.2.8-.1 1.7.1 2.5M7.6 8.1c-.2 2.7-.2 5.3.1 7.9M11.9 5c-.3 4.7-.2 9.4.1 14M16.2 8.3c-.2 2.7-.1 5.2.1 7.8M20.2 10.8c-.3.8-.2 1.7.1 2.5" />
    </HandDrawnIcon>
  );
}

export function HandDrawnMicrophoneIcon({ className }) {
  return (
    <HandDrawnIcon className={className}>
      <path d="M8.2 6.2c-.1-2.1 1.5-3.8 3.8-4 2.1.1 3.8 1.7 3.8 3.9-.1 2.6.1 5.2-.2 7.8-1 .9-2.2 1.3-3.7 1.2-2.2-.1-3.6-1.6-3.7-3.8.1-1.7 0-3.4 0-5.1Z" />
      <path d="M5.3 10.7c.1 3.8 2.6 6.6 6.5 6.6 3.5.1 6.2-2.7 6.6-6.4M12 17.4c-.2 1.2-.1 2.4 0 3.5M9.2 20.9c1.7-.2 3.6-.2 5.5 0" />
    </HandDrawnIcon>
  );
}

export function HandDrawnCopyIcon() {
  return (
    <HandDrawnIcon>
      <rect x="7.1" y="7.1" width="13" height="13" rx="1.7" />
      <path d="M16.7 7.1V4.8c0-1-.8-1.8-1.8-1.8H4.8c-1 0-1.8.8-1.8 1.8v10.1c0 1 .8 1.8 1.8 1.8h2.3" />
    </HandDrawnIcon>
  );
}

export function HandDrawnCheckIcon() {
  return (
    <HandDrawnIcon viewBox="0 0 20 20">
      <path d="m4.2 10.3 3.4 3.5 8-8.1" />
    </HandDrawnIcon>
  );
}

export function HandDrawnRetryIcon() {
  return (
    <HandDrawnIcon>
      <path d="M17.4 7.1A7.8 7.8 0 1 0 18.9 13" />
      <path d="M17.1 2.9v4.4h-4.4" />
    </HandDrawnIcon>
  );
}
