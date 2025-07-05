"use client";

import "../../globals.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import dynamic from "next/dynamic";
import MiniChat from "../../components/MiniChatApp/MiniChat";
import BackToTopButton from "../../components/BackToTopButton/BackToTopButton";
import LuckyWheel from "../../components/LuckyWheel/LuckyWheel";

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
          <BackToTopButton />
          <Footer />
          <LuckyWheel />
        </AuthProviderNoSSR>
        <MiniChat />
      </body>
    </html>
  );
}
