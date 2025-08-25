import axios from "axios"; // HTTP 통신을 위한 axios 라이브러리

// 백엔드 서버의 기본 URL 주소
const API_BASE_URL = "http://localhost:9999/api";

// 인증이 필요 없는 public API 요청을 위한 axios 인스턴스 생성
const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

// 운동 데이터 목록을 가져오는 함수
export const getExerciseData = async () => {
  try {
    // 백엔드 컨트롤러의 '/api/exercise/data' 경로로 GET 요청을 보냄
    const response = await publicApi.get("/exercise/data");
    // 성공 시 응답 데이터(운동 목록)를 반환
    return response.data;
  } catch (error) {
    // 에러 발생 시 콘솔에 로그를 출력하고, 빈 배열 반환
    console.error("운동 데이터를 불러오는 중 오류 발생:", error);
    return [];
  }
};