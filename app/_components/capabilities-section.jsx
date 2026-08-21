import { PageSection } from "./page-section";

const capabilities = [
  {
    title: "Applied AI systems",
    description:
      "I design AI features around a clear job, reliable source data, and explicit boundaries. That includes tool-using agents, retrieval, structured outputs, conversational and voice interfaces, workflow automation, evaluation, usage controls, and human approval for consequential actions. I work across the model, application, and operational layers so the finished system can handle uncertainty, failure, and changing product requirements without hiding those tradeoffs from the team."
  },
  {
    title: "Product architecture",
    description:
      "I turn product intent into understandable system boundaries, data contracts, and delivery plans. My hands-on work spans Next.js and React applications, Go and Node.js services, relational data, APIs, cloud infrastructure, analytics, authentication, billing, and third-party integrations. I am particularly useful when a product has grown complex enough that user experience, security, data integrity, performance, and maintainability need to be considered together."
  },
  {
    title: "Engineering leadership",
    description:
      "I help teams connect company priorities to technical work, make architectural decisions with the right amount of evidence, and create a delivery environment where ownership is clear. The work includes technical direction, hiring and mentoring, planning, design and code review, incident learning, and communicating risk to product and business leaders. I stay close to implementation because strategy is stronger when it reflects how the product actually behaves."
  },
  {
    title: "Reliable delivery",
    description:
      "I have built and operated software in fintech and other regulated environments where correctness and traceability matter. I favor small, reviewable changes; clear validation at system boundaries; observable background work; deliberate failure states; and tests that protect behavior rather than mirror implementation. That approach carries from an early product prototype through production hardening, migration, and the less glamorous maintenance that keeps a system useful over time."
  }
];

export function CapabilitiesSection() {
  return (
    <PageSection
      id="capabilities"
      sketch="flow"
      sketchTone="violet"
      title="Capabilities"
    >
      <div className="grid grid-cols-2 gap-x-10 gap-y-10 max-[640px]:grid-cols-1 max-[640px]:gap-y-8">
        {capabilities.map((capability) => (
          <div key={capability.title}>
            <h3 className="font-medium">{capability.title}</h3>
            <p className="mt-2 text-[14px] leading-[1.75] text-subtle">
              {capability.description}
            </p>
          </div>
        ))}
      </div>
    </PageSection>
  );
}
