import { create } from "zustand";

type InventorySelectionState = {
  selectedIds: Set<string>;
  toggle: (id: string) => void;
  clear: () => void;
};

export const useInventorySelectionStore = create<InventorySelectionState>((set) => ({
  selectedIds: new Set(),
  toggle: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  clear: () => set({ selectedIds: new Set() }),
}));
