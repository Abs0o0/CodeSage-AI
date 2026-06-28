import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken = localStorage.getItem("codesage-token") || null;
let refreshPromise = null;

let authHandlers = {
  onRefreshSuccess: null,
  onAuthFailure: null,
};

export function setAccessToken(token) {
  accessToken = token || null;

  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function getAccessToken() {
  return accessToken;
}

export function setAuthHandlers(handlers = {}) {
  authHandlers = {
    ...authHandlers,
    ...handlers,
  };
}

if (accessToken) {
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

api.interceptors.request.use((config) => {
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || "";

    const isAuthEndpoint =
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/auth/register") ||
      requestUrl.includes("/api/auth/refresh") ||
      requestUrl.includes("/api/auth/logout");

    if (!originalRequest || originalRequest._retry || status !== 401 || isAuthEndpoint) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post("/api/auth/refresh")
          .then((res) => res.data)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const data = await refreshPromise;

      if (!data?.token) {
        throw new Error("Unable to refresh session.");
      }

      setAccessToken(data.token);
      authHandlers.onRefreshSuccess?.(data);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${data.token}`;

      return api(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);
      authHandlers.onAuthFailure?.(refreshError);
      throw refreshError;
    }
  }
);

export default api;