import axios from "axios";
import { getAccessToken } from "../util/authUtil";
const API_BASE_URL = "http://localhost:9999/api";

const todoApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 토큰 자동 생성
todoApi.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log("accessToken: ", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 목록
export const getTodosByDate = async (date) => {
    console.log(date);
    try {
        const response = await todoApi.get('/todo/list', {
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
        const response = await todoApi.post('/todo/add', {
            tcontent: title,
            tdate: date,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};