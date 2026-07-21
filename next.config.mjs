import { POSTHOG_PROXY_PATH } from "./lib/posthog-config.mjs";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: `${POSTHOG_PROXY_PATH}/static/:path*`,
        destination: "https://us-assets.i.posthog.com/static/:path*"
      },
      {
        source: `${POSTHOG_PROXY_PATH}/array/:path*`,
        destination: "https://us-assets.i.posthog.com/array/:path*"
      },
      {
        source: `${POSTHOG_PROXY_PATH}/:path*`,
        destination: "https://us.i.posthog.com/:path*"
      }
    ];
  },
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/schedule",
        destination: "/?action=schedule",
        permanent: false
      }
    ];
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
