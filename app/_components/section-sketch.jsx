const sketches = {
  branch: (
    <>
      <path d="M15 8C14 18 15 29 15 36C15 41 22 42 29 41" />
      <path d="M15 22C24 22 32 16 32 9" />
      <circle className="section-sketch-dot" cx="15" cy="7" r="2.8" />
      <circle className="section-sketch-dot" cx="32" cy="8" r="2.8" />
      <circle className="section-sketch-dot" cx="31" cy="41" r="2.8" />
    </>
  ),
  data: (
    <>
      <path d="M8 12C8 6 43 6 44 12C45 18 10 20 8 13Z" />
      <path d="M8 12L9 34C10 42 43 41 44 34L44 12" />
      <path d="M9 22C14 29 39 28 44 22" />
      <path d="M9 32C16 38 38 38 44 32" />
    </>
  ),
  flow: (
    <>
      <path d="M7 15C14 9 21 9 27 15C33 21 39 21 46 15" />
      <path d="M7 33C14 27 21 27 27 33C33 39 39 39 46 33" />
      <path d="M14 12L14 36M40 12L40 36" />
      <circle className="section-sketch-dot" cx="14" cy="12" r="2.6" />
      <circle className="section-sketch-dot" cx="27" cy="24" r="2.8" />
      <circle className="section-sketch-dot" cx="40" cy="36" r="2.6" />
    </>
  ),
  nodes: (
    <>
      <path d="M9 33L21 13L40 21L34 39L9 33Z" />
      <path d="M21 13L34 39M9 33L40 21" />
      <circle className="section-sketch-dot" cx="9" cy="33" r="3" />
      <circle className="section-sketch-dot" cx="21" cy="13" r="3.4" />
      <circle className="section-sketch-dot" cx="40" cy="21" r="2.6" />
      <circle className="section-sketch-dot" cx="34" cy="39" r="2.2" />
    </>
  ),
  signal: (
    <>
      <circle className="section-sketch-dot" cx="26" cy="36" r="2.6" />
      <path d="M18 29C23 24 29 24 34 29" />
      <path d="M11 22C19 13 34 13 42 22" />
      <path d="M5 15C17 2 37 2 48 15" />
    </>
  ),
  terminal: (
    <>
      <path d="M6 8C17 6 37 7 45 9C47 19 47 32 44 40C31 42 17 41 7 39C5 29 5 17 6 8Z" />
      <path d="M13 17L20 23L13 29" />
      <path d="M26 30C31 29 35 30 39 30" />
    </>
  )
};

export function SectionSketch({ tone = "primary", variant }) {
  return (
    <svg
      aria-hidden="true"
      className={`section-sketch section-sketch--${variant} section-sketch--${tone}`}
      focusable="false"
      viewBox="0 0 52 48"
    >
      <g className="section-sketch-echo">{sketches[variant]}</g>
      {sketches[variant]}
    </svg>
  );
}
