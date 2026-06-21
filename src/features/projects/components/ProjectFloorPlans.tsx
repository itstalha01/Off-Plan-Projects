"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import type { Project } from "../types/project";
import { Lightbox } from "./Lightbox";

export function ProjectFloorPlans({ project }: { project: Project }) {
  const plans = project.floorPlans;
  const [zoom, setZoom] = useState<number | null>(null);

  if (!plans || plans.length === 0) return null;

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
                sizes="(max-width: 896px) 100vw, 448px"
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
