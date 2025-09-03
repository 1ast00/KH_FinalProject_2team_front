// ToDo 전역 스토어 (persist + devtools + immer)
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { addTodo, deleteDoneTodo, deleteTodo, getTodosByDate, updateCheck, updateTodo } from "../service/todoApi";

export const useTodoStore = create()(
  // devtools는 Redux DevTools 연동을 가능하게 함
  devtools(
    // persist는 localStorage에 상태를 저장/복원함 (기본 스토리지는 localStorage)
    persist(
      // immer로 set의 콜백 안에서 draft 상태를 직접 변형하는 패턴 사용
      immer((set, get) => ({
        todos: [], // [{ id, title, done }]
        doneTodos: [], // 완료 항목

        // 할 일 추가
        add: async (title, date) => {
          try {
            // 1. 서버에 추가 요청 보내기
            const response = await addTodo(title, date);

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
              "todo/add"
            );
          } catch (error) {
            console.error("할 일 추가 실패:", error);
          }
        },

        // 체크 토글 (로컬 상태 변경)
        toggle: (id) => {
          set(
              (state) => {
                // 1. todos 배열에서 해당 항목 찾기
                const todoIndex = state.todos.findIndex((t) => t.id === id);

                if (todoIndex !== -1) {
                  // 2. todos 배열에서 찾은 경우
                  const todoToMove = state.todos[todoIndex];
                  todoToMove.done = !todoToMove.done; // done 상태 토글

                  // 3. done 상태에 따라 배열 이동
                  if (todoToMove.done) {
                    // done이 true가 되면 doneTodos 배열로 이동
                    state.todos.splice(todoIndex, 1); // todos에서 제거
                    state.doneTodos.push(todoToMove); // doneTodos에 추가
                  }
                } else {
                  // 4. todos 배열에서 못 찾은 경우 (doneTodos 배열에서 찾기)
                  const doneTodoIndex = state.doneTodos.findIndex((t) => t.id === id);
                  if (doneTodoIndex !== -1) {
                    const todoToMove = state.doneTodos[doneTodoIndex];
                    todoToMove.done = !todoToMove.done; // done 상태 토글

                    // 5. done 상태에 따라 배열 이동
                    if (!todoToMove.done) {
                      // done이 false가 되면 todos 배열로 이동
                      state.doneTodos.splice(doneTodoIndex, 1); // doneTodos에서 제거
                      state.todos.push(todoToMove); // todos에 추가
                    }
                  }
                }
              },
            false,
            "todo/toggle"
          );
        },

        // 체크 토글 변경 사항 저장
        updateChk: async () => {
          try {
            const todoAll = [...get().todos, ...get().doneTodos];
            await updateCheck(todoAll);
          } catch (error) {
            console.error("저장 실패:", error);
          }
        },

        // 항목 삭제
        remove: async (id) => {
          try {
            await deleteTodo(id);
          } catch (error) {
            console.log("항목 삭제 실패: ", error);
          }

          set(
            (state) => {
              state.todos = state.todos.filter((t) => t.id !== id);
              state.doneTodos = state.doneTodos.filter((t) => t.id !== id);
            },
            false,
            "todo/delete",
          )
        },

        // 완료 항목 일괄 삭제
        clearDone: async (doneTodos) => {
          try {
            await deleteDoneTodo(doneTodos);
          } catch (error) {
            console.log("일괄 삭제 실패: ", error);
          }

          set(
            (state) => {
              state.doneTodos = state.doneTodos.filter((t) => !t.done);
            },
            false,
            "todo/deleteDoneTodo",
          )
        },

        // 항목 수정
        edit: async (id, newTitle) => {
          try {
            await updateTodo({id, title: newTitle});
          } catch (error) {
            console.log("수정 실패: ", error);
          }

          set(
            (state) => {
              const t = state.todos.find(t => t.id === id);
              if (t) t.title = newTitle;
              const d = state.doneTodos.find(t => t.id === id);
              if (d) d.title = newTitle;
            },
            false,
            "todo/edit"
          )
        },

        // 초기 데이터 불러오기
        loadInitial: async (date) => {
          const response = await getTodosByDate(date);
          const data = response.todoList;
          const todos = [];
          const doneTodos = [];

          data.map((d) => {
            const todo = {
              id: d.tno,
              title: d.tcontent,
              done: d.tcheck === 1,
              date: d.tdate,
            };

            // 완료일 경우 doneTodos
            if(todo.done) {
              doneTodos.push(todo);
            } else {
              todos.push(todo);
            }
          });

          set(
            (state) => {
              state.todos = todos;
              state.doneTodos = doneTodos;
            },
            false,
            "todo/loadInitial"
          );
        },
      })),
      // persist 옵션: key 이름
      { name: "todos-storage" },
    ),
    // devtools 옵션: 스토어 이름 (Redux DevTools에 표시됨)
    { name: "TodoStore" },
  ),
);