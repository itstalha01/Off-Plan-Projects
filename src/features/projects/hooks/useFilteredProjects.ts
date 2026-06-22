import { useMemo } from "react";
import {
  configsOf,
  lowestTotal,
  matchesBudget,
  PROJECTS,
  searchText,
  slugOf,
  typesOf,
} from "../constants/projects";
import { isAllowedSlug } from "@/features/partners/partners";
import { usePartner } from "@/features/partners/usePartner";
import { useFilterStore } from "../store/filterStore";
import type { Project, ProjectType, UnitConfig } from "../types/project";
import { useBudgetFilter } from "./useBudgetFilter";

// Filler words that connect a search phrase but shouldn't have to be matched
// (e.g. "shops on pine avenue road" → ["shops", "pine", "avenue", "road"]).
const STOP_WORDS = new Set([
  "on",
  "in",
  "at",
  "the",
  "a",
  "an",
  "of",
  "for",
  "and",
  "or",
  "with",
  "to",
  "near",
]);

// Default ordering: group by location so the grid reads road-by-road. Lahore
// (the home market) is pinned ahead of other cities, then areas sort
// alphabetically, then cheapest entry price first within each area.
function byLocation(a: Project, b: Project): number {
  if (a.city !== b.city) {
    if (a.city === "Lahore") return -1;
    if (b.city === "Lahore") return 1;
    return a.city.localeCompare(b.city);
  }
  if (a.area !== b.area) return a.area.localeCompare(b.area);
  return lowestTotal(a) - lowestTotal(b);
}

export function useFilteredProjects(): Project[] {
  const search = useFilterStore((s) => s.search);
  const city = useFilterStore((s) => s.city);
  const area = useFilterStore((s) => s.area);
  const type = useFilterStore((s) => s.type);
  const config = useFilterStore((s) => s.config);
  const possession = useFilterStore((s) => s.possession);
  const budget = useBudgetFilter();
  const approvedOnly = useFilterStore((s) => s.approvedOnly);
  const partner = usePartner();

  return useMemo(() => {
    // Tokenise the query and match every word independently, so a natural
    // phrase like "shops on pine avenue road" matches even though no single
    // field contains it verbatim. Stop words ("on", "in", …) are dropped so
    // they don't have to appear in the searchable text.
    const terms = search
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t && !STOP_WORDS.has(t));

    return PROJECTS.filter((p) => {
      // Partner embeds only ever see their allowed subset of the catalogue.
      if (!isAllowedSlug(partner, slugOf(p))) return false;
      if (terms.length) {
        const haystack = searchText(p);
        if (!terms.every((t) => haystack.includes(t))) return false;
      }
      if (city && p.city !== city) return false;
      if (area && p.area !== area) return false;
      if (type && !typesOf(p).includes(type as ProjectType)) return false;
      if (config && !configsOf(p).includes(config as UnitConfig)) return false;
      if (possession && p.poss !== possession) return false;
      // Budget is matched at the unit level — a project shows if any of its
      // units fits the window, not just its cheapest entry price.
      if (!matchesBudget(p, budget)) return false;
      if (approvedOnly && p.lda !== "Approved") return false;
      return true;
    }).sort(byLocation);
  }, [search, city, area, type, config, possession, budget, approvedOnly, partner]);
}
