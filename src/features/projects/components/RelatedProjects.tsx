import Image from "next/image";
import Link from "next/link";
import { formatMillionsCr } from "@/lib/format";
import {
  DEFAULT_PROJECT_IMG,
  entryPriceMillions,
  slugOf,
} from "../constants/projects";
import {
  basePathFor,
  isAllowedSlug,
  type Partner,
} from "@/features/partners/partners";
import type { Project } from "../types/project";

/** A compact rail of related projects (same developer / area) shown at the foot
 *  of every project page. Each tile is a single contextual link to that
 *  project's hub — spreading internal links beyond the homepage and building
 *  topical clusters around developer and area. */
export function RelatedProjects({
  projects,
  partner,
}: {
  projects: Project[];
  partner?: Partner | null;
}) {
  // A partner never links out to projects they don't carry.
  const shown = partner
    ? projects.filter((p) => isAllowedSlug(partner, slugOf(p)))
    : projects;
  if (shown.length === 0) return null;
  const bp = basePathFor(partner);

  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8">
      <h2 className="font-serif text-2xl font-semibold text-ink">
        Related projects
      </h2>
      <p className="mt-1.5 text-sm text-brown">
        More from the same developer and area.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {shown.map((p) => (
          <Link
            key={p.name}
            href={`${bp}/projects/${slugOf(p)}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-paper transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_12px_28px_-18px_rgba(19,17,13,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
              <Image
                src={p.img ?? DEFAULT_PROJECT_IMG}
                alt={`${p.name} by ${p.dev}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 280px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-serif text-base font-semibold leading-snug text-ink">
                {p.name}
              </h3>
              <p className="mt-0.5 text-xs text-brown">
                {p.dev} · {p.area}
              </p>
              <p className="mt-2 font-serif text-sm font-semibold text-ink">
                <span className="text-[11px] font-medium uppercase tracking-wide text-brown">
                  from{" "}
                </span>
                {formatMillionsCr(entryPriceMillions(p))}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
