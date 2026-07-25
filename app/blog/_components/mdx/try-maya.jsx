"use client";

import { AssistantIntroLink } from "../../../_components/assistant-intro-link";
import styles from "./article-components.module.css";

export function TryMaya() {
  return (
    <aside className={styles.tryMaya}>
      <div>
        <span className={styles.tryMayaTitle}>Ask Maya about this build</span>
        <span className={styles.tryMayaCopy}>
          The assistant described in this article is available on this site.
        </span>
      </div>
      <AssistantIntroLink>Talk to Maya</AssistantIntroLink>
    </aside>
  );
}
