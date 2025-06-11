"use client";

import { AuthContext } from "../../context/authContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";

interface Errors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const { login, logout } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  // Tự động login nếu cookie có token
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      login(token);
    }
  }, [login]);

  const validate = () => {
    const newErr: Errors = {};
    if (!email) {
      newErr.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErr.email = "Email không hợp lệ";
    }
    if (!password) {
      newErr.password = "Mật khẩu không được để trống";
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
      const token = res.data.access_token;

      // Lưu token vào cookie (7 ngày)
      Cookies.set("access_token", token, { expires: 7, path: "/" });

      // Gọi login context
      login(token);
    } catch (error) {
      console.log(`Lỗi ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGG = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "http://127.0.0.1:8000/api/auth/google/redirect";
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    logout();
  };

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
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9E7676]"
                  placeholder="Vui lòng nhập Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
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
                    className="text-sm text-[#9E7676] hover:text-[#666666]"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9E7676]"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-[#9E7676] border-[#E8D5C4] rounded focus:ring-[#9E7676]"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-[#666666] cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#AF763E] hover:bg-[#BD944A] text-white font-medium py-3 px-4 rounded-md transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGG}
                className="w-full inline-flex justify-center py-2 px-4 border border-[#E8D5C4] rounded-md shadow-sm bg-white text-sm font-medium text-[#594545] hover:bg-[#FFF3E4]"
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
                className="w-full inline-flex justify-center py-2 px-4 border border-[#E8D5C4] rounded-md shadow-sm bg-white text-sm font-medium text-[#594545] hover:bg-[#FFF3E4]"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-[#333333]">
              Chưa có tài khoản?{" "}
              <Link
                href="/dang-ky"
                className="text-[#666666] font-medium hover:text-[#815B5B]"
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
