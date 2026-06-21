import {
  Building2,
  Calculator,
  Info,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "../types/project";

/**
 * The explorable sections of a project, each its own route under
 * `/projects/[slug]/<segment>`. The overview ("hub") page isn't listed here —
 * it's the index that lets a visitor choose one of these.
 */
export type SectionKey = "about" | "developer" | "floor-plans" | "payment";

type SectionMeta = {
  segment: string; // URL segment under the project
  tab: string; // short label for the tab bar
  title: string; // page heading / full label
  blurb: string; // one-line description on the hub tile
  Icon: LucideIcon;
  iconClass: string;
};

export const SECTION_META: Record<SectionKey, SectionMeta> = {
  about: {
    segment: "about",
    tab: "About",
    title: "About the project",
    blurb: "Renders, description and highlights",
    Icon: Info,
    iconClass: "text-emerald-700",
  },
  developer: {
    segment: "developer",
    tab: "Developer",
    title: "About the developer",
    blurb: "Track record and credentials",
    Icon: Building2,
    iconClass: "text-[#534AB7]",
  },
  "floor-plans": {
    segment: "floor-plans",
    tab: "Floor plans",
    title: "Floor plans",
    blurb: "Layouts you can open and enlarge",
    Icon: LayoutGrid,
    iconClass: "text-gold-deep",
  },
  payment: {
    segment: "payment",
    tab: "Payment",
    title: "Payment plan",
    blurb: "Build and export your own plan",
    Icon: Calculator,
    iconClass: "text-gold-deep",
  },
};

// Canonical order sections appear in (tabs, hub tiles).
export const SECTION_ORDER: SectionKey[] = [
  "about",
  "developer",
  "floor-plans",
  "payment",
];

/** Whether a project has the content backing a given section. */
export function hasSection(p: Project, key: SectionKey): boolean {
  switch (key) {
    case "about":
      return !!p.about;
    case "developer":
      return !!p.developer;
    case "floor-plans":
      return !!(p.floorPlans && p.floorPlans.length > 0);
    case "payment":
      return true; // every project has a payment plan
  }
}

/** The sections a project actually offers, in canonical order. */
export function sectionsOf(p: Project): SectionKey[] {
  return SECTION_ORDER.filter((key) => hasSection(p, key));
}

/** Per-section page metadata (title + description) for `generateMetadata`. */
export function sectionMetadata(p: Project, key: SectionKey) {
  const m = SECTION_META[key];
  return {
    title: `${m.title} · ${p.name} | Clearstoreys`,
    description: `${m.title} for ${p.name} by ${p.dev} — ${p.area}, ${p.city}. ${m.blurb}.`,
  };
}
