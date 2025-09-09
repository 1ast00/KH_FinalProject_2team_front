import { getAccessToken } from "../util/authUtil";

const setupInterceptors = (apiInstance) => {
  // 요청 인터셉터
  apiInstance.interceptors.request.use(
    (config) => {
      // [수정] localStorage에서 직접 가져오는 대신 getAccessToken() 함수를 사용합니다.
      const accessToken = getAccessToken();

      console.log("Interceptor: accessToken ->", accessToken); // 토큰 값 확인

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터 (401 처리) - 이 부분은 수정할 필요 없습니다.
  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // ... (기존 401 처리 로직은 그대로 유지) ...
      if (originalRequest.url.includes("refresh")) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // 'refresh' 요청 시에는 apiInstance를 사용해야 합니다.
          // 만약 refresh API가 authApi에만 있다면, 별도의 axios 인스턴스를 만들어야 할 수도 있습니다.
          // 현재 구조에서는 apiInstance를 사용하는 것이 맞습니다.
          const refreshResponse = await apiInstance.post("/auth/refresh"); // refresh URL 확인 필요
          const newAccessToken = refreshResponse.data.accessToken;

          localStorage.setItem("accessToken", newAccessToken); // refresh 성공 시 토큰 저장
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
