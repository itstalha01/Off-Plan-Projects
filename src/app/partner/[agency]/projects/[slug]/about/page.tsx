import { notFound } from "next/navigation";
import { ProjectAbout } from "@/features/projects/components/ProjectAbout";
import { ProjectSection } from "@/features/projects/components/ProjectSection";
import { hasSection } from "@/features/projects/constants/sections";
import { partnerById } from "@/features/partners/partners";
import {
  partnerProjectBySlug,
  partnerSectionParams,
} from "@/features/partners/partnerParams";

export const dynamicParams = false;

export function generateStaticParams() {
  return partnerSectionParams("about");
}

export default async function PartnerAboutPage({
  params,
}: {
  params: Promise<{ agency: string; slug: string }>;
}) {
  const { agency, slug } = await params;
  const partner = partnerById(agency);
  if (!partner) notFound();
  const project = partnerProjectBySlug(partner, slug);
  if (!project || !hasSection(project, "about")) notFound();

  return (
    <ProjectSection title="About the project">
      <ProjectAbout project={project} />
    </ProjectSection>
  );
}
