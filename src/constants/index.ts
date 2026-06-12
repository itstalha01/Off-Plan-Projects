export const SITE_NAME = "Off Plan Website";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const QUERY_KEYS = {
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
} as const;
