import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, Noto_Nastaliq_Urdu } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["500", "700"],
  variable: "--font-nastaliq",
  display: "swap",
});

export const metadata: Metadata = {
  // Public metadata must resolve to the production domain even when the
  // deployment does not supply NEXT_PUBLIC_SITE_URL.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://clearstoreys.com"
  ),
  title: "Clearstoreys · Pakistan Commercial Off-Plan",
  description:
    "Clearstoreys is a curated portal for Pakistan commercial off-plan real estate. Payment plans, possession timelines and approval status, laid bare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${nastaliq.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
