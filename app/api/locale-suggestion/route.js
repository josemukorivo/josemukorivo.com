export const dynamic = "force-dynamic";

export function GET(request) {
  const countryCode = request.headers
    .get("x-vercel-ip-country")
    ?.toUpperCase();

  return Response.json(
    { suggestShona: countryCode === "ZW" },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0"
      }
    }
  );
}
