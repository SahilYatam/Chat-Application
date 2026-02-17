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

// Axios instance with base configuration
const api: AxiosInstance = axios.create({
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

        // Check if error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Refresh token endpoint call
                await api.post(
                    "/auth/refresh-access-token",
                    {},
                    {
                        withCredentials: true,
                    },
                );

                processQueue(null);
                isRefreshing = false;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as AxiosError);
                isRefreshing = false;

                // Redirecting to login if refresh fails
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
