import axios from "axios";
import { getAccessToken } from "../util/authUtil";
import setupInterceptors from "./interceptor";

const API_BASE_URL = "http://localhost:9999/api/recipe/";

const recipeApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

setupInterceptors(recipeApi);

// 목록
export const getRecipeList = async () => {
  try {
    const response = await recipeApi.get("list");
    return response.data;
  } catch (error) {
    console.log("getRecipeList: ", error);
  }
};