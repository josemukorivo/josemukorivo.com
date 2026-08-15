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
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
