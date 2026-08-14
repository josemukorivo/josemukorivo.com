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
          d="M1 15C16 10 31 17 48 13C65 9 82 16 99 11"
        />
        <path
          className="marker-highlight-stroke marker-highlight-stroke--echo"
          d="M0 18C19 14 36 19 55 15C71 12 87 17 100 14"
        />
      </svg>
      <span className="marker-highlight-copy">{children}</span>
    </span>
  );
}
