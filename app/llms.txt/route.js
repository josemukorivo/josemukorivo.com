import { LLMS_TXT } from "../../lib/llms-txt";

export function GET() {
  return new Response(LLMS_TXT, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
