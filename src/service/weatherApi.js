import axios from "axios";

const API_KEY = "d4a5c814723aa964c208f40f4657e41d";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        lat: lat, // 위도
        lon: lon, // 경도
        appid: API_KEY,
        units: "metric", // 온도를 섭씨(℃)로 받기 위함
        lang: "kr",      // 응답 설명을 한국어로 받기 위함
      },
    });
    // 필요한 데이터만 간단하게 가공해서 반환
    return {
      city: response.data.name,
      temp: response.data.main.temp,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
    };
  } catch (error) {
    console.error("날씨 정보를 불러오는 중 오류 발생:", error);
    return null;
  }
};