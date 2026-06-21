import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaymentCalculator } from "@/features/projects/components/PaymentModal";
import { ProjectSection } from "@/features/projects/components/ProjectSection";
import { projectBySlug } from "@/features/projects/constants/projects";
import {
  hasSection,
  sectionMetadata,
} from "@/features/projects/constants/sections";
import { sectionStaticParams } from "@/features/projects/constants/sectionParams";

export const dynamicParams = false;

export function generateStaticParams() {
  return sectionStaticParams("payment");
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]/payment">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  return project ? sectionMetadata(project, "payment") : {};
}

export default async function PaymentPage({
  params,
}: PageProps<"/projects/[slug]/payment">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project || !hasSection(project, "payment")) notFound();

  return (
    <ProjectSection title="Payment plan">
      <PaymentCalculator project={project} />
    </ProjectSection>
  );
}
