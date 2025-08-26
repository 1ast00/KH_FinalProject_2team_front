// ToDo 전역 스토어 (persist + devtools + immer)
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 간단한 ID 유틸: crypto.randomUUID가 있으면 사용, 없으면 폴백
const newId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 9));

export const useTodoStore = create()(
  // devtools는 Redux DevTools 연동을 가능하게 함
  devtools(
    // persist는 localStorage에 상태를 저장/복원함 (기본 스토리지는 localStorage)
    persist(
      // immer로 set의 콜백 안에서 draft 상태를 직접 변형하는 패턴 사용
      immer((set) => ({
        todos: [], // [{ id, title, done }]

        // 할 일 추가
        add: (title) =>
          set(
            (state) => {
              state.todos.push({ id: newId(), title, done: false });
            },
            false,
            'todo/add',
          ),

        // 체크 토글
        toggle: (id) =>
          set(
            (state) => {
              const t = state.todos.find((t) => t.id === id);
              if (t) t.done = !t.done;
            },
            false,
            'todo/toggle',
          ),

        // 항목 삭제
        remove: (id) =>
          set(
            (state) => {
              state.todos = state.todos.filter((t) => t.id !== id);
            },
            false,
            'todo/remove',
          ),

        // 완료 항목 일괄 삭제
        clearDone: () =>
          set(
            (state) => {
              state.todos = state.todos.filter((t) => !t.done);
            },
            false,
            'todo/clearDone',
          ),

        // (선택) 서버에서 초기 데이터 불러오기 예시
        loadInitial: async () => {
          const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
          const data = await res.json();
          set(
            (s) => {
              s.todos = data.map((d) => ({
                id: String(d.id),
                title: d.title,
                done: d.completed,
              }));
            },
            false,
            'todo/loadInitial',
          );
        },
      })),
      // persist 옵션: key 이름
      { name: 'todos-storage' },
    ),
    // devtools 옵션: 스토어 이름 (Redux DevTools에 표시됨)
    { name: 'TodoStore' },
  ),
);
