import { ExternalLink } from "./_components/external-link";
import { AssistantIntroLink } from "./_components/assistant-intro-link";
import { InlineLink } from "./_components/inline-link";
import { JsonLd } from "./_components/json-ld";
import { PageSection } from "./_components/page-section";
import { PageShell } from "./_components/page-shell";
import { RolePhrase } from "./_components/role-phrase";
import { SiteFooter } from "./_components/site-footer";
import { SiteHeader } from "./_components/site-header";
import { WritingList } from "./_components/writing-list";
import { projects } from "../lib/projects";
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

const homepageSchema = {
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
      inLanguage: "en",
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

export default function Home() {
  return (
    <PageShell>
      <JsonLd data={homepageSchema} />
      <SiteHeader />

      <article className="mt-[88px] max-[640px]:mt-16" id="top">
        <div className="reveal-intro max-w-[600px]">
          <div className="text-[16px] leading-[1.75] [&>p+p]:mt-6">
            <p className="intro-reveal-item">
              I’m an{" "}
              <RolePhrase>
                AI product engineer and engineering leader 🔧
              </RolePhrase>
              . Harare, Zimbabwe 🇿🇼 is home. I build production software and
              AI systems—from secure full-stack products to agents,
              conversational interfaces, voice, structured automation, and
              human-in-the-loop workflows—designed to hold up when people depend
              on them, not merely look convincing in a demo.
            </p>
            <p className="intro-reveal-item">
              I’m the founder of{" "}
              <InlineLink href="https://complexus.tech">Complexus</InlineLink>{" "}
              and the creator of{" "}
              <InlineLink href="https://www.fortyone.app">FortyOne</InlineLink>,
              an agentic project management platform that brings company goals,
              customer feedback, project planning, and everyday delivery into
              one connected system. I currently lead engineering at Art
              Circles, setting technical direction, shaping AI strategy, and
              guiding product delivery.
            </p>
            <p className="intro-reveal-item">
              Across my work, I combine technical leadership, product strategy,
              and project management with hands-on experience building secure
              full-stack systems, cloud architecture, analytics, and
              integrations. Much of that experience was shaped in fintech and
              other regulated environments, where small technical decisions can
              carry real consequences.
            </p>
            <p className="intro-reveal-item">
              I care about useful software, clear interfaces, strong systems,
              and thoughtful details. If you’d like to know more about me,{" "}
              <span className="assistant-intro-copy">
                <AssistantIntroLink>ask Maya, my AI assistant</AssistantIntroLink>.
              </span>
            </p>
            <p className="intro-reveal-item text-subtle">
              Find me on{" "}
              <InlineLink href="https://github.com/josemukorivo">
                GitHub
              </InlineLink>
              ,{" "}
              <InlineLink href="https://www.linkedin.com/in/josemukorivo/">
                LinkedIn
              </InlineLink>
              , or <InlineLink href="https://x.com/josemukorivo">X</InlineLink>,
              read my <InlineLink href="/blog">writing</InlineLink>, or{" "}
              <InlineLink href={`mailto:${SITE_EMAIL}`}>
                send me an email
              </InlineLink>
              .
            </p>
          </div>
        </div>

        <PageSection id="writing" title="Writing">
          <WritingList articles={writing} />
          <p className="mt-[18px]">
            <InlineLink href="/blog">All writing</InlineLink>
          </p>
        </PageSection>

        <PageSection title="Projects">
          <div className="grid grid-cols-3 gap-9 max-[640px]:grid-cols-1 max-[640px]:gap-[26px]">
            {projects.map((project) => (
              <div key={project.name}>
                <span className="font-medium">
                  <ExternalLink href={project.href}>
                    {project.name}
                  </ExternalLink>
                </span>
                <p className="mt-1.5 text-subtle">
                  {project.shortDescription}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-[22px]">
            <InlineLink href="/projects">All projects</InlineLink>
          </p>
        </PageSection>

        <PageSection id="building" title="Building">
          <div>
            <div className="mb-5 flex items-baseline justify-between gap-6">
              <span className="font-medium">
                <ExternalLink href="https://www.fortyone.app">
                  FortyOne
                </ExternalLink>
              </span>
              <span className="text-[13px] text-muted">Live product</span>
            </div>
            <div className="[&>p+p]:mt-6">
              <p>
                FortyOne is an agentic project management platform that keeps
                company goals, projects, and daily work connected. I built Maya
                to turn requests into planned work, suggest owners and
                estimates, answer workspace questions, and surface delivery
                risk while keeping important changes reviewable.
              </p>
              <p>
                Customer feedback lives in the same flow. Teams can collect and
                prioritize requests, move accepted ideas into the plan, and let
                customers follow their progress on a public roadmap.
              </p>
            </div>
          </div>
        </PageSection>

        <PageSection title="Education">
          <div className="max-w-[600px] [&>p+p]:mt-6 [&_strong]:font-medium">
            <p>
              <strong>Master of Business Administration (MBA)</strong>,
              National University of Science and Technology (NUST) — in
              progress.
            </p>
            <p>
              I earned a{" "}
              <strong>
                First Class BSc Honours in Information Technology
              </strong>{" "}
              from Chinhoyi University of Technology in 2019.
            </p>
          </div>
        </PageSection>

        <PageSection title="Connect">
          <p className="max-w-[560px]">
            Reach me at{" "}
            <InlineLink href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</InlineLink>,
            find me on{" "}
            <InlineLink href="https://www.linkedin.com/in/josemukorivo/">
              LinkedIn
            </InlineLink>
            , follow me on{" "}
            <InlineLink href="https://x.com/josemukorivo">X</InlineLink>, or view
            my <InlineLink href={RESUME_URL}>résumé</InlineLink>.
          </p>
        </PageSection>
      </article>

      <SiteFooter />
    </PageShell>
  );
}
