// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Sushi Takumi",
  description: "Website của Sushi Takumi - Nhà hàng Nhật Bản tại Việt Nam",
};

// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

