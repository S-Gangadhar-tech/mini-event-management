import apiClient from "../api/apiClient"
import { toast } from "react-toastify";

const AuthService = {
    // Signup
    signin: async (userData) => {
        try {
            const response = await apiClient.post("/auth/signup", userData);
            toast.success("Account created! Please log in.");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Login
    login: async (credentials) => {
        try {
            const response = await apiClient.post("/auth/login", credentials);

            // Per your JSON: response.data is the wrapper, response.data.data is the user
            if (response.status === 200 || response.data.statusCode === 200) {
                toast.success("Welcome back!");
                return response.data.data; // Return the inner user object
            } else {
                toast.error(response.data.message || "Login failed");
                return null;
            }
        } catch (error) {
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await apiClient.post("/auth/logout");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            toast.info("Logged out.");
            window.location.href = "/login";
        }
    },

    // Check Auth Status (Cookie Verification)
    isAuthenticated: async () => {
        try {
            // Hits your 'get current user' endpoint
            const response = await apiClient.get("/auth/me");
            // Assuming the same structure: response.data.data
            return response.data.data;
        } catch (error) {
            return null;
        }
    }
};

export default AuthService;