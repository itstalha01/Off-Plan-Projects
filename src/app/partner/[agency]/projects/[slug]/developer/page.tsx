import { notFound } from "next/navigation";
import { ProjectDeveloper } from "@/features/projects/components/ProjectDeveloper";
import { ProjectSection } from "@/features/projects/components/ProjectSection";
import { hasSection } from "@/features/projects/constants/sections";
import { partnerById } from "@/features/partners/partners";
import {
  partnerProjectBySlug,
  partnerSectionParams,
} from "@/features/partners/partnerParams";

export const dynamicParams = false;

export function generateStaticParams() {
  return partnerSectionParams("developer");
}

export default async function PartnerDeveloperPage({
  params,
}: {
  params: Promise<{ agency: string; slug: string }>;
}) {
  const { agency, slug } = await params;
  const partner = partnerById(agency);
  if (!partner) notFound();
  const project = partnerProjectBySlug(partner, slug);
  if (!project || !hasSection(project, "developer")) notFound();

  return (
    <ProjectSection title="About the developer">
      <ProjectDeveloper project={project} />
    </ProjectSection>
  );
}
