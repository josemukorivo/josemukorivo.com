import { ExternalLink } from "./_components/external-link";
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

const RESUME_URL = "/joseph-mukorivo-head-of-engineering-resume.pdf";

const writing = [
  {
    id: "engineering-leadership-product-role",
    title: "Engineering Leadership Is a Product Role",
    date: "Jul 2026",
    dateTime: "2026-07-17T18:37:02Z",
    href: "/blog/engineering-leadership-is-a-product-role"
  },
  {
    id: "quality-culture",
    title: "Building a Culture of Quality Without Slowing the Team Down",
    date: "Jun 2026",
    dateTime: "2026-06-19T08:30:00Z",
    href: "/blog/building-a-culture-of-quality-without-slowing-the-team-down"
  },
  {
    id: "go-reflection",
    title: "Deep Dive into Go Reflection: Building a Dynamic Config Package",
    date: "Jan 2024",
    dateTime: "2024-01-26T09:40:20Z",
    href: "/blog/deep-dive-into-go-reflection-crafting-a-dynamic-open-source-config-package-13kn"
  },
  {
    id: "enterprise-frontends",
    title: "How I Structure Enterprise Frontend Applications",
    date: "Sep 2023",
    dateTime: "2023-09-09T13:09:00Z",
    href: "/blog/how-i-approach-and-structure-enterprise-frontend-applications-after-4-years-of-using-nextjs-2f5"
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
      jobTitle: "Head of Engineering and founder",
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
        "Software engineering leadership",
        "Artificial intelligence products",
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
          <div className="[&>p+p]:mt-6">
            <p className="intro-reveal-item">
              I’m an <RolePhrase>engineering leader and product builder</RolePhrase>.
              Harare, Zimbabwe is home. I design, build, and lead secure
              software systems across fintech, SaaS, AI products, and regulated
              environments.
            </p>
            <p className="intro-reveal-item">
              I’m the founder and product engineer behind{" "}
              <InlineLink href="https://www.fortyone.app">FortyOne</InlineLink>,
              an agentic project management platform, and the founder of{" "}
              <InlineLink href="https://complexus.tech">Complexus</InlineLink>.
              I currently lead engineering at Art Circles, where I set
              technical direction, shape AI strategy, and lead product
              delivery. Across my career, I’ve built and led systems spanning
              AI-powered creative tools, lending, conversational AI,
              public-sector platforms, and financial infrastructure.
            </p>
            <p className="intro-reveal-item">
              I care about useful software, clear interfaces, strong systems,
              and the small details that make products feel considered.
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
              , <InlineLink href="https://x.com/josemukorivo">X</InlineLink>,
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
                <p className="mt-1.5 text-subtle">{project.description}</p>
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
                FortyOne is an AI project management platform that connects
                company goals and key results to the plans, projects, and daily
                work that move them forward.
              </p>
              <p>
                Its AI assistant, Maya, can help turn requests into planned
                work, recommend owners and estimates, surface delivery risk,
                and answer questions about what is happening across a team.
                Important changes remain reviewable by a person before they are
                applied.
              </p>
              <p>
                It gives leaders a clear view of which key results are
                progressing, at risk, or disconnected from active work. Teams
                can see how their projects and daily decisions contribute to
                measurable outcomes, making key results part of delivery
                rather than a quarterly reporting exercise.
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

        <PageSection title="Now">
          <div className="max-w-[600px] [&>p+p]:mt-6">
            <p>
              Leading engineering and AI strategy at Art Circles, growing
              FortyOne as a live product, and pursuing an MBA at NUST.
            </p>
            <p>
              I’m interested in ambitious products, difficult systems problems,
              and meeting people who care deeply about the quality of what they
              make.
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
