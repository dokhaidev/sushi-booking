"use client";
import { motion } from "framer-motion";
import { Clock, Star, Globe } from "lucide-react";

export default function History() {
  return (
    <section className="bg-[#fff] py-[60px] sm:px-16 lg:px-24">
      <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-16 items-center">
        {/* Image with animation */}
        <motion.img
          src="/img/history.jpg"
          alt="Founding"
          className="rounded-3xl shadow-xl border-4 border-[#E8D9C0]"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-[#A68345] mb-4 tracking-wide">
            Lịch Sử Hình Thành
          </h3>
          <p className="text-[#666666] leading-relaxed text-lg mb-8">
            Hành trình từ một cửa hàng nhỏ tại Tokyo đến chuỗi nhà hàng danh
            tiếng tại Việt Nam là kết tinh của đam mê, truyền thống và sáng tạo
            không ngừng nghỉ.
          </p>

          {/* Timeline milestones */}
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <Clock className="text-[#A68345] mt-1" />
              <div>
                <h4 className="text-xl font-semibold text-[#333333]">
                  1995 — Tokyo
                </h4>
                <p className="text-[#666666]">
                  Đầu bếp trưởng Takumi Yamamoto mở nhà hàng đầu tiên, mang
                  phong cách sushi thủ công độc đáo.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Globe className="text-[#A68345] mt-1" />
              <div>
                <h4 className="text-xl font-semibold text-[#333333]">
                  2015 — Sài Gòn
                </h4>
                <p className="text-[#666666]">
                  Sushi Takumi khai trương tại Việt Nam, kết nối tinh hoa Nhật
                  Bản với văn hóa ẩm thực địa phương.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Star className="text-[#A68345] mt-1" />
              <div>
                <h4 className="text-xl font-semibold text-[#333333]">
                  Hiện tại
                </h4>
                <p className="text-[#666666]">
                  Trở thành điểm đến yêu thích cho thực khách yêu mến sự tinh tế
                  của ẩm thực Nhật Bản tại Việt Nam.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
