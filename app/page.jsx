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
          <IntroSketches />
          <div className="intro-copy text-[15px] leading-[1.75] [&>p+p]:mt-6">
            <p className="intro-reveal-item">
              I’m an{" "}
              <RolePhrase>
                AI product engineer and engineering leader🔧
              </RolePhrase>
              . Harare, Zimbabwe 🇿🇼 is home. I build production software and
              AI systems—from secure full-stack products to agents,
              conversational and voice interfaces, automation, and
              human-in-the-loop workflows—that people can depend on beyond a
              {" "}
              <HandwrittenReplacement
                correction="demo"
                draft="prototype"
              />
              .
            </p>
            <p className="intro-reveal-item">
              I founded{" "}
              <MarkerHighlight tone="violet" variant="underline">
                <InlineLink href="https://complexus.tech">Complexus</InlineLink>
              </MarkerHighlight>{" "}
              and built{" "}
              <MarkerHighlight>
                <InlineLink href="https://www.fortyone.app">FortyOne</InlineLink>
              </MarkerHighlight>
              ,
              an agentic project management platform connecting company{" "}
              <HandwrittenInsertion
                after="als"
                before="g"
                character="o"
                value="goals"
              />
              , customer feedback, planning, and delivery. I currently lead
              engineering at Art Circles, setting technical direction, shaping
              AI strategy, and guiding product delivery.
            </p>
            <p className="intro-reveal-item">
              My work combines{" "}
              <MarkerHighlight tone="violet" variant="underline">
                technical leadership
              </MarkerHighlight>
              , product strategy, project management, and hands-on engineering
              across secure full-stack systems, cloud architecture, analytics,
              and integrations—often in fintech and regulated environments where
              details matter.
            </p>
            <p className="intro-reveal-item">
              I care about useful software, clear interfaces,{" "}
              <HandwrittenReplacement
                correction="reliable"
                draft="strong"
              />{" "}systems, and{" "}
              <MarkerHighlight tone="cool" variant="underline">
                thoughtful details
              </MarkerHighlight>
              .{" "}
              <span className="assistant-intro-copy">
                <AssistantIntroLink>Ask Maya, my AI assistant</AssistantIntroLink>{" "}
                to learn more about me.
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

        <PageSection
          id="writing"
          sketch="branch"
          sketchTone="primary"
          title="Writing"
        >
          <WritingList articles={writing} />
          <p className="mt-[18px]">
            <InlineLink href="/blog">All writing</InlineLink>
          </p>
        </PageSection>

        <PageSection sketch="nodes" sketchTone="cool" title="Projects">
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

        <PageSection
          id="building"
          sketch="terminal"
          sketchTone="violet"
          title="Building"
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
              <span className="text-[13px] text-muted">Live product</span>
            </div>
            <div className="[&>p+p]:mt-6">
              <p>
                FortyOne is an agentic project management platform that
                connects strategy, customer feedback, planning, and daily
                delivery. I built Maya to turn requests into planned work,
                suggest owners and estimates, answer workspace questions, and
                surface delivery risk while keeping important changes
                reviewable.
              </p>
              <p>
                Company{" "}
                <HandwrittenInsertion
                  after="tategy"
                  before="s"
                  character="r"
                  value="strategy"
                />{" "}
                starts with objectives and key results. Teams can map how goals
                relate, connect them to roadmaps and planned work, and see
                whether daily delivery is moving the{" "}
                <HandwrittenReplacement
                  correction="outcomes"
                  draft="output"
                />{" "}
                they committed to.
              </p>
              <p>
                Customer feedback lives in the same flow. Teams can collect and
                prioritize requests, move accepted ideas into the plan, and let
                customers follow their progress on a public roadmap.
              </p>
            </div>
          </div>
        </PageSection>

        <PageSection sketch="data" sketchTone="primary" title="Education">
          <div className="max-w-[600px] [&>p+p]:mt-6 [&_strong]:font-medium">
            <p>
              <MarkerHighlight tone="primary" variant="underline">
                <strong>Master of Business Administration (MBA)</strong>
              </MarkerHighlight>
              ,{" "}
              National University of Science and Technology (NUST) — in
              progress.
            </p>
            <p>
              I earned a{" "}
              <MarkerHighlight tone="primary" variant="underline">
                <strong>
                  First Class BSc Honours in Information Technology
                </strong>
              </MarkerHighlight>{" "}
              from Chinhoyi University of Technology in 2019.
            </p>
          </div>
        </PageSection>

        <PageSection sketch="signal" sketchTone="cool" title="Connect">
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
