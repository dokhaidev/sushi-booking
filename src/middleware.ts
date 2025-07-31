import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/src/app/lib/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Bỏ qua các route không cần xử lý
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ✅ Redirect nếu thiếu locale (chỉ áp dụng cho route không phải /quan-tri)
  const isQuanTriRoute = pathname.startsWith("/quan-tri");
  if (!isQuanTriRoute) {
    const pathnameIsMissingLocale = locales.every(
      (locale) => !pathname.startsWith(`/${locale}`)
    );

    if (pathname === "/" || pathnameIsMissingLocale) {
      return NextResponse.redirect(
        new URL(`/${defaultLocale}${pathname}`, request.url)
      );
    }

    // ✅ Không phải /quan-tri và đã có locale → tiếp tục
    return NextResponse.next();
  }

  // ✅ Xử lý riêng cho route /quan-tri (không dùng locale)
  const token = request.cookies.get("access_token")?.value;
  const userInfo = request.cookies.get("user_info")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/dang-nhap", request.url));
  }

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

  // ✅ Phân quyền theo vai trò
  // ✅ Phân quyền theo vai trò
  // Admin và Manager có thể vào tất cả các trang quản trị
  if (role === "admin" || role === "manager") {
    return NextResponse.next()
  }

  // Chef chỉ được vào trang /quan-tri/nhan-vien/bep
  if (role === "chef") {
    if (pathname.startsWith("/quan-tri/nhan-vien/bep")) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL("/quan-tri/nhan-vien/bep", request.url))
    }
  }

  // Staff chỉ được vào trang /quan-tri/nhan-vien/ban
  if (role === "staff") {
    if (pathname.startsWith("/quan-tri/nhan-vien/ban")) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL("/quan-tri/nhan-vien/ban", request.url))
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // ✅ Middleware áp dụng cho:
    // - /quan-tri/:path* → để phân quyền
    // - "/" và các route thiếu locale → để redirect
    "/quan-tri/:path*",
    "/",
    "/((?!_next|.*\\..*|api|quan-tri).*)", // route còn lại không thuộc /quan-tri
  ],
};
