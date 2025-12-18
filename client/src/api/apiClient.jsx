import axios from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({
    // VITE_ prefix is mandatory for Vite to read variables
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1.0",
    withCredentials: true, // Required for Cookies
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only toast here if it's NOT a 401 (handled by Auth logic)
        if (error.response?.status !== 401) {
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;