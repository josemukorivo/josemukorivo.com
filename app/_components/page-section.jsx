export function PageSection({ children, id, title }) {
  return (
    <section
      className="mt-[88px] max-[640px]:mt-[72px]"
      data-reveal
      id={id}
    >
      <h2
        className="reveal-section-label mb-7 text-sm font-medium leading-[1.5]"
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
