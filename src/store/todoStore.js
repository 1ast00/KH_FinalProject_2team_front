// ToDo 전역 스토어 (persist + devtools + immer)
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { addTodo, getTodosByDate, updateCheck } from '../service/todoApi';

// 간단한 ID 유틸: crypto.randomUUID가 있으면 사용, 없으면 폴백
// const newId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 9));

export const useTodoStore = create()(
  // devtools는 Redux DevTools 연동을 가능하게 함
  devtools(
    // persist는 localStorage에 상태를 저장/복원함 (기본 스토리지는 localStorage)
    persist(
      // immer로 set의 콜백 안에서 draft 상태를 직접 변형하는 패턴 사용
      immer((set, get) => ({
        todos: [], // [{ id, title, done }]

        // 할 일 추가
        add: async (title, date) => {
          try {
            // 1. 서버에 추가 요청 보내기
            const response = await addTodo(title, date);
            console.log("useTodoStore - response: ", response);

            // 2. 상태 업데이트
            const newTodo = {
              id: response.tno,       // 서버 DB ID
              title: response.tcontent,
              done: response.tcheck,
              date: response.tdate
            };
            
            set(
              (state) => ({
                todos: [
                  ...state.todos, newTodo
                ]
              }),
              false,
              'todo/add'
            );
            alert(response.msg);
          } catch (error) {
            console.error('할 일 추가 실패:', error);
          }
        },

        // 체크 토글 (로컬 상태 변경)
        toggle: (id) => {
          set(
            (state) => {
              const t = state.todos.find((t) => t.id === id);
              if (t) t.done = !t.done;
            },
            false,
            'todo/toggle'
          );
        },

        // 저장 (DB 반영)
        updateChk: async () => {
          try {
            const todos = get().todos;
            const response = await updateCheck(todos);
            alert(response.msg || "저장 완료");
          } catch (error) {
            console.error("저장 실패:", error);
          }
        },

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

        // 항목 수정
        edit: (id, newTitle) => 
          set(
            (state) => {
              const todo = state.todos.find(todo => todo.id === id);
              if (todo) {
                todo.title = newTitle;
              }
            },
            false,
            'todo/edit'
          ),

        // 초기 데이터 불러오기
        loadInitial: async (date) => {
          const res = await getTodosByDate(date);
          const data = res.todoList;
          set(
            (state) => {
              state.todos = data.map((d) => ({
                id: d.tno,
                title: d.tcontent,
                done: d.tcheck,
                date: d.tdate
              }));
            },
            false,
            'todo/loadInitial'
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