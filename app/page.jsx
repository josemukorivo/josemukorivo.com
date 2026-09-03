import { Suspense } from "react";

import { AssistantIntroLink } from "./_components/assistant-intro-link";
import { ExperienceTimeline } from "./_components/experience-timeline";
import {
  GitHubContributions,
  GitHubContributionsFallback
} from "./_components/github-contributions";
import { HandwrittenReplacement } from "./_components/handwritten-edit";
import { InlineLink } from "./_components/inline-link";
import { JsonLd } from "./_components/json-ld";
import { PageSection } from "./_components/page-section";
import { PageShell } from "./_components/page-shell";
import { ProjectSlider } from "./_components/project-slider";
import { SiteFooter } from "./_components/site-footer";
import { SiteHeader } from "./_components/site-header";
import { WritingList } from "./_components/writing-list";
import { localizePath } from "../lib/i18n-config";
import { getMessages, getRequestLocale } from "../lib/i18n-server";
import { projects } from "../lib/projects";
import { createPageMetadata } from "../lib/seo";
import {
  PERSON_ID,
  ORGANIZATION_ID,
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
          "@id": ORGANIZATION_ID
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
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Complexus",
      url: "https://complexus.tech",
      founder: {
        "@id": PERSON_ID
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "professional enquiries",
        email: SITE_EMAIL,
        availableLanguage: ["English", "Shona"]
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Harare",
        addressCountry: "ZW"
      }
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
    meta: messages.projects.items[project.id]?.meta ?? project.domain,
    shortDescription:
      messages.projects.items[project.id]?.short ?? project.shortDescription
  }));

  return (
    <PageShell>
      <JsonLd data={createHomepageSchema(locale)} />
      <SiteHeader
        resumeHref={RESUME_URL}
        socialLabels={home.socialLinks}
        title={messages.headerRole}
      />

      <article className="mt-14 max-[640px]:mt-10" id="top">
        <div className="reveal-intro max-w-[600px]">
          <div className="intro-copy leading-[1.75] [&>p+p]:mt-6">
            <p className="intro-reveal-item">
              {home.introLead} {home.introProgress}{" "}
              {home.currentWorkPrefix} Art Circles
              {home.currentWorkCompanySuffix ?? ","} {home.currentWorkFounder}{" "}
              <InlineLink
                className="identity-link"
                href="https://complexus.tech"
              >
                Complexus
              </InlineLink>{" "}
              {home.currentWorkJoin}{" "}
              <InlineLink
                className="identity-link"
                href="https://www.fortyone.app"
              >
                FortyOne
              </InlineLink>
              {home.currentWorkEnd ?? "."} {home.currentWorkAfter}
            </p>
            <p className="intro-reveal-item">
              {home.careEdit ? (
                <>
                  {home.carePrefix}{" "}
                  <HandwrittenReplacement
                    correction={home.careEdit.correction}
                    draft={home.careEdit.draft}
                  />
                  <span aria-hidden="true"> 😂</span>
                  {home.careAfter}
                </>
              ) : (
                home.care
              )}{" "}
              <span className="assistant-intro-copy">
                <AssistantIntroLink locale={locale}>
                  {home.askMaya}
                </AssistantIntroLink>{" "}
                {home.askMayaAfter}
              </span>
            </p>
          </div>
        </div>

        <PageSection
          id="activity"
          sketch="data"
          sketchTone="primary"
          title={home.sections.activity}
        >
          <Suspense
            fallback={<GitHubContributionsFallback messages={home.github} />}
          >
            <GitHubContributions locale={locale} messages={home.github} />
          </Suspense>
        </PageSection>

        <PageSection
          id="experience"
          title={home.sections.experience}
        >
          <ExperienceTimeline
            items={home.experienceItems}
            labels={home.experienceSlider}
          />
        </PageSection>

        <PageSection title={home.sections.projects}>
          <ProjectSlider
            labels={home.projectSlider}
            linkHref={localizePath("/projects", locale)}
            linkLabel={home.allProjects}
            projects={localizedProjects}
          />
        </PageSection>

        <PageSection
          id="writing"
          title={home.sections.writing}
        >
          <WritingList articles={localizedWriting} />
          <p className="mt-[18px]">
            <InlineLink href={localizePath("/blog", locale)}>
              {home.allWriting}
            </InlineLink>
          </p>
        </PageSection>

        <PageSection title={home.sections.education}>
          <div className="max-w-[600px] [&>p+p]:mt-6 [&_strong]:font-medium">
            <p>
              <span className="sketch-underline">
                <strong>{home.mba}</strong>
              </span>
              ,{" "}
              {home.mbaAfter}
            </p>
            <p>
              {home.degreePrefix}{" "}
              <span className="sketch-underline">
                <strong>{home.degree}</strong>
              </span>{" "}
              {home.degreeAfter}
            </p>
          </div>
        </PageSection>

      </article>

      <SiteFooter />
    </PageShell>
  );
}
