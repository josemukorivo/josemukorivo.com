export const socialImageSize = {
  width: 1200,
  height: 630
};

export const socialImageContentType = "image/png";

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
        background: "#fdfdfc",
        color: "#242424",
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
          color: "#62625f"
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
        <span style={{ display: "flex", color: "#adada8" }}>—</span>
        <span style={{ display: "flex", color: "#62625f" }}>
          Head of Engineering & founder
        </span>
      </div>
    </div>
  );
}
