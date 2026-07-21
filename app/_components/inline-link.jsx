import Link from "next/link";
import { getLinkPreview } from "../../lib/link-previews";
import { PreviewLink } from "./preview-link";

export function InlineLink({ children, href, ...props }) {
  if (href.startsWith("/")) {
    return (
      <Link className="text-link" href={href} {...props}>
        {children}
      </Link>
    );
  }

  const preview = getLinkPreview(href);

  if (preview) {
    return (
      <PreviewLink
        className="text-link"
        href={href}
        preview={preview}
        {...props}
      >
        {children}
      </PreviewLink>
    );
  }

  return (
    <a className="text-link" href={href} {...props}>
      {children}
    </a>
  );
}
