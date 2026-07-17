import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header
      className="reveal-from-top flex items-baseline justify-between gap-6 text-sm leading-[1.65] text-muted"
      data-reveal
      data-reveal-self
    >
      <a
        className="name-link relative font-serif text-xl font-medium italic leading-[1.2] text-ink"
        href="#top"
      >
        Joseph Mukorivo
      </a>
      <div className="-mr-2 flex items-center gap-4">
        <span className="max-[640px]:hidden">
          Head of Engineering & founder
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
