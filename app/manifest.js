import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL
} from "../lib/site";

export default function manifest() {
  return {
    id: SITE_URL,
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "minimal-ui",
    background_color: "#fdfdfc",
    theme_color: "#fdfdfc",
    lang: "en",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
