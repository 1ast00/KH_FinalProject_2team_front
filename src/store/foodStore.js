// store/foodStore.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useFoodStore = create()(
  devtools(
    persist(
      immer((set, get) => ({
        selectedItem: null,

        setSelectedItem: (item) => {
          set((state) => {
            state.selectedItem = item;
          }, false, "food/setSelectedItem");
        },

        clearSelectedItem: () => {
          set((state) => {
            state.selectedItem = null;
          }, false, "food/clearSelectedItem");
        }
      })),
      { name: "food-storage" } // localStorage key
    ),
    { name: "FoodStore" }
  )
);