import type { Metadata } from "next";
import { Playfair_Display, Noto_Sans } from "next/font/google";
import "./globals.css";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";

// Configure display font (for headings)
const playfair = Playfair_Display({
  subsets: ["vietnamese", "latin"],
  variable: "--font-heading",
  display: "swap",
  adjustFontFallback: false,
});

// Configure base font (for body text) with Vietnamese support
const notoSans = Noto_Sans({
  subsets: ["vietnamese", "latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Sushi Takumi - Trải nghiệm sushi tuyệt hảo",
  description:
    "Thưởng thức sushi Edo chính thống được chế biến từ nguyên liệu tươi ngon và kỹ thuật điêu luyện",
  metadataBase: new URL("https://sushitakumi.vn"),
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
      <body className={`${playfair.variable} ${notoSans.variable} font-body`}>
        {/* Render Header */}
        <Header />
        {/* Render the children content */}
        {children}
        {/* Render Footer */}
        <Footer />
      </body>
    </html>
  );
}
