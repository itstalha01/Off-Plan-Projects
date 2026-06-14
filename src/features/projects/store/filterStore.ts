import { create } from "zustand";
import {
  MAX_DOWN_PAYMENT,
  MAX_ENTRY_PRICE,
  MAX_MONTHLY,
} from "../constants/projects";

// Which budget lens the slider applies: the unit's overall entry price, or the
// upfront down payment a prospect needs to book it.
export type BudgetMode = "price" | "down";

export type FilterState = {
  search: string;
  city: string; // "" = any
  area: string; // "" = any
  type: string; // "" = any
  possession: string; // "" = any year
  budgetMode: BudgetMode;
  maxEntryPrice: number; // in millions, filters on entry price
  maxDownPayment: number; // in millions, filters on entry down payment
  maxMonthly: number; // raw PKR, filters on entry monthly installment
  approvedOnly: boolean;
};

type FilterActions = {
  setSearch: (v: string) => void;
  setCity: (v: string) => void;
  setArea: (v: string) => void;
  setType: (v: string) => void;
  setPossession: (v: string) => void;
  setBudgetMode: (v: BudgetMode) => void;
  setMaxEntryPrice: (v: number) => void;
  setMaxDownPayment: (v: number) => void;
  setMaxMonthly: (v: number) => void;
  setApprovedOnly: (v: boolean) => void;
  reset: () => void;
};

const initialState: FilterState = {
  search: "",
  city: "",
  area: "",
  type: "",
  possession: "",
  budgetMode: "price",
  maxEntryPrice: MAX_ENTRY_PRICE,
  maxDownPayment: MAX_DOWN_PAYMENT,
  maxMonthly: MAX_MONTHLY,
  approvedOnly: false,
};

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setCity: (city) => set({ city }),
  setArea: (area) => set({ area }),
  setType: (type) => set({ type }),
  setPossession: (possession) => set({ possession }),
  setBudgetMode: (budgetMode) => set({ budgetMode }),
  setMaxEntryPrice: (maxEntryPrice) => set({ maxEntryPrice }),
  setMaxDownPayment: (maxDownPayment) => set({ maxDownPayment }),
  setMaxMonthly: (maxMonthly) => set({ maxMonthly }),
  setApprovedOnly: (approvedOnly) => set({ approvedOnly }),
  reset: () => set(initialState),
}));
