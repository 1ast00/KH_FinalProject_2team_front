// 인증이 필요한 api -> 회원만 접근
import axios from "axios";
import {
  clearToken,
  getAccessToken,
  setAccessToken,
  setUserData,
} from "../util/authUtil";

// 백엔드 서버 주소
const API_BASE_URL = "http://localhost:9999/api";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CORS 요청 시 쿠키나 HTTP 인증 헤더를 포함할지 여부
});

//토큰 자동 생성
authApi.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//401처리
authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

//회원가입
export const signup = async (
  userid,
  password,
  mname,
  nickname,
  height,
  weight,
  gender,
  goalWeight
) => {
  const response = await authApi.post("/auth/register", {
    userid,
    password,
    mname,
    nickname,
    height,
    weight,
    gender,
    goalWeight,
  });
  console.log("호출: ", response);
  return response.data;
};

//로그인
export const login = async (userid, password) => {
  const response = await authApi.post("/auth/login", { userid, password });
  setAccessToken(response.data.accessToken);
  console.log("확인: ", setAccessToken(response.data.accessToken));
  return response.data;
};

//사용자 정보 get 함수
export const getUserData = async () => {
  const response = await authApi.get("/auth/user-data");
  setUserData(JSON.stringify(response.data));
  return response.data;
};

//로그아웃
export const apiLogout = async () => {
  const response = await authApi.post("/auth/logout");
  clearToken();
};