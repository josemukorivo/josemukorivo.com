import Link from "next/link";
import { RevealObserver } from "./reveal-observer";

const RESUME_URL =
  "https://docs.google.com/document/d/16-sqqDzL3SR1vomlTW6gKOKIqJ7xd_MgfJXrDLkqbnU/edit";

const writing = [
  {
    title: "I Got Tired of Jira. So I Built an Agentic Project Management Tool",
    date: "Jan 2026",
    href: "/blog/i-got-tired-of-jira-so-i-built-an-agentic-project-management-tool-and-open-sourced-it-3ghp"
  },
  {
    title: "Can One Person Really Build a Complex System from Scratch?",
    date: "Aug 2025",
    href: "/blog/can-one-person-really-build-a-complex-system-from-scratch-7dn"
  },
  {
    title: "Deep Dive into Go Reflection",
    date: "Jan 2024",
    href: "/blog/deep-dive-into-go-reflection-crafting-a-dynamic-open-source-config-package-13kn"
  },
  {
    title: "How I Structure Enterprise Frontend Applications",
    date: "Sep 2023",
    href: "/blog/how-i-approach-and-structure-enterprise-frontend-applications-after-4-years-of-using-nextjs-2f5"
  }
];

function ExternalMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  );
}

function ExternalLink({ href, children }) {
  return (
    <a
      className="external"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{children}</span>
      <ExternalMark />
    </a>
  );
}

function Section({ title, children, id }) {
  return (
    <section id={id} data-reveal>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <RevealObserver />

      <header className="site-header reveal-header" data-reveal>
        <a className="name" href="#top">
          Joseph Mukorivo
        </a>
        <span>Head of Engineering & founder</span>
      </header>

      <article id="top">
        <div className="intro reveal-intro" data-reveal>
          <p>
            I’m an engineering leader and product builder. Harare, Zimbabwe is
            home. I design, build, and lead secure software systems across
            fintech, SaaS, AI products, and regulated environments.
          </p>
          <p>
            I’m the founder and product engineer behind{" "}
            <a href="https://www.fortyone.app">FortyOne</a>, an AI project
            management platform, and the founder of{" "}
            <a href="https://complexus.tech">Complexus</a>. I currently lead
            engineering at Art Circles, where I set technical direction, shape
            AI strategy, and lead product delivery. Across my career, I’ve built
            and led systems spanning AI-powered creative tools, lending,
            conversational AI, public-sector platforms, and financial
            infrastructure.
          </p>
          <p>
            I care about useful software, clear interfaces, strong systems, and
            the small details that make products feel considered.
          </p>
          <p className="intro-links">
            Find me on <a href="https://github.com/josemukorivo">GitHub</a>,{" "}
            <a href="https://www.linkedin.com/in/josemukorivo/">LinkedIn</a>,
            read my <Link href="/blog">writing</Link>, or{" "}
            <a href="mailto:hello@josemukorivo.com">send me an email</a>.
          </p>
        </div>

        <Section title="Building" id="building">
          <div className="project">
            <div className="project-heading">
              <ExternalLink href="https://www.fortyone.app">
                FortyOne
              </ExternalLink>
              <span>Live product</span>
            </div>
            <p>
              FortyOne is an AI project management platform that connects
              company goals and key results to the plans, projects, and daily
              work that move them forward.
            </p>
            <p>
              Its AI assistant, Maya, can help turn requests into planned work,
              recommend owners and estimates, surface delivery risk, and answer
              questions about what is happening across a team. Important
              changes remain reviewable by a person before they are applied.
            </p>
            <p>
              It gives leaders a clear view of which key results are
              progressing, at risk, or disconnected from active work. Teams can
              see how their projects and daily decisions contribute to
              measurable outcomes, making key results part of delivery rather
              than a quarterly reporting exercise.
            </p>
          </div>
        </Section>

        <Section title="Projects">
          <div className="item-list">
            <div className="item">
              <ExternalLink href="https://www.fortyone.app">
                FortyOne
              </ExternalLink>
              <p>AI project management that connects goals to daily work.</p>
            </div>
            <div className="item">
              <ExternalLink href="https://github.com/josemukorivo/config">
                Config
              </ExternalLink>
              <p>An open-source configuration package for Go applications.</p>
            </div>
            <div className="item">
              <ExternalLink href="https://complexus.tech">
                Complexus
              </ExternalLink>
              <p>
                The product company through which I build thoughtful software
                and explore new ideas.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Education">
          <div className="prose">
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
        </Section>

        <Section title="Writing" id="writing">
          <div className="rows writing-list">
            {writing.map((post) => (
              <Link className="writing-row" href={post.href} key={post.title}>
                <span className="writing-title">
                  <span>{post.title}</span>
                </span>
                <time>{post.date}</time>
              </Link>
            ))}
          </div>
          <p className="after-list">
            <Link href="/blog">All writing</Link>
          </p>
        </Section>

        <Section title="Now">
          <div className="prose">
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
        </Section>

        <Section title="Connect">
          <p className="connect">
            Reach me at{" "}
            <a href="mailto:hello@josemukorivo.com">
              hello@josemukorivo.com
            </a>
            , find me on{" "}
            <a href="https://www.linkedin.com/in/josemukorivo/">LinkedIn</a>,
            or view my <a href={RESUME_URL}>résumé</a>.
          </p>
        </Section>
      </article>

      <footer className="site-footer" data-reveal>
        <span>Joseph Mukorivo</span>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
