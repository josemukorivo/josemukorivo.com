export const OPEN_PORTFOLIO_ASSISTANT_EVENT =
  "portfolio-assistant:open";

const PENDING_ASSISTANT_PROMPT_KEY =
  "joseph-portfolio:assistant-prompt:v1";

export function requestPortfolioAssistantOpen(source) {
  window.dispatchEvent(
    new CustomEvent(OPEN_PORTFOLIO_ASSISTANT_EVENT, {
      detail: { source }
    })
  );
}

export function queuePortfolioAssistantPrompt(prompt) {
  if (!prompt || typeof prompt.text !== "string") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      PENDING_ASSISTANT_PROMPT_KEY,
      JSON.stringify(prompt)
    );
  } catch {
    // The assistant page still opens if session storage is unavailable.
  }
}

export function consumePortfolioAssistantPrompt() {
  try {
    const serializedPrompt = window.sessionStorage.getItem(
      PENDING_ASSISTANT_PROMPT_KEY
    );

    window.sessionStorage.removeItem(PENDING_ASSISTANT_PROMPT_KEY);

    if (!serializedPrompt) {
      return undefined;
    }

    const prompt = JSON.parse(serializedPrompt);

    if (
      typeof prompt?.id !== "string" ||
      typeof prompt?.source !== "string" ||
      typeof prompt?.text !== "string"
    ) {
      return undefined;
    }

    return prompt;
  } catch {
    return undefined;
  }
}
