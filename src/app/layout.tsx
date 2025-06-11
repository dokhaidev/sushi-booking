// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sushi Takumi",
  description: "Website của Sushi Takumi - Nhà hàng Nhật Bản tại Việt Nam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
