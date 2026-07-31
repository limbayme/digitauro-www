/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async rewrites() {
    return [
      {
        source: "/index.html",
        destination: "/"
      },
      {
        source: "/insights/:slug.html",
        destination: "/insights/:slug"
      },
      {
        source: "/:slug.html",
        destination: "/:slug"
      }
    ];
  }
};

export default nextConfig;
