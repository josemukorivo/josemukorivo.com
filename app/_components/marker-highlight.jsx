const toneClasses = {
  cool: "marker-highlight--cool",
  primary: "marker-highlight--primary",
  violet: "marker-highlight--violet"
};

const variantClasses = {
  fill: "marker-highlight--fill",
  underline: "marker-highlight--underline"
};

export function MarkerHighlight({
  children,
  tone = "primary",
  variant = "fill"
}) {
  const toneClass = toneClasses[tone] ?? toneClasses.primary;
  const variantClass = variantClasses[variant] ?? variantClasses.fill;

  return (
    <span className={`marker-highlight ${toneClass} ${variantClass}`}>
      <svg
        aria-hidden="true"
        className="marker-highlight-art"
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 100 28"
      >
        <path
          className="marker-highlight-stroke marker-highlight-stroke--broad"
          d="M1 16C9 11 17 19 27 14S47 18 58 12S78 17 99 10"
        />
        <path
          className="marker-highlight-stroke marker-highlight-stroke--echo"
          d="M1 20C13 15 24 21 39 16S61 20 73 14S90 18 99 13"
        />
      </svg>
      <span className="marker-highlight-copy">{children}</span>
    </span>
  );
}
