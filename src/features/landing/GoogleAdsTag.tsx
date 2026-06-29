import Script from "next/script";
import { config } from "@/config";

// Loads Google's gtag.js for Google Ads conversion tracking. Renders nothing
// unless NEXT_PUBLIC_GOOGLE_ADS_ID is set, so dev and un-configured deploys ship
// no third-party script at all. Mounted on the ad landing page (not site-wide),
// since that's the only page where a conversion fires.
export function GoogleAdsTag() {
  const { id } = config.googleAds;
  if (!id) return null;

  return (
    <>
      <Script
        id="gtag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
