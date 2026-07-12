import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const uuid = localStorage.getItem("uuid");

  if (uuid) {
    config.headers["X-User-Id"] = uuid;
  }

  return config;
});

export default axiosInstance;