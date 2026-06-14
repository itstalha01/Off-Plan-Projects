"use client";

import { memo } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMillionsCr } from "@/lib/format";
import {
  DEFAULT_PROJECT_IMG,
  entryPriceMillions,
  entrySize,
  POSSESSION_YEARS,
  typesOf,
} from "../constants/projects";
import type { LdaStatus, Project } from "../types/project";

const LDA_BADGE: Record<LdaStatus, { label: string; className: string }> = {
  Approved: {
    label: "Approved",
    className: "bg-emerald-600 text-white ring-white/20 shadow-sm",
  },
  Pending: {
    label: "Pending",
    className: "bg-amber-500 text-ink ring-white/30 shadow-sm",
  },
  Verify: {
    label: "Verify",
    className: "bg-ink/80 text-paper ring-white/20 shadow-sm",
  },
};

const MIN_YEAR = Number(POSSESSION_YEARS[0]);
const MAX_YEAR = Number(POSSESSION_YEARS[POSSESSION_YEARS.length - 1]);

/** Closer possession year => fuller bar. Floored at 25% so the furthest still reads. */
function possessionProgress(poss: string): number {
  if (MAX_YEAR === MIN_YEAR) return 1;
  const ratio = (MAX_YEAR - Number(poss)) / (MAX_YEAR - MIN_YEAR);
  return 0.25 + 0.75 * ratio;
}

type ProjectCardProps = {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
};

function ProjectCardBase({ project, index, onOpen }: ProjectCardProps) {
  const badge = LDA_BADGE[project.lda];
  const progress = possessionProgress(project.poss);

  return (
    <article
      className="animate-fade-up group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_18px_40px_-20px_rgba(19,17,13,0.35)]"
      style={{ animationDelay: `${Math.min(index, 12) * 55}ms` }}
    >
      {/* Cover photo — zooms on hover, click opens the payment plan */}
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`View payment plan for ${project.name}`}
        className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      >
        <Image
          src={project.img ?? DEFAULT_PROJECT_IMG}
          alt={`${project.name} by ${project.dev}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset backdrop-blur-sm",
            badge.className
          )}
        >
          {badge.label}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-6">
        <div>
          <h3 className="font-serif text-xl font-semibold leading-snug text-ink">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-brown">{project.dev}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-brown">
            {project.area}
          </span>
          {typesOf(project).map((t) => (
            <span
              key={t}
              className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-brown"
            >
              {t}
            </span>
          ))}
        </div>

      <div className="mt-5">
        <p className="font-serif text-2xl font-semibold tracking-tight text-ink">
          <span className="align-middle text-xs font-medium uppercase tracking-wide text-brown">
            from{" "}
          </span>
          {formatMillionsCr(entryPriceMillions(project))}
        </p>
        <p className="mt-1.5 text-xs font-medium text-brown">
          starting from {entrySize(project).toLocaleString()} sqft · Possession{" "}
          {project.poss}
          {project.categories.length > 1 &&
            ` · ${project.categories.length} layout options`}
        </p>
      </div>

      <div className="mt-5">
        <div className="h-1 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-gold"
            style={{ width: `${(progress * 100).toFixed(0)}%` }}
          />
        </div>
      </div>

        <button
          type="button"
          onClick={() => onOpen(project)}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-gold-deep"
        >
          View payment plan
          <ArrowRight className="size-4" />
        </button>
      </div>
    </article>
  );
}

export const ProjectCard = memo(ProjectCardBase);
