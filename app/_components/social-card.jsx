export const socialImageSize = {
  width: 1200,
  height: 630
};

export const socialImageContentType = "image/png";

const socialCardColors = {
  background: "#10100f",
  foreground: "#d8d8d3",
  muted: "#8d8d86",
  subtle: "#adada6"
};

export function SocialCard({ eyebrow, title }) {
  const titleSize = title.length > 80 ? 54 : title.length > 52 ? 62 : 72;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: socialCardColors.background,
        color: socialCardColors.foreground,
        fontFamily:
          "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 24,
          color: socialCardColors.subtle
        }}
      >
        <span style={{ display: "flex" }}>{eyebrow}</span>
        <span style={{ display: "flex" }}>josemukorivo.com</span>
      </div>

      <div
        style={{
          display: "flex",
          maxWidth: 1040,
          fontSize: titleSize,
          fontWeight: 500,
          letterSpacing: "-0.04em",
          lineHeight: 1.08
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 25
        }}
      >
        <span
          style={{
            display: "flex",
            fontFamily: "Georgia, Times New Roman, serif",
            fontStyle: "italic"
          }}
        >
          Joseph Mukorivo
        </span>
        <span style={{ display: "flex", color: socialCardColors.muted }}>—</span>
        <span style={{ display: "flex", color: socialCardColors.subtle }}>
          AI Product Engineer & Engineering Leader
        </span>
      </div>
    </div>
  );
}
