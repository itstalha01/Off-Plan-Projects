import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDeveloper } from "@/features/projects/components/ProjectDeveloper";
import { ProjectSection } from "@/features/projects/components/ProjectSection";
import { projectBySlug } from "@/features/projects/constants/projects";
import {
  hasSection,
  sectionMetadata,
} from "@/features/projects/constants/sections";
import { sectionStaticParams } from "@/features/projects/constants/sectionParams";

export const dynamicParams = false;

export function generateStaticParams() {
  return sectionStaticParams("developer");
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]/developer">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  return project ? sectionMetadata(project, "developer") : {};
}

export default async function DeveloperPage({
  params,
}: PageProps<"/projects/[slug]/developer">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project || !hasSection(project, "developer")) notFound();

  return (
    <ProjectSection title="About the developer">
      <ProjectDeveloper project={project} />
    </ProjectSection>
  );
}
