import { create } from "zustand";

export type InventoryFilterState = {
  city: string; // "" = any
  area: string; // "" = any
  type: string; // "" = any
  status: string; // "" = any
};

type InventoryFilterActions = {
  setCity: (v: string) => void;
  setArea: (v: string) => void;
  setType: (v: string) => void;
  setStatus: (v: string) => void;
  reset: () => void;
};

const initialState: InventoryFilterState = {
  city: "",
  area: "",
  type: "",
  status: "",
};

export const useInventoryFilterStore = create<
  InventoryFilterState & InventoryFilterActions
>((set) => ({
  ...initialState,
  setCity: (city) => set({ city }),
  setArea: (area) => set({ area }),
  setType: (type) => set({ type }),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));
