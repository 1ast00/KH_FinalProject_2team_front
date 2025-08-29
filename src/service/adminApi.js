// src/service/adminApi.js
import axios from "axios";
import { getAccessToken } from "../util/authUtil";

const API_BASE_URL = "http://localhost:9999/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken?.();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ----- 대시보드 ----- */
export const getAdminDashboardSummary = () =>
  api.get("/admin/dashboard/summary");
export const getAdminRecentReviews = () =>
  api.get("/admin/dashboard/recent-reviews");
export const getAdminRecentDiets = () =>
  api.get("/admin/dashboard/recent-diets");

/* ----- 회원관리 ----- */
export const getAdminMembers = (params) =>
  api.get("/admin/members", { params });

export const getAdminMemberDetail = (mno) =>
  api.get(`/admin/members/${mno}`);

export const patchAdminMemberRole = (mno, role) =>
  api.patch(`/admin/members/${mno}/role`, { role });

export default {
  // 대시보드
  getAdminDashboardSummary,
  getAdminRecentReviews,
  getAdminRecentDiets,
  // 회원관리
  getAdminMembers,
  getAdminMemberDetail,
  patchAdminMemberRole,
};