import axios from "axios";
import { log } from "console";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone_number: string;
    level: string;
    address?: string;
    school?: string;
    subjects?: string[];
    subscription_status?: string;
    profile_picture?: string;
    next_of_kin_full_name?: string;
    next_of_kin_phone_number?: string;
};

interface loginCreds {
    email: string;
    password: string;
}

interface registerCreds {
    firstName: string;
    lastName: string;
    email: string;
    phone_number: string;
    password: string;
    level: string;
    address?: string;
    school?: string;
    subjects?: string[];
    subscription_status?: string;
    profile_picture?: string;
    next_of_kin_full_name?: string;
    next_of_kin_phone_number?: string;

    // Include other registration fields as needed
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: (userData: loginCreds) => Promise<null | string>;
    logout: () => void;
    checkLogin: () => boolean;
    register: (userData: registerCreds) => Promise<null | string>;
    user: User | null;
    loading: boolean;
    token: string | null;
    updateStudent: (data: Partial<User>) => Promise<null | string>; // Add updateStudent
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "https://toto-academy-backend.onrender.com/api/v1/student_route";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");

            if (storedUser && storedToken) {
                const userData = JSON.parse(storedUser);

                if (userData) {
                    setUser(userData);
                    setToken(storedToken);
                    setIsAuthenticated(true);
                    const currentPath = window.location.pathname;
                    if (currentPath === "/login" || currentPath === "/register") {
                        console.log(currentPath);

                        navigate("/");
                    }
                } else {
                    clearAuthData();
                }
            }
            // if (storedUser && storedToken) {
            //     try {
            //         // Verify token with backend
            //         const response = await axios.get(`${API_BASE_URL}/verify-token`, {
            //             headers: {
            //                 Authorization: `Bearer ${storedToken}`,
            //             },
            //         });

            //         if (response.data?.data?.message === "Token is valid") {
            //             setUser(JSON.parse(storedUser));
            //             setToken(storedToken);
            //             setIsAuthenticated(true);
            //         } else {
            //             clearAuthData();
            //         }
            //     } catch (error) {
            //         clearAuthData();
            //         console.error("Token verification failed:", error);
            //     }
            // }
            setLoading(false);
        };

        const clearAuthData = () => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
        };

        initializeAuth();
    }, []);

    const checkLogin = () => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken)
            return true
        else
            return false
    }


    const login = async (credentials: loginCreds): Promise<null | string> => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: credentials.email,
                password: credentials.password,
            });
            console.log("Login response:", response.data.data);

            if (response.data?.token && response.data?.data) {
                const { token, data: userData } = response.data;

                // Store user data and token
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("token", token);

                setUser(userData);
                setToken(token);
                setIsAuthenticated(true);
                navigate("/");
                return null;
            } else {

                return response.data?.data?.message || "Login failed";
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return error.response?.data?.data?.message || "Login failed. Please try again.";
            }
            return "An unexpected error occurred during login.";
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: registerCreds): Promise<null | string> => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/signup`, {
                ...userData,
                profile_picture: 'userData.profile_picture',
                next_of_kin_full_name: 'None',
                next_of_kin_phone_number: 'None',
            });

            if (response.data?.token && response.data?.data) {
                console.log("Registration response:", response.data);

                const { token, data: userData } = response.data;

                // Store user data and token
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("token", token);

                setUser(userData);
                setToken(token);
                setIsAuthenticated(true);
                navigate("/");
                return null;
            } else {
                return response.data?.data?.message || "Registration failed";
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Registration error:", error.request.response);
                return error.response?.data?.data?.message || "Registration failed. Please try again.";
            }
            return "An unexpected error occurred during registration.";
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post(`${API_BASE_URL}/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            navigate("/login");
        }
    };

    const updateStudent = async (data: Partial<User>): Promise<null | string> => {
        if (!token || !user?._id) return "Not authenticated";
        try {
            setLoading(true);
            const response = await axios.put(
                `${API_BASE_URL}/updatestudent/${user._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data?.data) {
                const updatedUser = response.data.data;
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                return null;
            } else {
                return response.data?.message || "Update failed";
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return error.response?.data?.message || "Update failed. Please try again.";
            }
            return "An unexpected error occurred during update.";
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            login,
            logout,
            register,
            user,
            loading,
            token,
            checkLogin,
            updateStudent // Provide updateStudent
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};