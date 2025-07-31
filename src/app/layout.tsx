// src/app/layout.tsx
import "./globals.css";
import { Metadata } from "next";
import { locales, defaultLocale } from "../app/lib/i18n/config";

export const metadata: Metadata = {
  title: {
    template: "%s | Sushi Takumi",
    default: "Sushi Takumi", // Default title sẽ được ghi đè bởi layout con
  },
  description: "Website của Sushi Takumi - Nhà hàng Nhật Bản tại Việt Nam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang={defaultLocale}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
