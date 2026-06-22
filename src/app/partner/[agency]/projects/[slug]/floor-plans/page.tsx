import { notFound } from "next/navigation";
import { ProjectFloorPlans } from "@/features/projects/components/ProjectFloorPlans";
import { ProjectSection } from "@/features/projects/components/ProjectSection";
import { hasSection } from "@/features/projects/constants/sections";
import { partnerById } from "@/features/partners/partners";
import {
  partnerProjectBySlug,
  partnerSectionParams,
} from "@/features/partners/partnerParams";

export const dynamicParams = false;

export function generateStaticParams() {
  return partnerSectionParams("floor-plans");
}

export default async function PartnerFloorPlansPage({
  params,
}: {
  params: Promise<{ agency: string; slug: string }>;
}) {
  const { agency, slug } = await params;
  const partner = partnerById(agency);
  if (!partner) notFound();
  const project = partnerProjectBySlug(partner, slug);
  if (!project || !hasSection(project, "floor-plans")) notFound();

  return (
    <ProjectSection title="Floor plans">
      <ProjectFloorPlans project={project} />
    </ProjectSection>
  );
}
