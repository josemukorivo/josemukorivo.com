import { IndexLink } from "./index-link";
import { PageShell } from "./page-shell";

export function TrustPage({ page }) {
  return (
    <PageShell variant="article">
      <article>
        <header className="mb-11" data-reveal="page-header">
          <div data-reveal-item>
            <IndexLink href="/" label="Index" />
          </div>
          <h1
            className="mt-11 text-[clamp(26px,3.5vw,32px)] font-medium leading-[1.15] tracking-[-0.025em] max-[680px]:mt-9 max-[680px]:text-[26px]"
            data-reveal-item
          >
            {page.title}
          </h1>
          <p className="mt-4 max-w-[560px] text-subtle" data-reveal-item>
            {page.description}
          </p>
        </header>

        <div className="[&>section+section]:mt-12">
          {page.sections.map((section) => (
            <section data-reveal key={section.heading}>
              <h2
                className="mb-5 text-[15px] font-medium leading-[1.5]"
                data-reveal-item
              >
                {section.heading}
              </h2>
              <div
                className="max-w-[580px] leading-[1.75] text-subtle [&>p+p]:mt-6"
                data-reveal-item
              >
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
