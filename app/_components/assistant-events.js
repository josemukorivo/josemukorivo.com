export const OPEN_PORTFOLIO_ASSISTANT_EVENT =
  "portfolio-assistant:open";

export function requestPortfolioAssistantOpen(source) {
  window.dispatchEvent(
    new CustomEvent(OPEN_PORTFOLIO_ASSISTANT_EVENT, {
      detail: { source }
    })
  );
}
