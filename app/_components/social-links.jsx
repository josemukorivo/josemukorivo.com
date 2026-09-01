import { getLinkPreview } from "../../lib/link-previews";
import { HandDrawnIcon } from "./hand-drawn-icon";
import { PreviewLink } from "./preview-link";

function SocialIcon({ name }) {
  if (name === "x") {
    return (
      <HandDrawnIcon>
        <path d="M5 4.8 18.8 19.2M18.5 4.8 5.2 19.2M8.1 4.8l10.7 14.4M5.2 19.2l6.2-6.7" />
      </HandDrawnIcon>
    );
  }

  if (name === "github") {
    return (
      <HandDrawnIcon>
        <path d="M8.7 19.4c-4.8 1.5-4.8-2.6-6.7-3.2m13.5 5v-3.7c0-1 .1-1.5-.6-2.1 3-.3 5.9-1.5 5.9-6.4a5 5 0 0 0-1.4-3.4 4.5 4.5 0 0 0-.1-3.4s-1.2-.3-3.8 1.4a13 13 0 0 0-6.6 0C6.3 1.9 5.1 2.2 5.1 2.2A4.5 4.5 0 0 0 5 5.6 5 5 0 0 0 3.6 9c0 4.9 2.9 6.1 5.9 6.4-.7.6-.7 1.3-.6 2.1v3.7" />
      </HandDrawnIcon>
    );
  }

  if (name === "linkedin") {
    return (
      <HandDrawnIcon>
        <path d="M5.5 9.2c-.2 3.6-.1 7.4 0 10.5M5.5 4.5v.1M10.5 19.7V9.2m0 4.4c.8-3.2 6.7-4.2 7.8.2.4 1.8.1 4 .2 5.9" />
        <path d="M2.8 3.1c4.8-.4 13.6-.3 18.3.1.4 4.7.3 13.2-.1 17.8-4.8.4-13.6.3-18.2-.1-.4-4.8-.4-13 0-17.8Z" />
      </HandDrawnIcon>
    );
  }

  if (name === "email") {
    return (
      <HandDrawnIcon>
        <path d="M3.2 6.3c4.7-.4 12.8-.3 17.6.1.3 3.7.3 8.4-.1 12-4.8.4-12.6.3-17.4-.1-.4-3.7-.4-8.2-.1-12Z" />
        <path d="m4.2 7.2 7.8 6 7.8-6" />
      </HandDrawnIcon>
    );
  }

  return (
    <HandDrawnIcon>
      <path d="M5.1 2.8c3-.3 7.1-.2 10.2.1l3.6 3.8c.3 4.6.2 9.7-.1 14.5-3.8.4-9.8.3-13.6-.1-.4-5.8-.4-12.5-.1-18.3Z" />
      <path d="M15.1 3v4h3.6M8 12.1c2.7-.3 5.4-.2 8.1 0M8 15.8c2.1-.2 4.1-.2 6.2 0" />
    </HandDrawnIcon>
  );
}

export function SocialLinks({ labels, resumeHref }) {
  const links = [
    {
      href: "https://x.com/josemukorivo",
      label: labels.x,
      name: "x"
    },
    {
      href: "https://github.com/josemukorivo",
      label: labels.github,
      name: "github"
    },
    {
      href: "https://www.linkedin.com/in/josemukorivo/",
      label: labels.linkedin,
      name: "linkedin"
    },
    {
      href: "mailto:hello@josemukorivo.com",
      label: labels.email,
      name: "email"
    },
    {
      href: resumeHref,
      label: labels.resume,
      name: "resume"
    }
  ];

  return (
    <nav aria-label={labels.label} className="social-links">
      <ul>
        {links.map((link) => (
          <li key={link.name}>
            <PreviewLink
              aria-label={link.label}
              className="social-link"
              href={link.href}
              preview={getLinkPreview(link.href)}
              title={link.label}
            >
              <SocialIcon name={link.name} />
            </PreviewLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
