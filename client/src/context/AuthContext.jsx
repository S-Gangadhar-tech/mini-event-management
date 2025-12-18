import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial load: Verify the cookie with the server
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await AuthService.isAuthenticated();
                if (userData) {
                    setUser(userData);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        const userData = await AuthService.login(credentials);
        if (userData) {
            setUser(userData); // Sets the nested user object {"_id": "...", "name": "ram", ...}
        }
        return userData;
    };

    const logout = async () => {
        await AuthService.logout();
        setUser(null);
    };

    const signup = async (userData) => {
        return await AuthService.signin(userData);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
            {/* Show a full-page loader while checking the cookie status */}
            {!loading ? children : (
                <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);