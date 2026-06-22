"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { basePathFor } from "@/features/partners/partners";
import { usePartner } from "@/features/partners/usePartner";
import { SECTION_META, type SectionKey } from "../constants/sections";

/** Sticky tab bar for jumping between a project's sections. The active tab is
 *  derived from the current route, so it stays in sync on back/forward too. */
export function ProjectTabs({
  slug,
  sections,
}: {
  slug: string;
  sections: SectionKey[];
}) {
  const pathname = usePathname();
  const partner = usePartner();
  const base = `${basePathFor(partner)}/projects/${slug}`;

  const tabs = [
    { href: base, label: "Overview" },
    ...sections.map((key) => ({
      href: `${base}/${SECTION_META[key].segment}`,
      label: SECTION_META[key].tab,
    })),
  ];

  return (
    <nav className="sticky top-16 z-30 mt-8 border-y border-ink/10 bg-paper/90 backdrop-blur-md">
      {/* Right-edge fade hints that the row scrolls horizontally on narrow
          screens, replacing the clipped-tab look and the native scrollbar. */}
      <div className="relative mx-auto w-full max-w-4xl">
        <div className="flex gap-1 overflow-x-auto px-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative whitespace-nowrap px-3 py-3.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                active ? "text-ink" : "text-brown hover:text-ink"
              )}
            >
              {tab.label}
              {active && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-paper to-transparent sm:hidden"
        />
      </div>
    </nav>
  );
}
