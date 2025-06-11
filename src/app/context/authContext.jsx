"use client";

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const urlToken = query.get("token");

    if (urlToken) {
      localStorage.setItem("auth", urlToken);
      router.replace(window.location.pathname); // remove ?token= from URL
    }

    const token = urlToken || localStorage.getItem("auth");
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("auth");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [router]);

  const login = (token) => {
    localStorage.setItem("auth", token);
    axios
      .get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        router.push("/");
      });
  };

  const logout = () => {
    const token = localStorage.getItem("auth");
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/logout", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((err) => {
        console.error("Logout failed", err);
      })
      .finally(() => {
        localStorage.removeItem("auth");
        setUser(null);
        router.push("/");
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
