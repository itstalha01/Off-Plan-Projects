// Server-only: resolves a partner's visible projects from the full dataset, so
// it must never be imported from a Client Component. Used by the partner routes'
// `generateStaticParams` and to scope project lookups to a partner.
import {
  PROJECTS,
  projectBySlug,
  slugOf,
} from "@/features/projects/constants/projects";
import { hasSection, type SectionKey } from "@/features/projects/constants/sections";
import { isAllowedSlug, PARTNERS, type Partner } from "./partners";

/** The projects a partner may show, in the catalogue's natural order. */
export function allowedProjects(partner: Partner): typeof PROJECTS {
  return PROJECTS.filter((p) => isAllowedSlug(partner, slugOf(p)));
}

/** Resolve a slug to a project only if the partner is allowed to show it. */
export function partnerProjectBySlug(partner: Partner, slug: string) {
  return isAllowedSlug(partner, slug) ? projectBySlug(slug) : undefined;
}

/** `{ agency }` params for every partner — the catalogue routes. */
export function partnerStaticParams(): { agency: string }[] {
  return Object.values(PARTNERS).map((p) => ({ agency: p.id }));
}

/** `{ agency, slug }` for every partner × their visible projects. */
export function partnerProjectParams(): { agency: string; slug: string }[] {
  return Object.values(PARTNERS).flatMap((p) =>
    allowedProjects(p).map((pr) => ({ agency: p.id, slug: slugOf(pr) }))
  );
}

/** Like `partnerProjectParams`, but only projects that have the given section. */
export function partnerSectionParams(
  key: SectionKey
): { agency: string; slug: string }[] {
  return Object.values(PARTNERS).flatMap((p) =>
    allowedProjects(p)
      .filter((pr) => hasSection(pr, key))
      .map((pr) => ({ agency: p.id, slug: slugOf(pr) }))
  );
}
