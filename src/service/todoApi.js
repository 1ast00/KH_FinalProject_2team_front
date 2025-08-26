import axios from "axios";
import { getAccessToken } from "../util/authUtil";
const API_BASE_URL = "http://localhost:9999/api";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

authApi.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        console.log('Access Token:', accessToken);

        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            console.log('Authorization 헤더 설정됨:', config.headers.Authorization);
        }
        return config;
    },

    (error) => {
        return Promise.reject(error);
    },
);

// 목록
export const getTodosByDate = async (date) => {
    // console.log(date);
    // try {
    //     const response = await authApi.get('/todo/list', {
    //             date: date
    //     }); 
    //     return response.data;
    // } catch (error) {
    //     console.log("getTodosByDate: ", error);
    // }
};

// 추가
export const addTodo = async (title, date) => {
    // console.log("addTodo");
    // try {
    //     const response = await authApi.post('/add', {
    //         tcontent: title,
    //         tdate: date,
    //     });
    //     return response.data;
    // } catch (error) {
    //     throw error;
    // }
};