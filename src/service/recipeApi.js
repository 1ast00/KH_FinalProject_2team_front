import axios from "axios";
import { getAccessToken } from "../util/authUtil";
const API_BASE_URL = "http://localhost:9999/api/recipe/";

const recipeApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 토큰 자동 생성
recipeApi.interceptors.request.use(
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
export const getRecipeList = async () => {
  try {
    const response = await recipeApi.get("list");
    return response.data;
  } catch (error) {
    console.log("getRecipeList: ", error);
  }
};