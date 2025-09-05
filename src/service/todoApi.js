import axios from "axios";
import { getAccessToken } from "../util/authUtil";
import setupInterceptors from "./interceptor";
const API_BASE_URL = "http://localhost:9999/api/todo/";

const todoApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

setupInterceptors(todoApi);

// 목록
export const getTodosByDate = async (date) => {
    console.log(date);
    try {
        const response = await todoApi.get('list', {
          params: {
            date: date
          },
        }); 
        return response.data;
    } catch (error) {
        console.log("getTodosByDate: ", error);
    }
};

// 추가
export const addTodo = async (title, date) => {
    console.log("addTodo");
    try {
        const response = await todoApi.post('add', {
          tcontent: title,
          tdate: date,
        });
        return response.data;
    } catch (error) {
      console.log("addTodo error: ", error);
      throw error;
    }
};

// 체크 토글 변경 사항 저장
export const updateCheck = async (todos) => {
  console.log("updateCheck");
  try {
    const response = await todoApi.patch('updateCheck', {
        todos: todos.map((t) => ({
        tno: t.id,
        tcheck: t.done ? 1 : 0,
        tcontent: t.title,
        tdate: t.date,
      })),
    });
    return response.data;
  } catch (error) {
    console.log("updateCheck error: ", error);
    throw error;
  }
};

// 삭제
export const deleteTodo = async (id) => {
  console.log("deleteTodo");
  try {
    const response = await todoApi.delete(`/${id}`);
    return response.data;
  } catch(error) {
    console.log("deleteTodo error: ", error);
    throw error;
  }
};

// 완료 항목 삭제
export const deleteDoneTodo = async (doneTodos) => {
  console.log("deleteDoneTodo");
  try {
    const response = await todoApi.delete('done', {
      data: 
        doneTodos.map((t) => ({
          tno: t.id,
        })),
    });
    return response.data;
  } catch (error) {
    console.log("deleteDoneTodo error: ", error);
    throw error;
  }
};

// 수정
export const updateTodo = async (todoAll) => {
  console.log("updateTodo");
  try {
    const response = await todoApi.patch(`updateTodo/${todoAll.id}`, {
      tcontent: todoAll.title,
    }
  );
    return response.data;
  } catch (error) {
    console.log("updateTodo error: ", error);
  }
};