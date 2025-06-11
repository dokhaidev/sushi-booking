"use client";

import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/forgot-password",
        { email }
      );
      setMessage("Vui lòng kiểm tra email để đặt lại mật khẩu.");
    } catch (err: any) {
      setError("Không thể gửi email. Vui lòng kiểm tra lại địa chỉ email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F1E9]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#333333] mb-6">
          Quên mật khẩu
        </h1>
        <form onSubmit={handleSubmit}>
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
            Gửi yêu cầu
          </button>
        </form>
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
}
