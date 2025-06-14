"use client";

import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Định nghĩa interface cho User
interface User {
  id: string | number;
  name: string;
  email: string;
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

// Props cho AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create context
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const clearAuthData = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setIsLoading(true);

        let token = null;

        if (typeof window !== "undefined") {
          const query = new URLSearchParams(window.location.search);
          const urlToken = query.get("token");

          if (urlToken) {
            localStorage.setItem("auth", urlToken);

            // Xóa token khỏi URL
            const url = new URL(window.location.href);
            url.searchParams.delete("token");
            window.history.replaceState({}, "", url.pathname + url.search);

            token = urlToken;
          } else {
            token = localStorage.getItem("auth");
          }
        }

        if (token) {
          const response = await axios.get("http://127.0.0.1:8000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
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
        if (typeof window !== "undefined") {
          localStorage.setItem("auth", token);
        }

        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setIsAuthenticated(true);
        router.push("/");
      } catch (error) {
        console.error("Login failed:", error);
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth");
        }
        setUser(null);
        setIsAuthenticated(false);
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(async (): Promise<void> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth") : null;
    if (!token) return;

    try {
      await axios.get("http://127.0.0.1:8000/api/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      clearAuthData();
      router.push("/");
    }
  }, [clearAuthData, router]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : prevUser));
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("auth") : null;
      if (token) {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        clearAuthData();
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

// Hook dùng để lấy auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
