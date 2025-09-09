import axios from "axios";
import setupInterceptors from "./interceptor";

const API_BASE_URL = "http://localhost:9999/api";

const api = axios.create({
baseURL: API_BASE_URL,
withCredentials: true,
});

setupInterceptors(api);

/* ----- 대시보드 ----- */
export const getAdminDashboardSummary = () => api.get("/admin/dashboard/summary");
export const getAdminRecentReviews   = () => api.get("/admin/dashboard/recent-reviews");
export const getAdminRecentDiets     = () => api.get("/admin/dashboard/recent-diets");

/* ----- 회원관리 ----- */
export const getAdminMembers       = (params) => api.get("/admin/members", { params });
export const getAdminMemberDetail  = (mno)    => api.get(`/admin/members/${mno}`);
export const patchAdminMemberRole  = (mno, role) => api.patch(`/admin/members/${mno}/role`, { role });
export const deleteAdminMember     = (mno)    => api.delete(`/admin/members/${mno}`);

/* ----- 식단 게시판 관리 ----- */
export const getAdminMeals = (params) => api.get("/admin/meals", { params });
export const getAdminMealAuthorActivity = (bmno) =>
  api.get(`/admin/meals/${bmno}/author-activity`);

/* ----- 리뷰 게시판 관리 ----- */
export const getAdminReviews = (params) =>
  api.get("/admin/reviews", { params });

export const patchAdminReviewStatus = (brno, posted) =>
  api.patch(`/admin/reviews/${brno}/status`, null, { params: { posted } });

/* ----- 신고 관리 ----- */
export const getAdminReports = (params) => api.get("/admin/reports", { params });
export const resolveAdminReport = (reportId, resolverMno) =>
  api.patch(`/admin/reports/${reportId}/resolve`, null, { params: { resolverMno }});
export const deleteAdminReport = (reportId) =>
  api.delete(`/admin/reports/${reportId}`);

export default {
  getAdminDashboardSummary,
  getAdminRecentReviews,
  getAdminRecentDiets,
  getAdminMembers,
  getAdminMemberDetail,
  patchAdminMemberRole,
  deleteAdminMember,
  getAdminMeals,
  getAdminMealAuthorActivity,
  getAdminReports,
  resolveAdminReport,
  deleteAdminReport,
  getAdminReviews,
  patchAdminReviewStatus,
};
