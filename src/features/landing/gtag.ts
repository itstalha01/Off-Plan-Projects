import { config } from "@/config";

// Minimal gtag typing — the function is injected by GoogleAdsTag's gtag.js.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Fires the Google Ads conversion for a lead submission. No-ops safely when the
// IDs aren't configured or gtag.js hasn't loaded (e.g. blocked by an ad blocker),
// so it never throws and never blocks the WhatsApp hand-off.
export function trackLeadConversion(): void {
  const { id, conversionLabel } = config.googleAds;
  if (!id || !conversionLabel) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "conversion", {
    send_to: `${id}/${conversionLabel}`,
  });
}
