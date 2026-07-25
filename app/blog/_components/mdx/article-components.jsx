import { ContactMessageCard } from "../../../_components/contact-message-card";
import styles from "./article-components.module.css";

const DEFAULT_AUDIO_STAGES = [
  "Microphone",
  "MediaRecorder",
  "Chunk buffer",
  "Audio Blob",
  "Transcription",
  "Assistant"
];

function ArchitectureNode({ detail, label, tone = "default" }) {
  return (
    <div className={styles.architectureNode} data-tone={tone}>
      <span className={styles.nodeLabel}>{label}</span>
      <span className={styles.nodeDetail}>{detail}</span>
    </div>
  );
}

export function AssistantArchitecture() {
  return (
    <figure
      aria-labelledby="assistant-architecture-title"
      className={styles.figure}
    >
      <figcaption className={styles.figureHeader}>
        <span
          className={styles.figureTitle}
          id="assistant-architecture-title"
        >
          Two conversations, one set of tools
        </span>
      </figcaption>

      <div className={styles.architecture}>
        <ArchitectureNode
          detail="Types or speaks"
          label="Visitor"
          tone="visitor"
        />

        <div aria-hidden="true" className={styles.splitConnector}>
          <span />
          <span />
        </div>

        <div className={styles.architectureBranches}>
          <div className={styles.architectureBranch}>
            <span className={styles.branchLabel}>Text path</span>
            <ArchitectureNode detail="Streamed messages" label="Next.js API" />
            <span aria-hidden="true" className={styles.inlineConnector} />
            <ArchitectureNode detail="Text model" label="OpenAI" tone="model" />
          </div>

          <div className={styles.architectureBranch}>
            <span className={styles.branchLabel}>Voice path</span>
            <ArchitectureNode detail="Live audio" label="WebRTC" />
            <span aria-hidden="true" className={styles.inlineConnector} />
            <ArchitectureNode
              detail="Realtime model"
              label="OpenAI"
              tone="model"
            />
          </div>
        </div>

        <div aria-hidden="true" className={styles.mergeConnector}>
          <span />
          <span />
        </div>

        <ArchitectureNode
          detail="Projects, articles, profile, contact draft"
          label="Website tools"
          tone="tools"
        />
      </div>
    </figure>
  );
}

export function AudioChunkTimeline({ stages = DEFAULT_AUDIO_STAGES }) {
  return (
    <figure
      aria-labelledby="audio-timeline-title"
      className={styles.figure}
    >
      <figcaption className={styles.figureHeader}>
        <span className={styles.figureTitle} id="audio-timeline-title">
          Small browser events become one message
        </span>
      </figcaption>

      <ol className={styles.timeline}>
        {stages.map((stage, index) => (
          <li className={styles.timelineStage} key={stage}>
            <span
              aria-hidden="true"
              className={styles.timelineMarker}
              style={{ "--stage-index": index }}
            />
            <span className={styles.timelineIndex}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={styles.timelineLabel}>{stage}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function ToolCallTrace({
  question = "Which projects involved AI?",
  query = "AI",
  result = "A ranked set of matching projects with descriptions and links.",
  tool = "searchProjects"
}) {
  const argumentsJson = JSON.stringify({ query }, null, 2);

  return (
    <details className={styles.trace}>
      <summary className={styles.traceSummary}>
        <span>
          <span className={styles.figureTitle}>{question}</span>
        </span>
        <span aria-hidden="true" className={styles.traceToggle}>
          Inspect
        </span>
      </summary>

      <div className={styles.traceSteps}>
        <div className={styles.traceStep}>
          <span className={styles.traceNumber}>01</span>
          <div className={styles.traceContent}>
            <span className={styles.traceLabel}>Model selects a tool</span>
            <code className={styles.traceCode}>{tool}</code>
          </div>
        </div>

        <div className={styles.traceStep}>
          <span className={styles.traceNumber}>02</span>
          <div className={styles.traceContent}>
            <span className={styles.traceLabel}>
              Server validates the arguments
            </span>
            <pre className={styles.tracePre}>
              <code>{argumentsJson}</code>
            </pre>
          </div>
        </div>

        <div className={styles.traceStep}>
          <span className={styles.traceNumber}>03</span>
          <div className={styles.traceContent}>
            <span className={styles.traceLabel}>
              Application returns grounded data
            </span>
            <span className={styles.traceResult}>{result}</span>
          </div>
        </div>
      </div>
    </details>
  );
}

export function ContactMessagePreview() {
  return (
    <figure
      aria-labelledby="contact-message-preview-title"
      className={styles.figure}
    >
      <figcaption className={styles.figureHeader}>
        <span
          className={styles.figureTitle}
          id="contact-message-preview-title"
        >
          The visitor reviews the message before anything is sent
        </span>
      </figcaption>
      <div className={styles.contactPreview}>
        <ContactMessageCard
          output={{
            email: "alex@example.com",
            message:
              "Hi Joseph, I read about the assistant on your personal website and would like to discuss a similar project.",
            name: "Alex Morgan"
          }}
          preview
        />
      </div>
    </figure>
  );
}
