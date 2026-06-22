import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Hero } from "@/features/projects/components/Hero";
import { FilterToolbar } from "@/features/projects/components/FilterToolbar";
import { ProjectGrid } from "@/features/projects/components/ProjectGrid";
import { partnerById } from "@/features/partners/partners";
import { partnerStaticParams } from "@/features/partners/partnerParams";

export const dynamicParams = false;

export function generateStaticParams() {
  return partnerStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ agency: string }>;
}): Promise<Metadata> {
  const { agency } = await params;
  const partner = partnerById(agency);
  if (!partner) return {};
  return {
    title: `${partner.name} · Off-Plan Projects`,
    description: `Browse off-plan projects available through ${partner.name}.`,
  };
}

export default async function PartnerCatalogPage({
  params,
}: {
  params: Promise<{ agency: string }>;
}) {
  const { agency } = await params;
  const partner = partnerById(agency);
  if (!partner) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero partner={partner} />
        <FilterToolbar />
        <ProjectGrid />
      </main>
      <SiteFooter />
    </>
  );
}
