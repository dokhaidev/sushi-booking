"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import "../../styles/footer-animations.css";

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#", color: "hover:bg-[#3b5998]" },
  {
    name: "Instagram",
    icon: Instagram,
    href: "#",
    color: "hover:bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
  },
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:bg-[#1da1f2]" },
];

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById("sushi-footer");
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      id="sushi-footer"
      className="relative bg-[#464132] text-white overflow-hidden border-t border-[#e6d5b8]/20"
    >
      {/* Japanese wave pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/images/japanese-wave.png')] bg-repeat opacity-20"></div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        {/* Logo and tagline */}
        <div
          className={`flex flex-col items-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-[#AF763E] rounded-full flex items-center justify-center mr-3 shadow-lg">
              <span className="text-2xl">🍣</span>
            </div>
            <h2 className="text-3xl font-bold text-[#e6d5b8] font-japanese tracking-wider">
              寿司匠
            </h2>
          </div>
          <p className="text-center text-[#e6d5b8]/80 max-w-md font-light">
            Nghệ thuật sushi truyền thống Nhật Bản với sự tinh tế và hoàn hảo
            trong từng chi tiết
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Location */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.1s" }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-[#e6d5b8] border-b border-[#e6d5b8]/30 pb-2">
              <MapPin className="mr-2 text-[#AF763E]" size={18} />
              Địa chỉ nhà hàng
            </h3>
            <address className="not-italic text-[#e6d5b8]/80 space-y-2">
              <p className="flex items-start">
                <span className="text-[#AF763E] mr-2">〒</span>
                <span>
                  123 Hàm Nghi, Quận 1<br />
                  TP Hồ Chí Minh
                </span>
              </p>
              <div className="pt-2">
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 text-[#AF763E]" size={14} />
                  <span>Giờ mở cửa:</span>
                </div>
                <div className="pl-6 text-sm mt-1">
                  <p>11:30 - 14:00 (Trưa)</p>
                  <p>17:00 - 22:00 (Tối)</p>
                </div>
              </div>
            </address>
          </div>

          {/* Quick links */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#e6d5b8] border-b border-[#e6d5b8]/30 pb-2">
              Thực đơn & Dịch vụ
            </h3>
            <ul className="space-y-3 text-[#e6d5b8]/80">
              <li>
                <Link
                  href="/menu"
                  className="hover:text-[#AF763E] transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[#AF763E] rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  <span>Sushi Omakase</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-[#AF763E] transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[#AF763E] rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  <span>Set Menu cao cấp</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/reservation"
                  className="hover:text-[#AF763E] transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[#AF763E] rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  <span>Đặt bàn Itamae Counter</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-[#AF763E] transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-[#AF763E] rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  <span>Sự kiện đặc biệt</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.3s" }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#e6d5b8] border-b border-[#e6d5b8]/30 pb-2">
              Liên hệ
            </h3>
            <div className="space-y-4 text-[#e6d5b8]/80">
              <div className="flex items-start group">
                <Phone
                  className="mr-2 text-[#AF763E] mt-0.5 group-hover:scale-110 transition-transform"
                  size={16}
                />
                <div>
                  <p className="font-medium group-hover:text-[#AF763E] transition-colors">
                    Điện thoại: 024 234 JQK
                  </p>
                </div>
              </div>
              <div className="flex items-start group">
                <Mail
                  className="mr-2 text-[#AF763E] mt-0.5 group-hover:scale-110 transition-transform"
                  size={16}
                />
                <div>
                  <p className="font-medium group-hover:text-[#AF763E] transition-colors">
                    Email: info@sushitakumi.vn
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <h4 className="text-sm font-semibold text-[#e6d5b8] mb-3">
                  Kết nối với chúng tôi
                </h4>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      className={`w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#e6d5b8] transition-all ${social.color} hover:text-white`}
                      aria-label={social.name}
                    >
                      <social.icon size={16} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.4s" }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#e6d5b8] border-b border-[#e6d5b8]/30 pb-2">
              Nhận tin khuyến mãi
            </h3>
            <p className="text-[#e6d5b8]/80 mb-4 font-light">
              Đăng ký để nhận thông tin ưu đãi đặc biệt và sự kiện độc quyền
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#e6d5b8]/20 rounded-sm focus:outline-none focus:border-[#AF763E] text-white placeholder-[#e6d5b8]/50"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#AF763E] text-white font-medium py-2 px-4 rounded-sm transition-all transform hover:scale-[1.02] flex items-center justify-center"
              >
                <span className="mr-2">Đăng ký</span>
                <span>→</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`border-t border-[#e6d5b8]/10 pt-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "0.5s" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#e6d5b8]/50 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} 寿司匠 Sushi Takumi. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-[#e6d5b8]/50 hover:text-[#AF763E] text-sm transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="/terms"
                className="text-[#e6d5b8]/50 hover:text-[#AF763E] text-sm transition-colors"
              >
                Điều khoản sử dụng
              </Link>
              <Link
                href="/sitemap"
                className="text-[#e6d5b8]/50 hover:text-[#AF763E] text-sm transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🍣", "🍱", "🍙", "🍤", "🥢"].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-xl opacity-10 animate-float"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 3}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
