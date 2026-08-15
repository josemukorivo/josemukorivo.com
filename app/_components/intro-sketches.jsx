export function IntroSketches() {
  return (
    <div aria-hidden="true" className="intro-sketches">
      <svg className="hand-drawn-filter" focusable="false" height="0" width="0">
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            height="160%"
            id="hand-drawn-roughen"
            width="124%"
            x="-12%"
            y="-30%"
          >
            <feTurbulence
              baseFrequency="0.018 0.24"
              numOctaves="2"
              result="noise"
              seed="11"
              type="fractalNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.25"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="intro-sketch intro-sketch--terminal"
        viewBox="0 0 54 44"
      >
        <path d="M5 6C17 4 38 5 48 7C50 17 49 31 47 38C34 40 18 40 6 37C4 27 4 15 5 6Z" />
        <path d="M13 15L20 21L13 27" />
        <path d="M27 29C32 28 37 29 41 29" />
      </svg>

      <svg
        className="intro-sketch intro-sketch--nodes"
        viewBox="0 0 52 48"
      >
        <path d="M8 34L20 10L42 19L34 40L8 34Z" />
        <path d="M20 10L34 40M8 34L42 19" />
        <circle cx="8" cy="34" r="2.7" />
        <circle cx="20" cy="10" r="3.2" />
        <circle cx="42" cy="19" r="2.5" />
        <circle cx="34" cy="40" r="2" />
      </svg>

      <svg
        className="intro-sketch intro-sketch--pixels"
        viewBox="0 0 48 46"
      >
        <path d="M6 9L14 8L15 16L7 17Z" />
        <path d="M22 5L28 6L27 12L21 11Z" />
        <path d="M34 17L43 16L42 25L35 26Z" />
        <path d="M16 25L25 24L26 34L17 35Z" />
        <path d="M31 35L37 34L38 41L32 42Z" />
      </svg>
    </div>
  );
}
