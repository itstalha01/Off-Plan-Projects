// Preset lifetimes offered when generating a share link. `hours: null` means
// the link never expires.
export const SHARE_EXPIRY_OPTIONS = [
  { key: "24h", label: "24 hours", hours: 24 },
  { key: "48h", label: "48 hours", hours: 48 },
  { key: "7d", label: "7 days", hours: 24 * 7 },
  { key: "never", label: "No expiry", hours: null },
] as const;

export type ShareExpiryKey = (typeof SHARE_EXPIRY_OPTIONS)[number]["key"];

export const DEFAULT_SHARE_EXPIRY_KEY: ShareExpiryKey = "48h";
