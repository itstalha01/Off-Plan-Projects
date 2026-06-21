import { notFound } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { ProjectBreadcrumbs } from "@/features/projects/components/ProjectBreadcrumbs";
import { ProjectHero } from "@/features/projects/components/ProjectHero";
import { ProjectTabs } from "@/features/projects/components/ProjectTabs";
import { RelatedProjects } from "@/features/projects/components/RelatedProjects";
import {
  projectBySlug,
  relatedProjects,
} from "@/features/projects/constants/projects";
import { sectionsOf } from "@/features/projects/constants/sections";

export default async function ProjectLayout({
  children,
  params,
}: LayoutProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-5 pt-6 sm:px-8 sm:pt-8">
          <ProjectBreadcrumbs
            slug={slug}
            projectName={project.name}
            sections={sectionsOf(project)}
          />
        </div>
        <ProjectHero project={project} />
        <ProjectTabs slug={slug} sections={sectionsOf(project)} />
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">{children}</div>
        <RelatedProjects projects={relatedProjects(project)} />
      </main>
      <SiteFooter />
    </>
  );
}
