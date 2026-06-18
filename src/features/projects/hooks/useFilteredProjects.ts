import { useMemo } from "react";
import {
  configsOf,
  lowestTotal,
  matchesBudget,
  PROJECTS,
  typesOf,
} from "../constants/projects";
import { useFilterStore } from "../store/filterStore";
import type { Project, ProjectType, UnitConfig } from "../types/project";
import { useBudgetFilter } from "./useBudgetFilter";

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

  return useMemo(() => {
    const q = search.trim().toLowerCase();

    return PROJECTS.filter((p) => {
      if (q) {
        const haystack = `${p.name} ${p.dev} ${p.city} ${p.area}`.toLowerCase();
        if (!haystack.includes(q)) return false;
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
  }, [search, city, area, type, config, possession, budget, approvedOnly]);
}
