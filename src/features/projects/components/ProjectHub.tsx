import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { slugOf, typesOf } from "../constants/projects";
import {
  basePathFor,
  type Partner,
} from "@/features/partners/partners";
import { SECTION_META, sectionsOf } from "../constants/sections";
import type { Project } from "../types/project";
import { CURVE_ARTICLE_PATH } from "@/features/articles/curve-brands";

/** The project "hub": lets a visitor choose which section to explore. Each tile
 *  is a real link to that section's route. */
export function ProjectHub({
  project,
  partner,
}: {
  project: Project;
  partner?: Partner | null;
}) {
  const sections = sectionsOf(project);
  const base = `${basePathFor(partner)}/projects/${slugOf(project)}`;

  return (
    <section className="py-8">
      <div className="mb-8 space-y-4 text-sm leading-7 text-brown">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          {project.name} in {project.area}, {project.city}
        </h2>
        <p>
          {project.name} is a {typesOf(project).join(" and ").toLowerCase()} project
          by {project.dev} in {project.area}, {project.city}. Expected possession
          is {project.poss}. Select a unit type below to compare sizes, prices
          and installments in the payment calculator.
        </p>
        {project.about?.description && <p>{project.about.description}</p>}
        {!partner && slugOf(project) === "curve-pine-avenue-downtown" && (
          <Link href={CURVE_ARTICLE_PATH} className="block rounded-xl border border-gold/40 bg-cream p-5 text-ink transition-colors hover:border-gold">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-deep">From the Journal</span>
            <span className="mt-2 block font-serif text-2xl">Five brands. One Curve.</span>
            <span className="mt-2 block text-sm">Explore the MOU lineup and the appeal of Pine Avenue →</span>
          </Link>
        )}
        {project.about?.highlights && project.about.highlights.length > 0 && (
          <ul className="list-disc space-y-1 pl-5">
            {project.about.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}
        <div>
          <h3 className="font-semibold text-ink">Available unit types</h3>
          <p className="mt-1 text-sm">
            Select a unit type to explore its sizes and payment plan.
          </p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {project.categories.map((category) => (
              <li key={`${category.group ?? ""}:${category.name}`}>
                <Link
                  href={{
                    pathname: `${base}/payment`,
                    query: {
                      category: category.name,
                      ...(category.group ? { group: category.group } : {}),
                    },
                  }}
                  className="group flex h-full flex-col rounded-xl border border-ink/10 bg-paper p-4 transition-colors hover:border-gold hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  {category.group && (
                    <span className="text-xs font-medium text-gold-deep">
                      {category.group}
                    </span>
                  )}
                  <span className="font-medium text-ink">{category.name}</span>
                  <span className="block">
                    {Math.min(...category.sizes).toLocaleString("en-PK")}
                    {Math.max(...category.sizes) !== Math.min(...category.sizes) &&
                      `–${Math.max(...category.sizes).toLocaleString("en-PK")}`} sqft
                    {" · PKR "}{category.rate.toLocaleString("en-PK")} per sqft
                  </span>
                  <span className="mt-3 flex items-center gap-2 text-sm font-medium text-ink group-hover:text-gold-deep">
                    View sizes &amp; payment plan
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs leading-5">
          Listed prices and possession dates are indicative. Confirm current
          availability, charges and timelines before booking.
        </p>
      </div>
      <h2 className="font-serif text-2xl font-semibold text-ink">
        Explore this project
      </h2>
      <p className="mt-1.5 text-sm text-brown">
        Pick where you&apos;d like to start.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sections.map((key) => {
          const { segment, title, blurb, Icon, iconClass } = SECTION_META[key];
          const featured = key === "payment";
          return (
            <Link
              key={key}
              href={`${base}/${segment}`}
              className={cn(
                "group flex items-center gap-3 rounded-xl border bg-paper p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-18px_rgba(19,17,13,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                featured
                  ? "border-gold/60 hover:border-gold"
                  : "border-ink/10 hover:border-gold/40"
              )}
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-cream">
                <Icon className={cn("size-5", iconClass)} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">
                  {title}
                </span>
                <span className="mt-0.5 block text-xs text-brown">{blurb}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-brown/60 transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>

    </section>
  );
}
