import axios from "axios";


import setupInterceptors from "./interceptor";

const API_URL = "http://localhost:9999/api/reviews";

export const reviewsAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

setupInterceptors(reviewsAPI);

export const getPostBoardList = async () => {
  const response = await reviewsAPI.get("/list");
  return response.data;
};

export const getPostBoardDetail = async (brno) => {
  const response = await reviewsAPI.get(`/detail/${brno}`);
  return response.data;
};

export const postBoardWrite = async (reviewData) => {
  const response = await reviewsAPI.post("write", reviewData);
  return response.data;
};
