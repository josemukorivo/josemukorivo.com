import { SectionSketch } from "./section-sketch";

export function PageSection({ children, id, sketch, sketchTone, title }) {
  return (
    <section
      className="page-section mt-[60px] max-[640px]:mt-[52px]"
      data-reveal
      id={id}
    >
      {sketch ? <SectionSketch tone={sketchTone} variant={sketch} /> : null}
      <h2
        className="reveal-section-label mb-5 text-[15px] font-medium leading-[1.5]"
        data-reveal-item
      >
        {title}
      </h2>
      <div className="reveal-section-content" data-reveal-item>
        {children}
      </div>
    </section>
  );
}
