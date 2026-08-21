import { TrustPage } from "../_components/trust-page";
import { createPageMetadata } from "../../lib/seo";
import { TRUST_PAGES } from "../../lib/trust-pages";

export const metadata = createPageMetadata({
  title: TRUST_PAGES.privacy.title,
  description: TRUST_PAGES.privacy.description,
  path: "/privacy"
});

export default function PrivacyPage() {
  return <TrustPage page={TRUST_PAGES.privacy} />;
}
