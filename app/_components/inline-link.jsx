import Link from "next/link";

export function InlineLink({ children, href, ...props }) {
  if (href.startsWith("/")) {
    return (
      <Link className="text-link" href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a className="text-link" href={href} {...props}>
      {children}
    </a>
  );
}
