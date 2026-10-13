import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": undefined,
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    }

    if (error.response?.status === 401 && !error.config?.url?.includes("/profile")) {
      console.warn("Unauthorized request - authentication may be expired");
    }

    return Promise.reject(error);
  }
);

const sanctum = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SANCTUM_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": undefined,
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

export { api, sanctum };
