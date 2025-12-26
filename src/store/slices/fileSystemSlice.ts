import { create } from "zustand";
import { FileSystemState, FileSystemItem } from "@/types/models/fileSystem";
import { INITIAL_DATA } from "@/config/constants";

interface FileSystemStore {
  items: FileSystemState;
  searchTerm: string;
  filterType: string;
  setItems: (items: FileSystemState) => void;
  addItem: (item: FileSystemItem) => void;
  updateItem: (id: string, item: Partial<FileSystemItem>) => void;
  deleteItem: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setFilterType: (type: string) => void;
}

export const useFileSystemStore = create<FileSystemStore>((set) => ({
  items: INITIAL_DATA,
  searchTerm: "",
  filterType: "all",
  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => ({
      items: { ...state.items, [item.id]: item },
    })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: {
        ...state.items,
        [id]: { ...state.items[id], ...updates },
      },
    })),
  deleteItem: (id) =>
    set((state) => {
      const newItems = { ...state.items };
      delete newItems[id];
      return { items: newItems };
    }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setFilterType: (filterType) => set({ filterType }),
}));
