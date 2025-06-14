"use client";

import { Roboto } from "next/font/google";
import "../../globals.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import dynamic from "next/dynamic";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "700"],
  adjustFontFallback: true,
});

const AuthProviderNoSSR = dynamic(
  () => import("../../context/AuthProviderWrapper"),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AuthProviderNoSSR>
          <Header />
          {children}
          <Footer />
        </AuthProviderNoSSR>
      </body>
    </html>
  );
}
