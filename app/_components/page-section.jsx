export function PageSection({ children, id, title }) {
  return (
    <section
      className="mt-[88px] max-[640px]:mt-[72px]"
      data-reveal
      id={id}
    >
      <h2 className="mb-7 text-sm font-medium leading-[1.5]">{title}</h2>
      {children}
    </section>
  );
}
