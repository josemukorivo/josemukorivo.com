import {
  getAgentContent,
  getAgentNotFoundContent
} from "../../../../lib/agent-content";

const RESPONSE_HEADERS = {
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept, Accept-Encoding"
};

export async function GET(_request, { params }) {
  const { path = [] } = await params;
  const pathname = `/${path.join("/")}`;
  const content = await getAgentContent(pathname);

  return new Response(content ?? getAgentNotFoundContent(), {
    status: content ? 200 : 404,
    headers: RESPONSE_HEADERS
  });
}
