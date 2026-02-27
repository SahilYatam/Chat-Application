import axios, {
    type AxiosError,
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios";

// Types for the failed queue

interface QueueItem {
    resolve: (value?: unknown) => void;
    reject: (value?: unknown) => void;
}

// Main api instance
const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Separate instance only for refreshing
const refreshApi: AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Tracking refresh state
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

/**
 * Process all queued requests after token refresh
 * @param error  - Error object if refresh failed, null if successful
 */
const processQueue = (error: AxiosError | null): void => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });

    failedQueue = [];
};

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (originalRequest.url?.includes("/auth/refresh-access-token")) {
            return Promise.reject(error);
        }

        if (
            window.location.pathname === "/login" ||
            window.location.pathname === "/signup"
        ) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await refreshApi.post("/auth/refresh-access-token", {});

                const newAccessToken = res.data.data.accessToken;

                const { store } = await import("../store/store");
                const { setAccessToken } = await import("../features/auth/authSlices");

                store.dispatch(setAccessToken(newAccessToken));

                processQueue(null);
                isRefreshing = false;

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as AxiosError);
                isRefreshing = false;

                failedQueue = [];

                if (window.location.pathname !== "/login") {
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 100);
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
