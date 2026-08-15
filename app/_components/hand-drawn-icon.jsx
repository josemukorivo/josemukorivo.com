export function HandDrawnIcon({ children, className = "", viewBox = "0 0 24 24" }) {
  return (
    <svg
      aria-hidden="true"
      className={['hand-drawn-icon', className].filter(Boolean).join(" ")}
      viewBox={viewBox}
    >
      <g className="hand-drawn-icon-echo">{children}</g>
      {children}
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
      <path d="M3.6 5.4h4.3l1.7 1.8h6.8v8.2H3.6V5.4Z" />
      <path d="M3.8 8.2c3.2-.2 8.4-.2 12.5 0" />
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
      <rect x="2.7" y="3.5" width="12.6" height="8.5" rx="1.1" />
      <path d="M6.8 14.5h4.4M9 12v2.5" />
    </HandDrawnIcon>
  );
}

export function HandDrawnSendIcon() {
  return (
    <HandDrawnIcon>
      <path d="m3.3 11.2 17-6.8-6.2 15.9-3.1-7.3-7.7-1.8Z" />
      <path d="m10.9 13 9.4-8.6" />
    </HandDrawnIcon>
  );
}

export function HandDrawnStopIcon({ className }) {
  return (
    <HandDrawnIcon className={className}>
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="1.8" />
    </HandDrawnIcon>
  );
}

export function HandDrawnVoiceIcon() {
  return (
    <HandDrawnIcon>
      <path d="M4 10.5v3M7.8 8v8M12 5v14M16.2 8v8M20 10.5v3" />
    </HandDrawnIcon>
  );
}

export function HandDrawnMicrophoneIcon({ className }) {
  return (
    <HandDrawnIcon className={className}>
      <rect x="8" y="2.2" width="8" height="12.2" rx="4" />
      <path d="M5.5 10.3a6.5 6.5 0 0 0 13 0M12 16.8v4M9.3 20.8h5.4" />
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
