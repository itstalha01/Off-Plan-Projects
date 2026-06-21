import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectFloorPlans } from "@/features/projects/components/ProjectFloorPlans";
import { ProjectSection } from "@/features/projects/components/ProjectSection";
import { projectBySlug } from "@/features/projects/constants/projects";
import {
  hasSection,
  sectionMetadata,
} from "@/features/projects/constants/sections";
import { sectionStaticParams } from "@/features/projects/constants/sectionParams";

export const dynamicParams = false;

export function generateStaticParams() {
  return sectionStaticParams("floor-plans");
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]/floor-plans">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  return project ? sectionMetadata(project, "floor-plans") : {};
}

export default async function FloorPlansPage({
  params,
}: PageProps<"/projects/[slug]/floor-plans">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project || !hasSection(project, "floor-plans")) notFound();

  return (
    <ProjectSection title="Floor plans">
      <ProjectFloorPlans project={project} />
    </ProjectSection>
  );
}
