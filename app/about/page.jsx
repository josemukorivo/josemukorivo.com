import { TrustPage } from "../_components/trust-page";
import { createPageMetadata } from "../../lib/seo";
import { TRUST_PAGES } from "../../lib/trust-pages";

export const metadata = createPageMetadata({
  title: TRUST_PAGES.about.title,
  description: TRUST_PAGES.about.description,
  path: "/about"
});

export default function AboutPage() {
  return <TrustPage page={TRUST_PAGES.about} />;
}
