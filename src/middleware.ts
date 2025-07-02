import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Những đường dẫn cần phân quyền admin
  const adminPaths = ["/quan-tri"];

  // ✅ Lấy token và thông tin người dùng từ cookie
  const token = request.cookies.get("access_token")?.value;
  const userInfo = request.cookies.get("user_info")?.value;

  // ✅ Nếu không có token → redirect tới /dang-nhap
  if (!token) {
    return NextResponse.redirect(new URL("/dang-nhap", request.url));
  }

  // ✅ Parse user từ cookie
  let user = null;
  try {
    if (userInfo) {
      const decoded = decodeURIComponent(userInfo); // ✅ Decode trước
        user = JSON.parse(decoded); // ✅ Sau đó parse
    }
  } catch (error) {
    console.error("Lỗi parse user_info:", error);
    return NextResponse.redirect(new URL("/dang-nhap", request.url));
  }

  // ✅ Nếu vào route admin mà không phải admin → redirect về trang chủ
  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (!user || user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ✅ Nếu hợp lệ → cho phép truy cập
  return NextResponse.next();
}

// ✅ Định nghĩa matcher: áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: [
    "/quan-tri/:path*",
    // Có thể mở rộng matcher nếu cần
    // "/nguoi-dung/:path*",
    // "/don-hang/:path*",
  ],
};
