"use client";

import Header from "../../../components/home/Header";
import Sidebar from "../../../components/home/Sidebar";
import dynamic from "next/dynamic";
import "../../../globals.css";

const AuthProviderNoSSR = dynamic(
  () => import("../../../context/AuthProviderWrapper"),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="text-[1em]">
        <div className="flex min-h-screen">
          <AuthProviderNoSSR>
            {/* Sidebar bên trái */}
            <aside className="w-64">
              <Sidebar />
            </aside>

            {/* Phần còn lại gồm Header + Main */}
            <div className="flex-1 flex flex-col">
              <header>
                <Header />
              </header>
              <main className="min-h-[300px] bg-gray-50 p-6">{children}</main>
            </div>
          </AuthProviderNoSSR>
        </div>
      </body>
    </html>
  );
}
