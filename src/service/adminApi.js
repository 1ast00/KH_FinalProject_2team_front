import axios from "axios";
import setupInterceptors from "./interceptor";

const API_BASE_URL = "http://localhost:9999/api";
const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
setupInterceptors(api);

/* ----- 대시보드 ----- */
export const getAdminDashboardSummary = () => api.get("/admin/dashboard/summary");
export const getAdminRecentReviews   = (limit = 5) =>
  api.get("/admin/dashboard/recent-reviews", { params: { limit } });
export const getAdminRecentDiets     = (limit = 5) =>
  api.get("/admin/dashboard/recent-diets",   { params: { limit } });

/* ----- 회원관리 ----- */
export const getAdminMembers       = (params)        => api.get("/admin/members", { params });
export const getAdminMemberDetail  = (mno)           => api.get(`/admin/members/${mno}`);
export const patchAdminMemberRole  = (mno, role)     => api.patch(`/admin/members/${mno}/role`, { role });
export const deleteAdminMember     = (mno)           => api.delete(`/admin/members/${mno}`);

/* ----- 식단 게시판 관리 ----- */
export const getAdminMeals              = (params)        => api.get("/admin/meals", { params });
export const getAdminMealAuthorActivity = (bmno)          => api.get(`/admin/meals/${bmno}/author-activity`);
export const patchAdminMealStatus       = (bmno, posted)  =>
  api.patch(`/admin/meals/${bmno}/status`, null, { params: { posted } });

/* ----- 리뷰 게시판 관리 ----- */
export const getAdminReviews        = (params)       => api.get("/admin/reviews", { params });
export const patchAdminReviewStatus = (brno, posted) =>
  api.patch(`/admin/reviews/${brno}/status`, null, { params: { posted } });
export const getAdminReviewDetail   = (brno)         => api.get(`/admin/reviews/${brno}`);

/* ----- 신고: 일반 사용자 생성 ----- */
export const createReport = (payload) => api.post("/reports", payload);
/*
payload = {
  targetType: "MEAL_POST" | "MEAL_COMMENT" | "REVIEW_POST" | "REVIEW_COMMENT",
  targetId: number,
  reporterMno: number
}
*/

/* ----- 신고 관리(관리자) ----- */
export const getAdminReports        = (params)                  => api.get("/admin/reports", { params });
export const getAdminReportDetail   = (reportId)                => api.get(`/admin/reports/${reportId}`);
export const patchAdminReportStatus = (reportId, status)        =>
  api.patch(`/admin/reports/${reportId}/status`, null, { params: { status } });
export const resolveAdminReport     = (reportId, resolverMno)   =>
  api.patch(`/admin/reports/${reportId}/resolve`, null, { params: { resolverMno } });
export const deleteAdminReport      = (reportId)                =>
  api.delete(`/admin/reports/${reportId}`);

export default {
  // 대시보드
  getAdminDashboardSummary, getAdminRecentReviews, getAdminRecentDiets,
  // 회원
  getAdminMembers, getAdminMemberDetail, patchAdminMemberRole, deleteAdminMember,
  // 식단
  getAdminMeals, getAdminMealAuthorActivity, patchAdminMealStatus,
  // 리뷰
  getAdminReviews, patchAdminReviewStatus, getAdminReviewDetail,
  // 신고(유저/관리자)
  createReport,
  getAdminReports, getAdminReportDetail, patchAdminReportStatus,
  resolveAdminReport, deleteAdminReport,
};
