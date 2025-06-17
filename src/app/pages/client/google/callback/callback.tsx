"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../context/authContext";
import Cookies from "js-cookie";

function GoogleCallbackContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        console.error("Google auth error:", error);
        router.push(
          `/dang-nhap?error=${encodeURIComponent("Đăng nhập Google thất bại")}`
        );
        return;
      }

      if (token) {
        try {
          // Lưu token vào cookie với cùng cấu hình như login thường
          const cookieOptions = {
            expires: 7, // 7 days default
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
          };
          Cookies.set("access_token", token, cookieOptions);

          // Gọi login context để cập nhật state
          await login(token);

          // Kiểm tra nếu có redirect URL đã lưu
          const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
          if (redirectUrl && redirectUrl !== "/dang-nhap") {
            sessionStorage.removeItem("redirectAfterLogin");
            router.push(redirectUrl);
          } else {
            // Chuyển về trang chủ
            router.push("/");
          }
        } catch (error) {
          console.error("Error processing Google login:", error);
          router.push(
            `/dang-nhap?error=${encodeURIComponent(
              "Có lỗi xảy ra khi đăng nhập"
            )}`
          );
        }
      } else {
        // Không có token, chuyển về trang đăng nhập
        router.push(
          `/dang-nhap?error=${encodeURIComponent(
            "Không nhận được thông tin đăng nhập"
          )}`
        );
      }
    };

    handleCallback();
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen bg-[#F8F1E9] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF763E] mx-auto"></div>
        <p className="mt-4 text-[#666666]">Đang xử lý đăng nhập Google...</p>
        <p className="mt-2 text-sm text-[#888888]">
          Vui lòng chờ trong giây lát
        </p>
      </div>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F1E9] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF763E] mx-auto"></div>
            <p className="mt-4 text-[#666666]">Đang tải...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
