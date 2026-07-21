/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
