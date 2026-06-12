import { useMemo } from "react";
import { entryPriceMillions, PROJECTS, typesOf } from "../constants/projects";
import { useFilterStore } from "../store/filterStore";
import type { Project, ProjectType } from "../types/project";

export function useFilteredProjects(): Project[] {
  const search = useFilterStore((s) => s.search);
  const area = useFilterStore((s) => s.area);
  const type = useFilterStore((s) => s.type);
  const possession = useFilterStore((s) => s.possession);
  const maxEntryPrice = useFilterStore((s) => s.maxEntryPrice);
  const approvedOnly = useFilterStore((s) => s.approvedOnly);

  return useMemo(() => {
    const q = search.trim().toLowerCase();

    return PROJECTS.filter((p) => {
      if (q) {
        const haystack = `${p.name} ${p.dev} ${p.area}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (area && p.area !== area) return false;
      if (type && !typesOf(p).includes(type as ProjectType)) return false;
      if (possession && p.poss !== possession) return false;
      if (entryPriceMillions(p) > maxEntryPrice) return false;
      if (approvedOnly && p.lda !== "Approved") return false;
      return true;
    });
  }, [search, area, type, possession, maxEntryPrice, approvedOnly]);
}
