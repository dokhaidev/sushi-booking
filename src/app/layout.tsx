import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { AuthProvider } from "../context/authContext";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "700"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Sushi Takumi - Trải nghiệm sushi tuyệt hảo",
  description:
    "Thưởng thức sushi Edo chính thống được chế biến từ nguyên liệu tươi ngon và kỹ thuật điêu luyện",
  metadataBase: new URL("https://sushitakumi.vn"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Sushi Takumi - Trải nghiệm sushi tuyệt hảo",
    description:
      "Thưởng thức sushi Edo chính thống được chế biến từ nguyên liệu tươi ngon và kỹ thuật điêu luyện",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className="scroll-smooth">
      <body className={`${roboto.variable} font-body`}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
