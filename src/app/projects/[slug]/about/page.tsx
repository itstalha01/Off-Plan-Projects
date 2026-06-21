import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectAbout } from "@/features/projects/components/ProjectAbout";
import { ProjectSection } from "@/features/projects/components/ProjectSection";
import { projectBySlug } from "@/features/projects/constants/projects";
import {
  hasSection,
  sectionMetadata,
} from "@/features/projects/constants/sections";
import { sectionStaticParams } from "@/features/projects/constants/sectionParams";

export const dynamicParams = false;

export function generateStaticParams() {
  return sectionStaticParams("about");
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]/about">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  return project ? sectionMetadata(project, "about") : {};
}

export default async function AboutPage({
  params,
}: PageProps<"/projects/[slug]/about">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project || !hasSection(project, "about")) notFound();

  return (
    <ProjectSection title="About the project">
      <ProjectAbout project={project} />
    </ProjectSection>
  );
}
