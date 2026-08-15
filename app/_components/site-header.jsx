export function SiteHeader({ role }) {
  return (
    <header
      className="reveal-from-top flex items-baseline justify-between gap-6 text-sm leading-[1.65] text-muted"
      data-reveal
      data-reveal-self
      data-site-header="true"
    >
      <a
        className="name-link name-signature relative font-body text-[21px] font-normal italic leading-[1.1] text-ink"
        href="#top"
      >
        Joseph Mukorivo
      </a>
      <span className="max-[760px]:hidden">{role}</span>
    </header>
  );
}
