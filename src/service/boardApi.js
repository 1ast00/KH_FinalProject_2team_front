import axios from "axios";
import setupInterceptors from "./interceptor";

// 1. 각 API의 URL을 고유한 이름으로 선언합니다.
const REVIEWS_API_URL = "http://localhost:9999/api/reviews";
const MEALS_API_URL = "http://localhost:9999/api/meals";

export const reviewsAPI = axios.create({
  baseURL: REVIEWS_API_URL, // reviews URL 사용
  withCredentials: true,
});

export const mealsAPI = axios.create({
  baseURL: MEALS_API_URL, // meals URL 사용
  withCredentials: true,
});

setupInterceptors(reviewsAPI);
setupInterceptors(mealsAPI);

export const getReviewList = async () => {
  const response = await reviewsAPI.get("/list");
  return response.data;
};

export const getReviewDetail = async (brno) => {
  const response = await reviewsAPI.get(`/detail/${brno}`);
  return response.data;
};

export const postReviewWrite = async (reviewData) => {
  const response = await reviewsAPI.post("/write", reviewData);
  return response.data;
};

export const getMealsList = async () => {
  const response = await mealsAPI.get("/list");
  return response.data;
};

export const getMealsDetail = async (bmno) => {
  const response = await mealsAPI.get(`/detail/${bmno}`);
  return response.data;
};

export const postMealsWrite = async (mealsData) => {
  const response = await mealsAPI.post("/write", mealsData);
  return response.data;
};
