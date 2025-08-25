import axios from "axios";
import { getAccessToken } from "../util/authUtil";

const API_BASE_URL = "http://localhost:9999/api";

const api = axios.create({
  baseURL: `${API_BASE_URL}/healthdailylog`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 목록(무한스크롤 + 날짜필터)
export const apiFetchHealthDailyLogList = async ({ cursor = 0, limit = 12, date = "" }) => {
  const res = await api.get(`/list`, { params: { cursor, limit, date } });
  return res.data; // { items, nextCursor }
};

// 등록
export const apiCreateHealthDailyLog = async (payload) => {
  const res = await api.post("", payload);
  return res.data; // { code, msg, hno }
};

// 수정
export const apiUpdateHealthDailyLog = async (hno, payload) => {
  const res = await api.patch(`/${hno}`, payload);
  return res.data; // { code, msg }
};

// 삭제
export const apiDeleteHealthDailyLog = async (hno) => {
  const res = await api.delete(`/${hno}`);
  return res.data; // { code, msg }
};