"use client";

import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Gửi email để nhận mã xác thực
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await axios.post("http://127.0.0.1:8000/api/forgot-password", { email });
      setMessage("Mã xác thực đã được gửi đến email của bạn.");
      setStep("verify");
    } catch (err) {
      setError("Không thể gửi email. Vui lòng kiểm tra lại địa chỉ email.");
    }
  };

  // Xác thực mã OTP và đặt lại mật khẩu
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await axios.post("http://127.0.0.1:8000/api/reset-password", {
        email,
        code,
        password: newPassword,
      });
      setMessage("Đặt lại mật khẩu thành công. Bạn có thể đăng nhập lại.");
    } catch (err) {
      setError("Mã xác thực không đúng hoặc đã hết hạn.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F1E9]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#333333] mb-6">
          Quên mật khẩu
        </h1>

        {step === "request" && (
          <form onSubmit={handleEmailSubmit}>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Nhập email của bạn:
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md mb-4 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-[#AF763E] text-white py-2 rounded-md hover:bg-[#BD944A]"
            >
              Gửi mã xác thực
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleResetPassword}>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Mã xác thực đã gửi đến email:
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md mb-4 focus:outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <label className="block text-sm font-medium text-[#333333] mb-1">
              Mật khẩu mới:
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md mb-4 focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-[#AF763E] text-white py-2 rounded-md hover:bg-[#BD944A]"
            >
              Đặt lại mật khẩu
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
}
