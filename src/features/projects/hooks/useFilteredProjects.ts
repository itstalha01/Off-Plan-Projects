import { useMemo } from "react";
import {
  entryDownPaymentMillions,
  entryMonthlyInstallment,
  entryPriceMillions,
  lowestTotal,
  PROJECTS,
  typesOf,
} from "../constants/projects";
import { useFilterStore } from "../store/filterStore";
import type { Project, ProjectType } from "../types/project";

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
  const possession = useFilterStore((s) => s.possession);
  const budgetMode = useFilterStore((s) => s.budgetMode);
  const maxEntryPrice = useFilterStore((s) => s.maxEntryPrice);
  const maxDownPayment = useFilterStore((s) => s.maxDownPayment);
  const maxMonthly = useFilterStore((s) => s.maxMonthly);
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
      if (possession && p.poss !== possession) return false;
      if (budgetMode === "down") {
        if (entryDownPaymentMillions(p) > maxDownPayment) return false;
      } else if (entryPriceMillions(p) > maxEntryPrice) {
        return false;
      }
      if (entryMonthlyInstallment(p) > maxMonthly) return false;
      if (approvedOnly && p.lda !== "Approved") return false;
      return true;
    }).sort(byLocation);
  }, [
    search,
    city,
    area,
    type,
    possession,
    budgetMode,
    maxEntryPrice,
    maxDownPayment,
    maxMonthly,
    approvedOnly,
  ]);
}
