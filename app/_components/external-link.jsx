import { getLinkPreview } from "../../lib/link-previews";
import { PreviewLink } from "./preview-link";

export function ExternalMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-[13px] fill-none stroke-current stroke-[1.25] [stroke-linecap:round] [stroke-linejoin:round] transition-transform duration-180 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-0"
      viewBox="0 0 16 16"
    >
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  );
}

export function ExternalLink({ children, href }) {
  const preview = getLinkPreview(href);

  return (
    <PreviewLink
      className="group inline-flex w-fit items-center gap-1"
      href={href}
      preview={preview}
    >
      <span className="external-link-label">{children}</span>
      <ExternalMark />
    </PreviewLink>
  );
}
