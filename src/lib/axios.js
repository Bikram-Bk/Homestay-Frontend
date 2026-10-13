import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — access token attach
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("hn_access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — auto refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh");
        const newToken = data?.data?.accessToken;

        if (newToken) {
          localStorage.setItem("hn_access_token", newToken);
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          throw new Error("No new token");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("hn_access_token");
        localStorage.removeItem("hn_user");
        if (typeof window !== "undefined") {
          const protectedPaths = ["/dashboard", "/payment"];
          const isProtected = protectedPaths.some((p) =>
            window.location.pathname.startsWith(p)
          );
          if (isProtected) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
