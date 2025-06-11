// components/Footer.tsx

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer id="contact" className="bg-[#6C6F5A] text-white py-[60px] px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4">寿司匠</h3>
            <p className="text-[#E8D5C4] leading-relaxed">
              Mang đến trải nghiệm sushi tuyệt hảo giữa truyền thống và đổi mới.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Giờ mở cửa</h3>
            <p className="text-white">
              Thứ 2 - 6: 11:30 - 14:00, 17:00 - 22:00
            </p>
            <p className="text-white mt-1">
              Thứ 7, CN & ngày lễ: 12:00 - 22:00
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Liên hệ</h3>
            <p className="text-white">123 Hàm Nghi, Q.1, TP Hồ Chí Minh</p>
            <p className="text-white mt-1">Điện thoại: 024234-JQK</p>
            <p className="text-white mt-1">Email: info@sushitakumi.vn</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Theo dõi chúng tôi</h3>
            <div className="flex space-x-5">
              {[
                "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5 L17.51 6.5",
                "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
              ].map((d, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="text-white hover:text-[#E8D5C4] transition-transform transform hover:scale-110 duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hover:stroke-[#E8D5C4]"
                  >
                    <path d={d}></path>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-10 border-[#815B5B]" />

        <div className="text-center text-[#F8F1E9] text-sm">
          <p>&copy; 2025 寿司匠. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
