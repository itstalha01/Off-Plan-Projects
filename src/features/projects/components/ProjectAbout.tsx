"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "../types/project";
import { Lightbox } from "./Lightbox";

export function ProjectAbout({ project }: { project: Project }) {
  const about = project.about;
  const gallery = project.gallery;
  const [zoom, setZoom] = useState<number | null>(null);

  if (!about) return null;

  return (
    <div className="flex flex-col gap-6">
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
                sizes="(max-width: 896px) 100vw, 896px"
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

      <p className="text-sm leading-relaxed text-brown sm:text-base">
        {about.description}
      </p>

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
