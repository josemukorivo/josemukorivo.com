import Link from "next/link";
import { getLinkPreview } from "../../lib/link-previews";
import { PreviewLink } from "./preview-link";

export function InlineLink({ children, className, href, ...props }) {
  const linkClassName = ["text-link", className].filter(Boolean).join(" ");

  if (href.startsWith("/")) {
    return (
      <Link className={linkClassName} href={href} {...props}>
        {children}
      </Link>
    );
  }

  const preview = getLinkPreview(href);

  if (preview) {
    return (
      <PreviewLink
        className={linkClassName}
        href={href}
        preview={preview}
        {...props}
      >
        {children}
      </PreviewLink>
    );
  }

  return (
    <a className={linkClassName} href={href} {...props}>
      {children}
    </a>
  );
}
