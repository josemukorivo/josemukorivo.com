import { ExternalLink } from "./_components/external-link";
import { AssistantIntroLink } from "./_components/assistant-intro-link";
import {
  HandwrittenInsertion,
  HandwrittenReplacement
} from "./_components/handwritten-edit";
import { IntroSketches } from "./_components/intro-sketches";
import { InlineLink } from "./_components/inline-link";
import { JsonLd } from "./_components/json-ld";
import { MarkerHighlight } from "./_components/marker-highlight";
import { PageSection } from "./_components/page-section";
import { PageShell } from "./_components/page-shell";
import { RolePhrase } from "./_components/role-phrase";
import { SiteFooter } from "./_components/site-footer";
import { SiteHeader } from "./_components/site-header";
import { WritingList } from "./_components/writing-list";
import { localizePath } from "../lib/i18n-config";
import { getMessages, getRequestLocale } from "../lib/i18n-server";
import { projects } from "../lib/projects";
import { createPageMetadata } from "../lib/seo";
import {
  PERSON_ID,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
  WEBSITE_ID,
  absoluteUrl
} from "../lib/site";

const RESUME_URL = "/joseph-mukorivo-ai-product-engineer-resume.pdf";

const writing = [
  {
    id: "portfolio-ai-assistant",
    title: "Turning a Personal Website Into an AI Assistant",
    date: "Jul 2026",
    dateTime: "2026-07-25T10:00:00Z",
    href: "/blog/turning-a-personal-website-into-an-ai-assistant"
  },
  {
    id: "engineering-leadership-product-role",
    title: "Engineering Leadership Is a Product Role",
    date: "Jul 2026",
    dateTime: "2026-07-17T18:37:02Z",
    href: "/blog/engineering-leadership-is-a-product-role"
  },
  {
    id: "fortyone-agentic-project-management",
    title: "I Built an Agentic Project Management Tool",
    date: "Jan 2026",
    dateTime: "2026-01-10T09:17:19Z",
    href: "/blog/i-got-tired-of-jira-so-i-built-an-agentic-project-management-tool-and-open-sourced-it-3ghp"
  },
  {
    id: "react-value-comparison",
    title: "How React Checks if Two Values Are the Same Value",
    date: "Feb 2022",
    dateTime: "2022-02-14T05:47:53Z",
    href: "/blog/how-react-checks-if-2-values-are-the-same-value-3g4a"
  }
];

function createHomepageSchema(locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE_NAME,
      url: SITE_URL,
      image: absoluteUrl("/assets/joseph.webp"),
      email: `mailto:${SITE_EMAIL}`,
      jobTitle: "AI Product Engineer and Head of Engineering",
      description: SITE_DESCRIPTION,
      homeLocation: {
        "@type": "Place",
        name: "Harare, Zimbabwe"
      },
      sameAs: SOCIAL_PROFILES,
      worksFor: {
        "@type": "Organization",
        name: "Art Circles"
      },
      affiliation: [
        {
          "@type": "Organization",
          name: "FortyOne",
          url: "https://www.fortyone.app"
        },
        {
          "@type": "Organization",
          name: "Complexus",
          url: "https://complexus.tech"
        }
      ],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Chinhoyi University of Technology"
      },
      knowsAbout: [
        "AI product engineering",
        "AI agents",
        "Conversational AI",
        "Voice AI",
        "Human-in-the-loop AI systems",
        "Software engineering leadership",
        "Financial technology",
        "Software architecture",
        "Next.js",
        "Go"
      ]
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: locale,
      author: {
        "@id": PERSON_ID
      },
      publisher: {
        "@id": PERSON_ID
      }
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      isPartOf: {
        "@id": WEBSITE_ID
      },
      mainEntity: {
        "@id": PERSON_ID
      }
      }
    ]
  };
}

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return createPageMetadata({
    title: messages.headerRole,
    socialTitle: `Joseph Mukorivo — ${messages.headerRole}`,
    description: messages.home.introLocation,
    path: localizePath("/", locale),
    locale
  });
}

