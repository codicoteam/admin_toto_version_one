import { set } from "date-fns";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
    name: string,
    email: string,
    phone: string,
    password: string,
    role?: string,
    profile?: string,
    level: string,
}


interface loginCreds {
    phone: string;
    password: string;
}
interface AuthContextType {
    isAuthenticated: boolean;
    login: (userData: loginCreds) => Promise<null | string>;
    logout: () => void;
    register: (userData: User) => Promise<null | string>;
    user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();


    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        console.log(storedUser);

        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
            navigate("/");
        }
    }, []);

    const login = async (credentials: loginCreds): Promise<null | string> => {
        try {
            // Simulate login logic
            if (credentials.phone === "1234567890" && credentials.password === "password") {
                setIsAuthenticated(true);
                const userData = {
                    name: "John Doe",
                    email: "john.doe@example.com",
                    phone: credentials.phone,
                    password: credentials.password,
                    role: "user",
                    profile: "default",
                    level: "beginner",
                };
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                navigate("/");
                return null; // Ensure the return type matches Promise<null | string>
            } else {
                return "Invalid phone or password.";
            }
        } catch (error) {
            return "An error occurred during login.";
        }
    };

    const register = async (userData: User): Promise<null | string> => {
        try {
            // Simulate registration logic
            if (!userData.phone || !userData.password || !userData.email) {
                return "Phone, password, and email are required."; // Ensure return type matches Promise<null | string>
            }

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            setIsAuthenticated(true);
            navigate("/");
            return null;
        } catch (error) {
            return "An error occurred during registration.";
        }
    };

    const logout = async () => {
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, register }}>
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