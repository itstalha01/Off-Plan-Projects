import type { NextConfig } from "next";

// Domains allowed to embed the partner routes in an <iframe>. 'self' keeps the
// in-app preview working; add each partner agency's own site here. (Kept in sync
// with the `website` field in src/features/partners/partners.ts.)
const PARTNER_FRAME_ANCESTORS = [
  "'self'",
  "https://cornerbrickgroup.com",
  "https://*.cornerbrickgroup.com",
].join(" ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Only the /partner/* embeds may be framed, and only by the agencies
        // listed above. The rest of the site keeps the browser default.
        source: "/partner/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${PARTNER_FRAME_ANCESTORS};`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