export default async function Home() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const home = messages.home;
  const localizedWriting = writing.map((article) => ({
    ...article,
    href: localizePath(article.href, locale)
  }));
  const localizedProjects = projects.map((project) => ({
    ...project,
    shortDescription:
      messages.projects.items[project.id]?.short ?? project.shortDescription
  }));

  return (
    <PageShell>
      <JsonLd data={createHomepageSchema(locale)} />
      <SiteHeader />

      <article className="mt-14 max-[640px]:mt-10" id="top">
        <div className="reveal-intro max-w-[600px]">
          <IntroSketches />
          <div className="intro-copy leading-[1.75] [&>p+p]:mt-6">
            <p className="intro-reveal-item">
              {home.rolePrefix}{" "}
              <RolePhrase>{home.role}</RolePhrase>.{" "}
              {home.introBeforeEdit}{" "}
              <HandwrittenReplacement
                correction={home.introCorrection}
                draft={home.introDraft}
              />
              .
            </p>
            <p className="intro-reveal-item">
              {home.founderPrefix}{" "}
              <MarkerHighlight tone="violet" variant="underline">
                <InlineLink
                  className="identity-link"
                  href="https://complexus.tech"
                >
                  Complexus
                </InlineLink>
              </MarkerHighlight>{" "}
              {home.founderJoin}{" "}
              <MarkerHighlight>
                <InlineLink
                  className="identity-link"
                  href="https://www.fortyone.app"
                >
                  FortyOne
                </InlineLink>
              </MarkerHighlight>
              ,{" "}
              {home.founderAfterBeforeEdit ? (
                <>
                  {home.founderAfterBeforeEdit}{" "}
                  <HandwrittenReplacement
                    correction={home.founderCorrection}
                    draft={home.founderDraft}
                  />
                  .
                </>
              ) : locale === "en" ? (
                <>
                  an agentic project management platform connecting company{" "}
                  <HandwrittenInsertion
                    after="als"
                    before="g"
                    character="o"
                    value="goals"
                  />
                  , customer feedback, planning, and delivery. I currently lead
                  engineering at Art Circles, setting technical direction,
                  shaping AI strategy, and guiding product delivery.
                </>
              ) : (
                home.founderAfter
              )}
            </p>
            <p className="intro-reveal-item">
              {home.workPrefix}{" "}
              <MarkerHighlight tone="violet" variant="underline">
                {home.technicalLeadership}
              </MarkerHighlight>
              , {home.workAfter}
            </p>
            <p className="intro-reveal-item">
              {locale === "en" ? (
                <>
                  I care about useful software, clear interfaces,{" "}
                  <HandwrittenReplacement
                    correction="reliable"
                    draft="strong"
                  />{" "}
                  systems, and{" "}
                  <MarkerHighlight tone="cool" variant="underline">
                    thoughtful details
                  </MarkerHighlight>
                  .{" "}
                </>
              ) : (
                <>{home.care} </>
              )}
              <span className="assistant-intro-copy">
                <AssistantIntroLink locale={locale}>
                  {home.askMaya}
                </AssistantIntroLink>{" "}
                {home.askMayaAfter}
              </span>
            </p>
            <p className="intro-reveal-item text-subtle">
              {home.findPrefix}{" "}
              <InlineLink href="https://github.com/josemukorivo">
                GitHub
              </InlineLink>
              ,{" "}
              <InlineLink href="https://www.linkedin.com/in/josemukorivo/">
                LinkedIn
              </InlineLink>
              , {home.socialOr} <InlineLink href="https://x.com/josemukorivo">X</InlineLink>,{" "}
              {home.readMy}{" "}
              <InlineLink href={localizePath("/blog", locale)}>
                {home.writingLink}
              </InlineLink>
              , {home.socialOr}{" "}
              <InlineLink href={`mailto:${SITE_EMAIL}`}>
                {home.emailLink}
              </InlineLink>
              .
            </p>
          </div>
        </div>

        <PageSection
          id="writing"
          sketch="branch"
          sketchTone="primary"
          title={home.sections.writing}
        >
          <WritingList articles={localizedWriting} />
          <p className="mt-[18px]">
            <InlineLink href={localizePath("/blog", locale)}>
              {home.allWriting}
            </InlineLink>
          </p>
        </PageSection>

        <PageSection
          sketch="nodes"
          sketchTone="cool"
          title={home.sections.projects}
        >
          <div className="grid grid-cols-3 gap-9 max-[640px]:grid-cols-1 max-[640px]:gap-[26px]">
            {localizedProjects.map((project) => (
              <div key={project.name}>
                <span className="font-medium">
                  <ExternalLink href={project.href}>
                    {project.name}
                  </ExternalLink>
                </span>
                <p className="mt-1.5 text-[14px] text-subtle">
                  {project.shortDescription}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-[22px]">
            <InlineLink href={localizePath("/projects", locale)}>
              {home.allProjects}
            </InlineLink>
          </p>
        </PageSection>

        <PageSection
          id="building"
          sketch="terminal"
          sketchTone="violet"
          title={home.sections.building}
        >
          <div>
            <div className="mb-5 flex items-baseline justify-between gap-6">
              <span className="font-medium">
                <MarkerHighlight tone="primary" variant="underline">
                  <ExternalLink href="https://www.fortyone.app">
                    FortyOne
                  </ExternalLink>
                </MarkerHighlight>
              </span>
              <span className="text-[13px] text-muted">
                {home.liveProduct}
              </span>
            </div>
            <div className="[&>p+p]:mt-6">
              {home.buildingParagraphs.map((paragraph, index) => (
                <p key={paragraph}>
                  {index === 0 && home.buildingIntroBeforeEdit ? (
                    <>
                      {home.buildingIntroBeforeEdit}{" "}
                      <HandwrittenReplacement
                        correction={home.buildingIntroCorrection}
                        draft={home.buildingIntroDraft}
                      />{" "}
                      {home.buildingIntroAfterEdit}
                    </>
                  ) : locale === "en" && index === 1 ? (
                    <>
                      Company{" "}
                      <HandwrittenInsertion
                        after="tategy"
                        before="s"
                        character="r"
                        value="strategy"
                      />{" "}
                      starts with objectives and key results. Teams can map how
                      goals relate, connect them to roadmaps and planned work,
                      and see whether daily delivery is moving the{" "}
                      <HandwrittenReplacement
                        correction="outcomes"
                        draft="output"
                      />{" "}
                      they committed to.
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>
          </div>
        </PageSection>

        <PageSection
          sketch="data"
          sketchTone="primary"
          title={home.sections.education}
        >
          <div className="max-w-[600px] [&>p+p]:mt-6 [&_strong]:font-medium">
            <p>
              <MarkerHighlight tone="primary" variant="underline">
                <strong>{home.mba}</strong>
              </MarkerHighlight>
              ,{" "}
              {home.mbaAfter}
            </p>
            <p>
              {home.degreePrefix}{" "}
              <MarkerHighlight tone="primary" variant="underline">
                <strong>{home.degree}</strong>
              </MarkerHighlight>{" "}
              {home.degreeAfter}
            </p>
          </div>
        </PageSection>

        <PageSection
          sketch="signal"
          sketchTone="cool"
          title={home.sections.connect}
        >
          <p className="max-w-[560px]">
            {home.connectPrefix}{" "}
            <InlineLink href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</InlineLink>,{" "}
            {home.connectLinkedIn}{" "}
            <InlineLink href="https://www.linkedin.com/in/josemukorivo/">
              LinkedIn
            </InlineLink>
            , {home.connectX}{" "}
            <InlineLink href="https://x.com/josemukorivo">X</InlineLink>,{" "}
            {home.connectResume}{" "}
            <InlineLink href={RESUME_URL}>{home.resume}</InlineLink>.
          </p>
        </PageSection>
      </article>

      <SiteFooter />
    </PageShell>
  );
}
