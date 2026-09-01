import { HandDrawnIcon } from "./hand-drawn-icon";
import { InlineLink } from "./inline-link";

function CarouselArrow({ direction }) {
  const path = direction === "previous" ? "m14 5-7 7 7 7" : "m10 5 7 7-7 7";

  return (
    <HandDrawnIcon>
      <path d={path} />
    </HandDrawnIcon>
  );
}

export function CarouselControls({
  edges,
  labels,
  linkHref,
  linkLabel,
  onMove
}) {
  return (
    <div className="carousel-toolbar">
      {linkHref && linkLabel ? (
        <InlineLink className="carousel-toolbar-link" href={linkHref}>
          {linkLabel}
        </InlineLink>
      ) : null}
      <div className="carousel-controls">
        <button
          aria-label={labels.previous}
          disabled={edges.start}
          onClick={() => onMove(-1)}
          type="button"
        >
          <CarouselArrow direction="previous" />
        </button>
        <button
          aria-label={labels.next}
          disabled={edges.end}
          onClick={() => onMove(1)}
          type="button"
        >
          <CarouselArrow direction="next" />
        </button>
      </div>
    </div>
  );
}
