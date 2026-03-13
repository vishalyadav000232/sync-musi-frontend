import axios from "axios";
import { BASE_URL } from "../core/config";
import { getToken, setToken } from "../utils/token_helper";

const BaseApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

BaseApi.interceptors.request.use(
  (config) => {
    const token = getToken()

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

async function refreshToken() {
  try {
    const res = await BaseApi.post("/auth/refresh",{},{
      withCredentials:true
    });

    const access_token = res.data.access_token;

    setToken(access_token)

    return access_token;

  } catch (err) {
    console.error("Failed to refresh token:", err);
    return null;
  }
}

BaseApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      const newToken = await refreshToken();

      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return BaseApi(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default BaseApi;