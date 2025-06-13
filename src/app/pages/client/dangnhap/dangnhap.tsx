"use client";

import type React from "react";

import { useAuth } from "../../../context/authContext";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: string | number;
    name: string;
    email: string;
  };
}

export default function LoginPage() {
  const { login, logout, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Tự động login nếu cookie có token
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token && !user && !authLoading) {
      login(token).catch((error) => {
        console.error("Auto-login failed:", error);
        // Token invalid, remove it
        Cookies.remove("access_token");
      });
    }
  }, [login, user, authLoading]);

  const validate = (): boolean => {
    const newErr: Errors = {};
    if (!email) {
      newErr.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErr.email = "Email không hợp lệ";
    }
    if (!password) {
      newErr.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErr.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await axios.post<LoginResponse>(
        "http://127.0.0.1:8000/api/login",
        {
          email,
          password,
        }
      );

      const token = res.data.access_token;

      // Lưu token vào cookie
      const cookieOptions = {
        expires: rememberMe ? 30 : 7, // 30 days if remember me, otherwise 7 days
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
      };
      Cookies.set("access_token", token, cookieOptions);

      // Gọi login context
      await login(token);

      // Redirect will happen automatically via useEffect
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setErrors({ general: "Email hoặc mật khẩu không chính xác" });
      } else if (error.response?.status === 422) {
        setErrors({ general: "Dữ liệu không hợp lệ" });
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Đăng nhập thất bại. Vui lòng thử lại." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Save current page to redirect back after login
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = "http://127.0.0.1:8000/api/auth/google/redirect";
  };

  const handleLogout = async () => {
    try {
      Cookies.remove("access_token");
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F1E9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF763E] mx-auto"></div>
          <p className="mt-4 text-[#666666]">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is already logged in (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F1E9]">
      {/* Login Section */}
      <section className="py-[60px] sm:px-16 lg:px-24">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#333333]">Đăng nhập</h1>
            <p className="text-[#666666] mt-2">
              Đăng nhập để đặt bàn và theo dõi thẻ thành viên của bạn
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#333333] mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9E7676] ${
                    errors.email ? "border-red-300" : "border-[#E8D5C4]"
                  }`}
                  placeholder="Vui lòng nhập Email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    Mật khẩu
                  </label>
                  <Link
                    href="/quen-mat-khau"
                    className="text-sm text-[#9E7676] hover:text-[#666666] transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9E7676] ${
                    errors.password ? "border-red-300" : "border-[#E8D5C4]"
                  }`}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#9E7676] border-[#E8D5C4] rounded focus:ring-[#9E7676]"
                  disabled={loading}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-[#666666] cursor-pointer"
                >
                  Ghi nhớ đăng nhập (30 ngày)
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#AF763E] hover:bg-[#BD944A] text-white font-medium py-3 px-4 rounded-md transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang đăng nhập...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-[#E8D5C4] rounded-md shadow-sm bg-white text-sm font-medium text-[#594545] hover:bg-[#FFF3E4] transition-colors disabled:opacity-50"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="#4285F4"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                </svg>
                Google
              </button>

              <button
                type="button"
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-[#E8D5C4] rounded-md shadow-sm bg-white text-sm font-medium text-[#594545] hover:bg-[#FFF3E4] transition-colors disabled:opacity-50"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Debug section - only in development */}
            {process.env.NODE_ENV === "development" && user && (
              <div className="mt-4 pt-4 border-t border-[#E8D5C4]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Debug: Logout
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <p className="text-[#333333]">
              Chưa có tài khoản?{" "}
              <Link
                href="/dang-ky"
                className="text-[#666666] font-medium hover:text-[#815B5B] transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
