// 로그인 정보 관리
const ACCESS_TOKEN_KEY = "accessToken";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};
export const getUserData = () => {
  return JSON.parse(localStorage.getItem("userData"));
};

export const setUserData = (user) => {
  localStorage.setItem("userData", user);
};

export const clearToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const clearUserData = () => {
  localStorage.removeItem("userData");
};

//유효성 검사
export const isAuthenticated = () => {
  return !!getAccessToken();
};