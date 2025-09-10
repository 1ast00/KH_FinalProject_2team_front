import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useNavStore = create()(
  devtools(
    persist(
      immer((set, get) => ({
        history: [],


        // 현재 페이지 push
        push: (path, state = null) => {
  set((store) => {
    const last = store.history[store.history.length - 1];

    // 같은 path라면 덮어쓰지 않음
    if (!last || last.path !== path) {
      store.history.push({ path, state });
    } else if (state) {
      // 같은 path인데 새로운 state가 있으면 업데이트
      last.state = state;
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
          return { path: "/food/search" };
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