import axios from "axios";


import setupInterceptors from "./interceptor";

const API_URL = "http://localhost:9999/api/reviews";

export const reviewsAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

setupInterceptors(reviewsAPI);


export const getPostBoardList = async () => {
  // GET /api/editors
  const response = await reviewsAPI.get("/list");
  return response.data;
};

export const getPostBoardDetail = async (brno) => {
  // GET /api/reviews/detail/{brno}로 요청을 보냅니다.
  const response = await reviewsAPI.get(`/detail/${brno}`);
  return response.data;
};
