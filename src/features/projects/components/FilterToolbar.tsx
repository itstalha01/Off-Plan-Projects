"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MAX_DOWN_PAYMENT,
  MAX_ENTRY_PRICE,
  MAX_MONTHLY,
  MIN_DOWN_PAYMENT,
  MIN_ENTRY_PRICE,
  MIN_MONTHLY,
} from "../constants/projects";
import { useFilteredProjects } from "../hooks/useFilteredProjects";
import { useFilterStore } from "../store/filterStore";
import { FilterControls } from "./FilterControls";

// Count of filters the user has moved off their default, so the mobile tab can show
// a badge. Budget bounds count as one each per active edge.
function useActiveFilterCount() {
  return useFilterStore((s) => {
    let n = 0;
    if (s.search.trim()) n++;
    if (s.city) n++;
    if (s.area) n++;
    if (s.type) n++;
    if (s.config) n++;
    if (s.possession) n++;
    if (s.approvedOnly) n++;
    if (s.minEntryPrice > MIN_ENTRY_PRICE || s.maxEntryPrice < MAX_ENTRY_PRICE)
      n++;
    if (s.minDownPayment > MIN_DOWN_PAYMENT || s.maxDownPayment < MAX_DOWN_PAYMENT)
      n++;
    if (s.minMonthly > MIN_MONTHLY || s.maxMonthly < MAX_MONTHLY) n++;
    return n;
  });
}

export function FilterToolbar() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolledPast, setScrolledPast] = useState(false);
  const activeCount = useActiveFilterCount();
  const count = useFilteredProjects().length;

  // Show the floating tab once the inline toolbar has scrolled out of view. A 1px
  // sentinel placed right below the toolbar flips this the moment its bottom edge
  // leaves the top of the viewport.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolledPast(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div
        id="areas"
        className="z-30 border-b border-ink/10 bg-cream/95 backdrop-blur-md sm:sticky sm:top-16"
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-4 sm:px-8">
          <FilterControls />
        </div>
      </div>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      {/* Mobile-only sticky top filter bar + full-screen filter panel (Zillow-style).
          Hidden on sm+ where the toolbar is sticky and always reachable. */}
      <Dialog.Root>
        <div
          className={cn(
            "fixed inset-x-0 top-16 z-30 border-b border-ink/10 bg-cream/95 px-5 py-3 backdrop-blur-md transition-all duration-300 ease-out sm:hidden",
            scrolledPast
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-full opacity-0"
          )}
        >
          <Dialog.Trigger
            aria-label="Open filters"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 bg-paper px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-ink/30"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-ink">
                {activeCount}
              </span>
            )}
          </Dialog.Trigger>
        </div>

        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <Dialog.Popup className="fixed inset-0 z-50 flex flex-col bg-cream outline-none data-open:animate-in data-open:slide-in-from-top data-closed:animate-out data-closed:slide-out-to-top">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <Dialog.Title className="font-serif text-lg font-semibold text-ink">
                Filters
              </Dialog.Title>
              <Dialog.Close
                aria-label="Close filters"
                className="flex size-9 items-center justify-center rounded-lg text-brown transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterControls inlineBudget />
            </div>

            <div className="border-t border-ink/10 px-5 py-4">
              <Dialog.Close className="w-full rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep hover:text-paper">
                {count === 0
                  ? "No projects match"
                  : `Show ${count} project${count === 1 ? "" : "s"}`}
              </Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
