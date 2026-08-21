import { TrustPage } from "../_components/trust-page";
import { createPageMetadata } from "../../lib/seo";
import { TRUST_PAGES } from "../../lib/trust-pages";

export const metadata = createPageMetadata({
  title: TRUST_PAGES.contact.title,
  description: TRUST_PAGES.contact.description,
  path: "/contact"
});

export default function ContactPage() {
  return <TrustPage page={TRUST_PAGES.contact} />;
}
