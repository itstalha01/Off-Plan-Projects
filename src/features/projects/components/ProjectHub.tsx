import Link from "next/link";
import { ChevronRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { slugOf } from "../constants/projects";
import {
  basePathFor,
  brandName,
  type Partner,
} from "@/features/partners/partners";
import { SECTION_META, sectionsOf } from "../constants/sections";
import type { Project } from "../types/project";

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
  const brand = brandName(partner);

  return (
    <section className="py-8">
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

      <a
        href={whatsappLink(
          `Hi ${brand}, I'd like more information about ${project.name} (${project.dev}, ${project.area}).`,
          partner?.whatsapp
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep hover:text-paper"
      >
        <MessageCircle className="size-4" />
        Enquire on WhatsApp
      </a>
    </section>
  );
}
