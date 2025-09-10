import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useNavStore = create()(
  devtools(
    persist(
      immer((set, get) => ({
        history: [],


        // 현재 페이지 push
        push: (path, state = {}) => {
          set((store) => {
            const last = store.history[store.history.length - 1];
            if (!last || last.path !== path) {
              store.history.push({ path, state });
            }
          }, false, "nav/push");
        },

        // 뒤로가기
        pop: () => {
          const h = get().history;
          if (h.length > 1) {
            const prev = h[h.length - 2];
            set((store) => {
              store.history.pop(); // 현재 제거
            }, false, "nav/pop");
            return prev;
          }
          return { path: "/food/search", state: {} };
        },

        // 전체 초기화
        clear: () => {
          set((state) => {
            state.history = [];
          }, false, "nav/clear");
        },
      })),
      {
        name: "nav-storage", // localStorage key
      }
    ),
    { name: "NavStore" } // Redux DevTools에서 보이는 이름
  )
);