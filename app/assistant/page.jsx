import { PortfolioAssistantPage } from "../_components/portfolio-assistant-page";

export const metadata = {
  title: "Ask my AI Assistant",
  description:
    "Ask Joseph Mukorivo's AI assistant about his work, experience, products, writing, and résumé.",
  alternates: { canonical: "/assistant" },
  robots: { follow: true, index: false }
};

export default function AssistantPage() {
  return <PortfolioAssistantPage />;
}
