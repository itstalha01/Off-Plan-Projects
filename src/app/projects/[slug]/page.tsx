import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectHub } from "@/features/projects/components/ProjectHub";
import {
  PROJECT_SLUGS,
  projectBySlug,
} from "@/features/projects/constants/projects";

// Every project is known at build time — prerender each overview, and 404 any
// slug that isn't one of them rather than rendering on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  const title = `${project.name} · ${project.dev} | Clearstoreys`;
  const description =
    project.about?.description ??
    `${project.name} by ${project.dev} in ${project.area}, ${project.city}. Payment plan, possession timeline and approval status on Clearstoreys.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.img ? [{ url: project.img }] : undefined,
    },
  };
}

export default async function ProjectOverviewPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  return <ProjectHub project={project} />;
}
