export function JsonLd({ data }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c")
      }}
      type="application/ld+json"
    />
  );
}
