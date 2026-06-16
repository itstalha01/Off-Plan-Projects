"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  LayoutGrid,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DEFAULT_PROJECT_IMG } from "../constants/projects";
import type { Project } from "../types/project";
import { PaymentCalculator } from "./PaymentModal";

export type DetailPanel =
  | "hub"
  | "developer"
  | "about"
  | "floorPlans"
  | "payment";

const PANEL_META: Record<
  Exclude<DetailPanel, "hub">,
  { title: string; Icon: typeof Building2 }
> = {
  developer: { title: "About the developer", Icon: Building2 },
  about: { title: "About the project", Icon: Info },
  floorPlans: { title: "Floor plans", Icon: LayoutGrid },
  payment: { title: "Payment plan", Icon: Calculator },
};

type ProjectDetailModalProps = {
  project: Project | null;
  initialPanel?: DetailPanel;
  onClose: () => void;
};

export function ProjectDetailModal({
  project,
  initialPanel = "hub",
  onClose,
}: ProjectDetailModalProps) {
  const [panel, setPanel] = useState<DetailPanel>(initialPanel);

  // Re-sync the active panel whenever a new project is opened (or the same
  // project is opened straight into a different panel, e.g. "View payment plan").
  // Adjusting state during render — React's recommended alternative to an effect.
  const [prev, setPrev] = useState({ project, initialPanel });
  if (prev.project !== project || prev.initialPanel !== initialPanel) {
    setPrev({ project, initialPanel });
    setPanel(initialPanel);
  }

  return (
    <Dialog
      open={!!project}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {project && (
        <DialogContent
          aria-modal
          showCloseButton={false}
          className="max-w-2xl gap-0 overflow-hidden p-0 sm:max-w-2xl"
        >
          <DetailHeader
            project={project}
            panel={panel}
            onBack={() => setPanel("hub")}
            onClose={onClose}
          />
          <div className="max-h-[78vh] overflow-y-auto">
            {panel === "hub" ? (
              <HubPanel project={project} onSelect={setPanel} />
            ) : (
              <div className="p-5">
                {panel === "developer" && <DeveloperPanel project={project} />}
                {panel === "about" && <AboutPanel project={project} />}
                {panel === "floorPlans" && <FloorPlansPanel project={project} />}
                {panel === "payment" && <PaymentCalculator project={project} />}
              </div>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

function DetailHeader({
  project,
  panel,
  onBack,
  onClose,
}: {
  project: Project;
  panel: DetailPanel;
  onBack: () => void;
  onClose: () => void;
}) {
  const isHub = panel === "hub";
  return (
    <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
      {isHub ? (
        <div className="min-w-0 flex-1">
          <DialogTitle className="truncate font-serif text-lg font-semibold text-ink">
            {project.name}
          </DialogTitle>
          <DialogDescription className="truncate text-xs text-brown">
            {project.dev} · {project.area}
          </DialogDescription>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink transition-colors hover:bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate font-serif text-base font-semibold text-ink">
              {PANEL_META[panel].title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {project.name} — {PANEL_META[panel].title}
            </DialogDescription>
          </div>
        </>
      )}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="inline-flex size-9 items-center justify-center rounded-full text-brown transition-colors hover:bg-cream hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

const HUB_ITEMS: {
  panel: Exclude<DetailPanel, "hub">;
  label: string;
  Icon: typeof Building2;
  iconClass: string;
  featured?: boolean;
}[] = [
  {
    panel: "developer",
    label: "About the developer",
    Icon: Building2,
    iconClass: "text-[#534AB7]",
  },
  {
    panel: "about",
    label: "About the project",
    Icon: Info,
    iconClass: "text-emerald-700",
  },
  {
    panel: "floorPlans",
    label: "View floor plans",
    Icon: LayoutGrid,
    iconClass: "text-gold-deep",
  },
  {
    panel: "payment",
    label: "View payment plan",
    Icon: Calculator,
    iconClass: "text-gold-deep",
    featured: true,
  },
];

function HubPanel({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (panel: DetailPanel) => void;
}) {
  return (
    <div>
      <div className="relative aspect-[16/9] w-full bg-cream">
        <Image
          src={project.img ?? DEFAULT_PROJECT_IMG}
          alt={`${project.name} by ${project.dev}`}
          fill
          sizes="(max-width: 640px) 100vw, 672px"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {HUB_ITEMS.map(({ panel, label, Icon, iconClass, featured }) => (
            <button
              key={panel}
              type="button"
              onClick={() => onSelect(panel)}
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
              <span className="min-w-0 flex-1 text-sm font-medium text-ink">
                {label}
              </span>
              <ChevronRight className="size-4 shrink-0 text-brown/60 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/15 bg-cream/40 py-14 text-center">
      <Sparkles className="size-7 text-brown/50" />
      <h4 className="mt-3 font-serif text-lg font-semibold text-ink">
        {label} coming soon
      </h4>
      <p className="mt-1 max-w-xs text-sm text-brown">
        We&apos;re putting these details together. Contact your advisor for the
        latest information in the meantime.
      </p>
    </div>
  );
}

function DeveloperPanel({ project }: { project: Project }) {
  const dev = project.developer;
  if (!dev) return <ComingSoon label="Developer details" />;
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-serif text-xl font-semibold text-ink">{dev.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-brown">{dev.blurb}</p>
      </div>

      {dev.stats && dev.stats.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {dev.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-cream p-3 text-center"
            >
              <p className="font-serif text-lg font-semibold text-ink">
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] font-medium leading-tight text-brown">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {dev.trackRecord && dev.trackRecord.length > 0 && (
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brown">
            Track record
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {dev.trackRecord.map((p) => (
              <span
                key={p}
                className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-brown"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type LightboxItem = { src: string; label?: string };

/** Fullscreen image viewer with backdrop-to-close, download, and — when given
 *  more than one item — prev/next navigation (arrow keys too). Shared by the
 *  gallery and floor-plan panels. */
function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const many = items.length > 1;
  const go = (delta: number) =>
    onIndex((index + delta + items.length) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && many) go(-1);
      else if (e.key === "ArrowRight" && many) go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length]);

  const item = items[index];

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-ink/90 p-4"
      onClick={onClose}
    >
      <div className="flex items-center justify-between text-paper">
        <span className="text-sm font-medium">
          {item.label}
          {many && (
            <span className="ml-2 text-paper/60">
              {index + 1} / {items.length}
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <a
            href={item.src}
            download
            onClick={(e) => e.stopPropagation()}
            aria-label="Download image"
            className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            <Download className="size-5" />
          </a>
          <button
            type="button"
            aria-label="Close"
            className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
      <div className="relative mt-3 flex-1" onClick={(e) => e.stopPropagation()}>
        <Image
          src={item.src}
          alt={item.label ?? ""}
          fill
          sizes="100vw"
          className="object-contain"
        />
        {many && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-paper transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-paper transition-colors hover:bg-white/20"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AboutPanel({ project }: { project: Project }) {
  const about = project.about;
  const gallery = project.gallery;
  const [zoom, setZoom] = useState<number | null>(null);
  if (!about) return <ComingSoon label="Project details" />;
  return (
    <div className="flex flex-col gap-5">
      {gallery && gallery.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setZoom(i)}
              className={cn(
                "group relative aspect-[4/3] overflow-hidden rounded-xl bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                i === 0 && "col-span-2 aspect-[16/9]"
              )}
            >
              <Image
                src={src}
                alt={`${project.name} render ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-ink/70 text-paper opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="size-4" />
              </span>
            </button>
          ))}
        </div>
      )}

      {gallery && gallery.length > 0 && zoom !== null && (
        <Lightbox
          items={gallery.map((src) => ({ src, label: project.name }))}
          index={zoom}
          onIndex={setZoom}
          onClose={() => setZoom(null)}
        />
      )}

      <p className="text-sm leading-relaxed text-brown">{about.description}</p>

      {about.highlights && about.highlights.length > 0 && (
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brown">
            Highlights
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {about.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-brown"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.brochureUrl && (
        <a
          href={project.brochureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-medium text-ink transition-colors hover:bg-cream sm:w-auto"
        >
          <Download className="size-4" />
          Download official brochure (PDF)
        </a>
      )}
    </div>
  );
}

function FloorPlansPanel({ project }: { project: Project }) {
  const plans = project.floorPlans;
  const [zoom, setZoom] = useState<number | null>(null);

  if (!plans || plans.length === 0)
    return <ComingSoon label="Floor plans" />;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-brown">Tap a layout to enlarge.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {plans.map((fp, i) => (
          <button
            key={fp.label}
            type="button"
            onClick={() => setZoom(i)}
            className="group overflow-hidden rounded-xl border border-ink/10 bg-white text-left transition-all hover:border-gold/40 hover:shadow-[0_12px_28px_-18px_rgba(19,17,13,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <div className="relative aspect-[4/3] w-full bg-white">
              <Image
                src={fp.img}
                alt={fp.label}
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-contain p-2"
              />
              <span className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-ink/70 text-paper opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="size-4" />
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-ink/10 px-3 py-2.5">
              <span className="text-sm font-medium text-ink">{fp.label}</span>
              <ZoomIn className="size-4 text-brown/60" />
            </div>
          </button>
        ))}
      </div>

      {zoom !== null && (
        <Lightbox
          items={plans.map((fp) => ({ src: fp.img, label: fp.label }))}
          index={zoom}
          onIndex={setZoom}
          onClose={() => setZoom(null)}
        />
      )}
    </div>
  );
}
