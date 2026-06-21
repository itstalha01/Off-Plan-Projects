import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatMillionsCr } from "@/lib/format";
import {
  DEFAULT_PROJECT_IMG,
  entryPriceMillions,
  entrySize,
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

/** Persistent project banner shown above the tab bar on every project page. */
export function ProjectHero({ project }: { project: Project }) {
  const badge = LDA_BADGE[project.lda];
  const entryMillions = entryPriceMillions(project);
  const entrySqft = entrySize(project);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 pt-4 sm:px-8">
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-cream">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={project.img ?? DEFAULT_PROJECT_IMG}
            alt={`${project.name} by ${project.dev}`}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
          <span
            className={cn(
              "absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset backdrop-blur-sm",
              badge.className
            )}
          >
            {badge.label}
          </span>
        </div>
      </div>

      <header className="mt-6">
        <h1 className="font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {project.name}
        </h1>
        <p className="mt-1.5 text-brown">
          {project.dev} · {project.area}, {project.city}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {typesOf(project).map((t) => (
            <span
              key={t}
              className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-brown"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Fact
          label="From"
          value={formatMillionsCr(entryMillions)}
          sub={`${entrySqft.toLocaleString()} sqft`}
        />
        <Fact label="Possession" value={project.poss} />
        <Fact
          label="Layouts"
          value={`${project.categories.length}`}
          sub={project.categories.length === 1 ? "option" : "options"}
        />
        <Fact label="Approval" value={badge.label} />
      </dl>
    </div>
  );
}

function Fact({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper p-4">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brown">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-xl font-semibold text-ink">{value}</dd>
      {sub && <p className="mt-0.5 text-xs text-brown">{sub}</p>}
    </div>
  );
}
