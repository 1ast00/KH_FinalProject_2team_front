import axios from "axios";
const API_BASE_URL = "http://localhost:9999/api";

const authApi = axios.create({
  baseURL: API_BASE_URL,
});