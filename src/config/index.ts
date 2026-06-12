export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME ?? "Off Plan Website",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  },
} as const;
