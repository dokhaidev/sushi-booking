import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Lấy token và user_info từ cookie
  const token = request.cookies.get("access_token")?.value;
  const userInfo = request.cookies.get("user_info")?.value;

  // ✅ Nếu không có token → chuyển đến /dang-nhap
  if (!token) {
    return NextResponse.redirect(new URL("/dang-nhap", request.url));
  }

  // ✅ Parse user_info
  let user = null;
  try {
    if (userInfo) {
      const decoded = decodeURIComponent(userInfo);
      user = JSON.parse(decoded);
    }
  } catch (error) {
    console.error("Lỗi parse user_info:", error);
    return NextResponse.redirect(new URL("/dang-nhap", request.url));
  }

  const role = user?.role;

  // ================================
  // ✅ VALIDATE ROLE ACCESS CONTROL
  // ================================

  if (pathname.startsWith("/quan-tri")) {
    // ✅ Chef chỉ được vào /quan-tri/nhan-vien
    if (role === "chef" && !pathname.startsWith("/quan-tri/nhan-vien")) {
      return NextResponse.redirect(new URL("/quan-tri/nhan-vien/bep", request.url));
    }

    // ✅ Manager chỉ được vào /quan-tri/nhan-vien và /quan-tri/quan-ly
    if (
      role === "manager" &&
      !pathname.startsWith("/quan-tri/nhan-vien") &&
      !pathname.startsWith("/quan-tri/quan-ly")
    ) {
      return NextResponse.redirect(new URL("/quan-tri/quan-ly/nguoi-dung", request.url));
    }

    // ✅ Các vai trò không hợp lệ (không phải admin, manager, chef)
    if (!["admin", "manager", "chef"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // ✅ Những path còn lại (ngoài nhan-vien và quan-ly) → chỉ admin được phép
    if (
      !pathname.startsWith("/quan-tri/nhan-vien") &&
      !pathname.startsWith("/quan-tri/quan-ly") &&
      role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/quan-tri/:path*"],
};
