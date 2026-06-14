import { create } from "zustand";
import {
  MAX_DOWN_PAYMENT,
  MAX_ENTRY_PRICE,
  MAX_MONTHLY,
  MIN_DOWN_PAYMENT,
  MIN_ENTRY_PRICE,
  MIN_MONTHLY,
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
  minEntryPrice: number; // in millions, filters on entry price
  maxEntryPrice: number; // in millions, filters on entry price
  minDownPayment: number; // in millions, filters on entry down payment
  maxDownPayment: number; // in millions, filters on entry down payment
  minMonthly: number; // raw PKR, filters on entry monthly installment
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
  setMinEntryPrice: (v: number) => void;
  setMaxEntryPrice: (v: number) => void;
  setMinDownPayment: (v: number) => void;
  setMaxDownPayment: (v: number) => void;
  setMinMonthly: (v: number) => void;
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
  minEntryPrice: MIN_ENTRY_PRICE,
  maxEntryPrice: MAX_ENTRY_PRICE,
  minDownPayment: MIN_DOWN_PAYMENT,
  maxDownPayment: MAX_DOWN_PAYMENT,
  minMonthly: MIN_MONTHLY,
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
  setMinEntryPrice: (minEntryPrice) => set({ minEntryPrice }),
  setMaxEntryPrice: (maxEntryPrice) => set({ maxEntryPrice }),
  setMinDownPayment: (minDownPayment) => set({ minDownPayment }),
  setMaxDownPayment: (maxDownPayment) => set({ maxDownPayment }),
  setMinMonthly: (minMonthly) => set({ minMonthly }),
  setMaxMonthly: (maxMonthly) => set({ maxMonthly }),
  setApprovedOnly: (approvedOnly) => set({ approvedOnly }),
  reset: () => set(initialState),
}));
