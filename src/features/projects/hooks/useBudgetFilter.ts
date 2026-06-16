import { useMemo } from "react";
import type { BudgetFilter } from "../constants/projects";
import { useFilterStore } from "../store/filterStore";

/** The active budget window from the filter store, as a stable object. */
export function useBudgetFilter(): BudgetFilter {
  const budgetMode = useFilterStore((s) => s.budgetMode);
  const minEntryPrice = useFilterStore((s) => s.minEntryPrice);
  const maxEntryPrice = useFilterStore((s) => s.maxEntryPrice);
  const minDownPayment = useFilterStore((s) => s.minDownPayment);
  const maxDownPayment = useFilterStore((s) => s.maxDownPayment);
  const minMonthly = useFilterStore((s) => s.minMonthly);
  const maxMonthly = useFilterStore((s) => s.maxMonthly);

  return useMemo(
    () => ({
      budgetMode,
      minEntryPrice,
      maxEntryPrice,
      minDownPayment,
      maxDownPayment,
      minMonthly,
      maxMonthly,
    }),
    [
      budgetMode,
      minEntryPrice,
      maxEntryPrice,
      minDownPayment,
      maxDownPayment,
      minMonthly,
      maxMonthly,
    ]
  );
}
