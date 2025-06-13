"use client";

import { useContext, useCallback } from "react";

import { createContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Định nghĩa interface cho User
interface User {
  id: string | number;
  name: string;
  email: string;
  // Thêm các field khác mà API trả về
  [key: string]: any;
}

// Định nghĩa interface cho AuthContext
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshAuth: () => Promise<void>;
}

// Định nghĩa props cho AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthContext với type
export const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("auth");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setIsLoading(true);

        const query = new URLSearchParams(window.location.search);
        const urlToken = query.get("token");

        if (urlToken) {
          localStorage.setItem("auth", urlToken);
          // Remove token from URL without page reload
          const url = new URL(window.location.href);
          url.searchParams.delete("token");
          router.replace(url.pathname + url.search);
        }

        const token = urlToken || localStorage.getItem("auth");

        if (token) {
          const response = await axios.get("http://127.0.0.1:8000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear invalid token
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, [router, clearAuthData]);

  const login = useCallback(
    async (token: string): Promise<void> => {
      try {
        localStorage.setItem("auth", token);

        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setIsAuthenticated(true);
        router.push("/");
      } catch (error) {
        console.error("Login failed:", error);
        localStorage.removeItem("auth");
        setUser(null);
        setIsAuthenticated(false);
        throw error; // Re-throw để component có thể handle error
      }
    },
    [router]
  );

  const logout = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem("auth");
    if (!token) return;

    try {
      // Call logout API
      await axios.get("http://127.0.0.1:8000/api/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Logout API failed:", error);
      // Continue with local logout even if API fails
    } finally {
      // Always clear local state
      clearAuthData();
      router.push("/");
    }
  }, [clearAuthData, router]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, ...userData };
      }
      return prevUser;
    });
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth");
      if (token) {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error refreshing auth:", error);
      clearAuthData();
    }
  }, [clearAuthData]);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext với type safety
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
