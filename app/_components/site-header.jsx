import Image from "next/image";

export function SiteHeader() {
  return (
    <header
      className="reveal-from-top flex items-center justify-between gap-6 text-sm leading-[1.65] text-muted"
      data-reveal
      data-reveal-self
      data-site-header="true"
    >
      <h1 className="font-body text-[19px] font-normal italic leading-[1.1]">
        <a
          className="name-link site-header-identity relative inline-flex items-center gap-3 text-ink"
          href="#top"
        >
          <span aria-hidden="true" className="site-header-portrait">
            <Image
              alt=""
              className="site-header-portrait-image site-header-portrait-image--light"
              height={100}
              src="/assets/joseph-mukorivo-sketch-light.webp"
              width={100}
            />
            <Image
              alt=""
              className="site-header-portrait-image site-header-portrait-image--dark"
              height={100}
              src="/assets/joseph-mukorivo-sketch-dark.webp"
              width={100}
            />
          </span>
          <span className="site-header-name">Joseph Mukorivo</span>
        </a>
      </h1>
    </header>
  );
}
