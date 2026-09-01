import Image from "next/image";
import { SocialLinks } from "./social-links";

export function SiteHeader({ resumeHref, socialLabels, title }) {
  return (
    <header
      className="reveal-from-top site-header flex items-center justify-between gap-6 text-sm leading-[1.65] text-muted"
      data-reveal
      data-reveal-self
      data-site-header="true"
    >
      <div className="site-header-profile">
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
                loading="eager"
                src="/assets/joseph-mukorivo-sketch-light.webp"
                width={100}
              />
              <Image
                alt=""
                className="site-header-portrait-image site-header-portrait-image--dark"
                height={100}
                loading="eager"
                src="/assets/joseph-mukorivo-sketch-dark.webp"
                width={100}
              />
            </span>
            <span className="site-header-copy">
              <span className="site-header-name">Joseph Mukorivo</span>
              <span className="site-header-title">{title}</span>
            </span>
          </a>
        </h1>
      </div>
      <SocialLinks labels={socialLabels} resumeHref={resumeHref} />
    </header>
  );
}
