import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import API from "../services/api";

// Define the user object structure
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null; // User object or null if not logged in
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      // Use FormData for `x-www-form-urlencoded`
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await API.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, user: userInfo } = response.data;

      // Save token and user info to localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      // Set Authorization header for future requests
      API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setUser(userInfo); // Set the full user object
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Login failed";
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    delete API.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
