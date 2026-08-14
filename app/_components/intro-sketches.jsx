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
              baseFrequency="0.025 0.32"
              numOctaves="1"
              result="noise"
              seed="11"
              type="fractalNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0.8"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="intro-sketch intro-sketch--orbit"
        viewBox="0 0 140 86"
      >
        <path
          d="M8 49C13 13 115 0 132 34C149 63 41 92 11 58C-4 40 23 18 65 14"
          pathLength="100"
        />
        <path
          d="M16 56C35 79 112 74 130 43"
          pathLength="100"
        />
      </svg>

      <svg
        className="intro-sketch intro-sketch--spark"
        viewBox="0 0 32 32"
      >
        <path d="M16 2C16 9 15 12 10 16C15 18 16 22 16 30" pathLength="100" />
        <path d="M2 16C9 16 13 15 16 10C18 15 23 16 30 16" pathLength="100" />
      </svg>

      <svg
        className="intro-sketch intro-sketch--wave"
        viewBox="0 0 96 32"
      >
        <path
          d="M3 17C14 4 25 28 37 14C48 1 59 5 70 17C79 27 87 25 93 10"
          pathLength="100"
        />
      </svg>
    </div>
  );
}
