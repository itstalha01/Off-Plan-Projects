import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectDeveloper } from "@/features/projects/components/ProjectDeveloper";
import { ProjectSection } from "@/features/projects/components/ProjectSection";
import {
  PROJECTS,
  projectBySlug,
  slugOf,
} from "@/features/projects/constants/projects";
import { sectionMetadata } from "@/features/projects/constants/sections";
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
  if (!project?.developer) notFound();

  const otherProjects = PROJECTS.filter(
    (other) => other !== project && other.dev === project.dev
  );

  return (
    <ProjectSection title={`Who is developing ${project.name}?`}>
      <p className="mb-5 text-sm leading-relaxed text-brown sm:text-base">
        {project.developer.name} is the developer listed for{" "}
        <Link href={`/projects/${slug}`} className="underline underline-offset-4">
          {project.name}
        </Link>
        {" "}in {project.area}, {project.city}. The project overview lists the unit
        types and expected possession date.
      </p>
      <ProjectDeveloper project={project} />
      {otherProjects.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-ink">
            More listings by {project.developer.name}
          </h3>
          <ul className="mt-2 space-y-2 text-sm text-brown">
            {otherProjects.map((other) => (
              <li key={other.name}>
                <Link href={`/projects/${slugOf(other)}`} className="underline underline-offset-4">
                  {other.name}
                </Link>
                {" "}in {other.area}, {other.city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </ProjectSection>
  );
}
