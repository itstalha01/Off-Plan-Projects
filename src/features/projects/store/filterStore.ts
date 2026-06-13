import { create } from "zustand";
import { MAX_ENTRY_PRICE } from "../constants/projects";

export type FilterState = {
  search: string;
  city: string; // "" = any
  area: string; // "" = any
  type: string; // "" = any
  possession: string; // "" = any year
  maxEntryPrice: number; // in millions, filters on minP
  approvedOnly: boolean;
};

type FilterActions = {
  setSearch: (v: string) => void;
  setCity: (v: string) => void;
  setArea: (v: string) => void;
  setType: (v: string) => void;
  setPossession: (v: string) => void;
  setMaxEntryPrice: (v: number) => void;
  setApprovedOnly: (v: boolean) => void;
  reset: () => void;
};

const initialState: FilterState = {
  search: "",
  city: "",
  area: "",
  type: "",
  possession: "",
  maxEntryPrice: MAX_ENTRY_PRICE,
  approvedOnly: false,
};

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setCity: (city) => set({ city }),
  setArea: (area) => set({ area }),
  setType: (type) => set({ type }),
  setPossession: (possession) => set({ possession }),
  setMaxEntryPrice: (maxEntryPrice) => set({ maxEntryPrice }),
  setApprovedOnly: (approvedOnly) => set({ approvedOnly }),
  reset: () => set(initialState),
}));
