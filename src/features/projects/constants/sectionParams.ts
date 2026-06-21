// Server-only: pulls in the full PROJECTS dataset, so it must never be imported
// from a Client Component. Used by the section routes' `generateStaticParams`.
import { PROJECTS, slugOf } from "./projects";
import { hasSection, type SectionKey } from "./sections";

/** Slugs to prerender for a section's route — only projects that have it. */
export function sectionStaticParams(key: SectionKey): { slug: string }[] {
  return PROJECTS.filter((p) => hasSection(p, key)).map((p) => ({
    slug: slugOf(p),
  }));
}
