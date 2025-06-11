"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [cfPass, setCfPass] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErr: any = {};
    if (!data.email) {
      newErr.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErr.email = "email không hợp lệ";
    }
    if (!data.password) {
      newErr.password = "Mật khẩu không được để trống";
    } else if (data.password.length < 6) {
      newErr.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (data.password !== cfPass) {
      newErr.password = "Mật khẩu không khớp";
    }
    if (!data.name) {
      newErr.name = "Tên không được để trống";
    }
    if (!data.phone) {
      newErr.phone = "Số điện thoại không được để trống";
    } else if (data.phone.length < 10) {
      newErr.phone = "Số điện thoại có ít nhất 10 ký tự";
    }
    if (!agreeTerms) {
      newErr.agreeTerms = "Bạn cần đồng ý với điều khoản dịch vụ";
    }
    if (!subscribe) {
      newErr.subscribe = "Bạn cần đồng ý nhận thông tin về ưu đãi qua email";
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.post("http://127.0.0.1:8000/api/register", data);
      router.push("/dang-nhap");
    } catch (e) {
      console.log(`Lỗi: ${e}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F1E9]">
      <section className="py-[60px] sm:px-16 lg:px-24">
        <div className="container mx-auto max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#333333]">
              Đăng ký tài khoản
            </h1>
            <p className="text-[#666666] mt-2">
              Tạo tài khoản để đặt món và nhận ưu đãi đặc biệt
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-[#594545] mb-1"
                >
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9E7676]"
                  placeholder="Vui lòng nhập họ tên"
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
                {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#594545] mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9E7676]"
                  placeholder="Vui lòng nhập Email"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-[#333333] mb-1"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9E7676]"
                  placeholder="Vui lòng nhập số điện thoại"
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
                {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#333333] mb-1"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9E7676]"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
                {errors.password && (
                  <p style={{ color: "red" }}>{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-[#666666]">
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường
                  và số
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[#666666] mb-1"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9E7676]"
                  placeholder="••••••••"
                  onChange={(e) => setCfPass(e.target.value)}
                />
                {errors.password && (
                  <p style={{ color: "red" }}>{errors.password}</p>
                )}
              </div>

              <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-[#9E7676] border-[#E8D5C4] rounded focus:ring-[#9E7676]"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-[#333333]">
                    Tôi đồng ý với{" "}
                    <a
                      href="#"
                      className="text-[#333333] hover:text-[#815B5B] underline"
                    >
                      Điều khoản dịch vụ
                    </a>{" "}
                    và{" "}
                    <a
                      href="#"
                      className="text-[#333333] hover:text-[#815B5B] underline"
                    >
                      Chính sách bảo mật
                    </a>
                  </label>
                  {errors.agreeTerms && (
                    <p style={{ color: "red" }}>{errors.agreeTerms}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    type="checkbox"
                    className="h-4 w-4 text-[#9E7676] border-[#E8D5C4] rounded focus:ring-[#9E7676]"
                    checked={subscribe}
                    onChange={(e) => setSubscribe(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newsletter" className="text-[#333333]">
                    Tôi muốn nhận thông tin về ưu đãi và sự kiện đặc biệt qua
                    email
                  </label>
                  {errors.subscribe && (
                    <p style={{ color: "red" }}>{errors.subscribe}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-6 text-white bg-[#AF763E] rounded-lg hover:bg-[#BD944A]"
              >
                Đăng ký
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-[#333333]">
              Đã có tài khoản?{" "}
              <Link
                href="/dang-nhap"
                className="text-[#666666] font-medium hover:text-[#815B5B]"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 bg-[#FFF3E4]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-[#594545] mb-8 text-center">
            Lợi ích khi đăng ký tài khoản
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-[#9E7676] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#594545] mb-2">
                Tích điểm ưu đãi
              </h3>
              <p className="text-sm text-[#815B5B]">
                Tích điểm với mỗi đơn hàng và đổi điểm để nhận các ưu đãi đặc
                biệt
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-[#9E7676] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#594545] mb-2">
                Đặt hàng nhanh chóng
              </h3>
              <p className="text-sm text-[#815B5B]">
                Lưu địa chỉ và phương thức thanh toán để đặt hàng nhanh chóng
                hơn
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-[#9E7676] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#594545] mb-2">
                Thông báo ưu đãi
              </h3>
              <p className="text-sm text-[#815B5B]">
                Nhận thông báo về các chương trình khuyến mãi và sự kiện đặc
                biệt
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
