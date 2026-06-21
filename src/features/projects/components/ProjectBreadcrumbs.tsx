"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/constants";
import { SECTION_META, type SectionKey } from "../constants/sections";

type Crumb = { name: string; href: string };

/** Breadcrumb trail for project pages: Home › {Project} › {Section}. Renders the
 *  visible nav plus matching BreadcrumbList JSON-LD so search engines can show
 *  the hierarchy in results. The active section is derived from the route, so it
 *  stays correct across the section tabs and on back/forward. */
export function ProjectBreadcrumbs({
  slug,
  projectName,
  sections,
}: {
  slug: string;
  projectName: string;
  sections: SectionKey[];
}) {
  const pathname = usePathname();
  const base = `/projects/${slug}`;

  const segment = pathname.startsWith(`${base}/`)
    ? pathname.slice(base.length + 1)
    : "";
  const active = sections.find((k) => SECTION_META[k].segment === segment);

  const trail: Crumb[] = [
    { name: "Home", href: "/" },
    { name: projectName, href: base },
    ...(active
      ? [{ name: SECTION_META[active].title, href: `${base}/${segment}` }]
      : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.href === "/" ? "" : crumb.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-brown">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  aria-hidden
                  className="size-3.5 shrink-0 text-brown/40"
                />
              )}
              {last ? (
                <span aria-current="page" className="font-medium text-ink">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="rounded-sm transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
