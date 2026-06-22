import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectHub } from "@/features/projects/components/ProjectHub";
import { partnerById } from "@/features/partners/partners";
import {
  partnerProjectBySlug,
  partnerProjectParams,
} from "@/features/partners/partnerParams";

export const dynamicParams = false;

export function generateStaticParams() {
  return partnerProjectParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ agency: string; slug: string }>;
}): Promise<Metadata> {
  const { agency, slug } = await params;
  const partner = partnerById(agency);
  const project = partner ? partnerProjectBySlug(partner, slug) : undefined;
  if (!partner || !project) return {};
  return {
    title: `${project.name} · ${project.dev} | ${partner.name}`,
    description:
      project.about?.description ??
      `${project.name} by ${project.dev} in ${project.area}, ${project.city}.`,
  };
}

export default async function PartnerProjectOverviewPage({
  params,
}: {
  params: Promise<{ agency: string; slug: string }>;
}) {
  const { agency, slug } = await params;
  const partner = partnerById(agency);
  if (!partner) notFound();
  const project = partnerProjectBySlug(partner, slug);
  if (!project) notFound();

  return <ProjectHub project={project} partner={partner} />;
}
