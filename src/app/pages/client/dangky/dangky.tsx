"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NotificationPopup from "@/src/app/components/layout/NotificationPopup";

export default function RegisterPage() {
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [cfPass, setCfPass] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  // Real-time validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (touched.name && !data.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }

    if (touched.email) {
      if (!data.email.trim()) {
        newErrors.email = "Vui lòng nhập địa chỉ email";
      } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        newErrors.email = "Địa chỉ email không hợp lệ";
      }
    }

    if (touched.phone) {
      if (!data.phone.trim()) {
        newErrors.phone = "Vui lòng nhập số điện thoại";
      } else if (!/^\d{10,}$/.test(data.phone)) {
        newErrors.phone = "Số điện thoại phải có ít nhất 10 chữ số";
      }
    }

    if (touched.password) {
      if (!data.password) {
        newErrors.password = "Vui lòng nhập mật khẩu";
      } else if (data.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      }
    }

    if (touched.cfPass || (touched.password && cfPass)) {
      if (data.password && cfPass && data.password !== cfPass) {
        newErrors.cfPass = "Mật khẩu không khớp";
      }
    }

    if (touched.agreeTerms && !agreeTerms) {
      newErrors.agreeTerms = "Vui lòng đồng ý với điều khoản dịch vụ";
    }

    setErrors(newErrors);
  }, [data, cfPass, agreeTerms, touched]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched to show all possible errors
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      cfPass: true,
      agreeTerms: true,
    });

    // Check if there are any errors
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) return;

    setIsSubmitting(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/register", {
        ...data,
        subscribe,
      });

      // Show success notification
      setShowSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/dang-nhap");
      }, 3000);
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      // Handle API errors (like duplicate email)
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          submit: "Đăng ký không thành công. Vui lòng thử lại sau.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-amber-50">
      {/* Success Notification */}
      {showSuccess && (
        <NotificationPopup
          message="Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập..."
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Main Content */}
      <div className="container mx-auto py-[60px] px-4 md:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Image Section */}
          <div className="hidden lg:block w-full lg:w-[60%] relative">
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-amber-500/10 z-10"></div>
              <Image
                src="https://kenh14cdn.com/thumb_w/700/2017/mnmnhat27-1507112465320.jpg"
                alt="Sushi đẹp"
                layout="fill"
                objectFit="fill"
                className="opacity-90"
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-[40%]">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-red-100 w-full mx-auto">
              {/* Decorative top border */}
              <div className="h-1 bg-gradient-to-r from-red-500 to-amber-500"></div>
              <div className="p-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-[#AF763E] mb-2">
                    Tạo tài khoản mới
                  </h1>
                  <p className="text-[#333333]">
                    Điền thông tin để đăng ký tài khoản
                  </p>
                </div>

                {errors.submit && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-[#333333] mb-1"
                    >
                      Họ và tên
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent ${
                          errors.name
                            ? "border-red-300 bg-red-50"
                            : "border-red-200"
                        }`}
                        placeholder="Nguyễn Văn A"
                        value={data.name}
                        onChange={(e) =>
                          setData({ ...data, name: e.target.value })
                        }
                        onBlur={() => handleBlur("name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#333333] mb-1"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent ${
                          errors.email
                            ? "border-red-300 bg-red-50"
                            : "border-red-200"
                        }`}
                        placeholder="email@example.com"
                        value={data.email}
                        onChange={(e) =>
                          setData({ ...data, email: e.target.value })
                        }
                        onBlur={() => handleBlur("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-[#333333] mb-1"
                    >
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent ${
                          errors.phone
                            ? "border-red-300 bg-red-50"
                            : "border-red-200"
                        }`}
                        placeholder="0987654321"
                        value={data.phone}
                        onChange={(e) =>
                          setData({ ...data, phone: e.target.value })
                        }
                        onBlur={() => handleBlur("phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[#333333] mb-1"
                    >
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="password"
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent ${
                          errors.password
                            ? "border-red-300 bg-red-50"
                            : "border-red-200"
                        }`}
                        placeholder="••••••••"
                        value={data.password}
                        onChange={(e) =>
                          setData({ ...data, password: e.target.value })
                        }
                        onBlur={() => handleBlur("password")}
                      />
                    </div>
                    {errors.password ? (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">
                        Mật khẩu phải có ít nhất 6 ký tự
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-[#333333] mb-1"
                    >
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent ${
                          errors.cfPass
                            ? "border-red-300 bg-red-50"
                            : "border-red-200"
                        }`}
                        placeholder="••••••••"
                        value={cfPass}
                        onChange={(e) => setCfPass(e.target.value)}
                        onBlur={() => handleBlur("cfPass")}
                      />
                    </div>
                    {errors.cfPass && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.cfPass}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start pt-2">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        className="h-4 w-4 text-[#AF763E] focus:ring-red-500 border-red-300 rounded"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);
                          handleBlur("agreeTerms");
                        }}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-[#333333]">
                        Tôi đồng ý với{" "}
                        <a
                          href="#"
                          className="text-amber-700 hover:text-amber-800 underline"
                        >
                          Điều khoản dịch vụ
                        </a>{" "}
                        và{" "}
                        <a
                          href="#"
                          className="text-amber-700 hover:text-amber-800 underline"
                        >
                          Chính sách bảo mật
                        </a>
                      </label>
                      {errors.agreeTerms && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.agreeTerms}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="newsletter"
                        type="checkbox"
                        className="h-4 w-4 text-[#AF763E] focus:ring-red-500 border-red-300 rounded"
                        checked={subscribe}
                        onChange={(e) => setSubscribe(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="newsletter" className="text-[#333333]">
                        Tôi muốn nhận thông tin về ưu đãi và sự kiện đặc biệt
                        qua email
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#AF763E] hover:bg-[#BD944A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-[#333333]">
                    Đã có tài khoản?{" "}
                    <Link
                      href="/dang-nhap"
                      className="font-medium text-amber-700 hover:text-amber-800"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section - Mobile */}
      <section className="lg:hidden py-12 px-4 bg-gradient-to-r from-red-50 to-amber-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#333333] mb-8 text-center">
            Lợi ích khi đăng ký tài khoản
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm text-center border border-red-100">
              <div className="w-16 h-16 bg-[#AF763E] rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                Tích điểm ưu đãi
              </h3>
              <p className="text-sm text-[#333333]">
                Tích điểm với mỗi đơn hàng và đổi điểm để nhận các ưu đãi đặc
                biệt
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm text-center border border-red-100">
              <div className="w-16 h-16 bg-[#AF763E] rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                Đặt hàng nhanh chóng
              </h3>
              <p className="text-sm text-[#333333]">
                Lưu địa chỉ và phương thức thanh toán để đặt hàng nhanh chóng
                hơn
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm text-center border border-red-100">
              <div className="w-16 h-16 bg-[#AF763E] rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                Thông báo ưu đãi
              </h3>
              <p className="text-sm text-[#333333]">
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
