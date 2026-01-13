import { type StateCreator } from "zustand";

export interface ArenaPageSlice {
  searchQuery: string;
  selectedCategory: string;

  handleSearchChange: (query: string) => void;
  handleCategoryChange: (category: string) => void;
  resetFilters: () => void;
}

export const createArenaPageSlice: StateCreator<ArenaPageSlice> = (set) => ({
  searchQuery: "",
  selectedCategory: "all",

  handleSearchChange: (query) => set({ searchQuery: query }),
  handleCategoryChange: (category) => set({ selectedCategory: category }),
  resetFilters: () =>
    set({
      searchQuery: "",
      selectedCategory: "all",
    }),
});
