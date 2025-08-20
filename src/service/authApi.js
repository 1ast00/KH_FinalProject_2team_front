// 인증이 필요한 api -> 회원만 접근
import axios from 'axios';

// 백엔드 서버 주소
const API_BASE_URL = "http://localhost:9999/api";

const authApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // CORS 요청 시 쿠키나 HTTP 인증 헤더를 포함할지 여부
});