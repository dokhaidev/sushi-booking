import "../../globals.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { AuthProvider } from "../../context/authContext";

export const metadata = {
  title: "Sushi Takumi - Trải nghiệm sushi tuyệt hảo",
  description:
    "Thưởng thức sushi Edo chính thống được chế biến từ nguyên liệu tươi ngon và kỹ thuật điêu luyện",
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </AuthProvider>
  );
}
