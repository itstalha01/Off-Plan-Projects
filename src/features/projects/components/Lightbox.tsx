"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";

export type LightboxItem = { src: string; label?: string };

/** Fullscreen image viewer with backdrop-to-close, download, and — when given
 *  more than one item — prev/next navigation (arrow keys too). Shared by the
 *  gallery and floor-plan sections. */
export function Lightbox({
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
