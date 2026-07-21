"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

function HomeIcon() {
  return (
    <span className="site-dock-avatar">
      <Image
        alt=""
        height={28}
        sizes="28px"
        src="/assets/joseph.webp"
        width={28}
      />
    </span>
  );
}

function WritingIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M5 4.5h10M5 8h10M5 11.5h7M5 15h5" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M4 5.25h4.25L10 7h6v8H4v-9.75Z" />
      <path d="M4 8h12" />
    </svg>
  );
}

const ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/blog", label: "Writing", icon: WritingIcon },
  { href: "/projects", label: "Projects", icon: ProjectsIcon }
];

function isActivePath(pathname, href) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function SiteDock() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="site-dock">
      <span aria-hidden="true" className="site-dock-surface" />
      {ITEMS.map(({ href, icon: Icon, label }) => {
        const active = isActivePath(pathname, href);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            aria-label={label}
            className="site-dock-item"
            data-active={active ? "true" : undefined}
            href={href}
            key={href}
          >
            <Icon />
            <span className="site-dock-label" aria-hidden="true">
              {label}
            </span>
          </Link>
        );
      })}
      <span aria-hidden="true" className="site-dock-divider" />
      <span className="site-dock-theme">
        <ThemeToggle />
      </span>
    </nav>
  );
}
