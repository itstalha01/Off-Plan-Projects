import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { partnerById } from "@/features/partners/partners";
import { partnerStaticParams } from "@/features/partners/partnerParams";

// Partner embeds are shown inside the agency's own site (an iframe) — keep them
// out of the search index so they don't compete with the main Clearstoreys site.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return partnerStaticParams();
}

export default async function PartnerLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ agency: string }>;
}) {
  const { agency } = await params;
  if (!partnerById(agency)) notFound();
  return children;
}

export const viewport: Viewport = { themeColor: "#ffffff" };
