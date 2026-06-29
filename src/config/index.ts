export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME ?? "Off Plan Website",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  },
  // Google Ads conversion tracking for the YouTube-ad landing page. Both stay
  // empty until the real IDs are set in the environment, which keeps the tag
  // dormant (no gtag.js loaded) in dev and on any deploy that hasn't wired them.
  googleAds: {
    // The conversion ID, e.g. "AW-123456789".
    id: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",
    // The conversion action's label, e.g. "abcDEFghiJKL". Combined with the id
    // as the gtag `send_to` value ("AW-123456789/abcDEFghiJKL").
    conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL ?? "",
  },
} as const;
