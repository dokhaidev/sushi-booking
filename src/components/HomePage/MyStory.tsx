"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function MyStory() {
  return (
    <section
      id="about"
      className="relative py-[60px] px-6 md:px-12 lg:px-24 bg-[#FFF9F0] overflow-hidden"
    >
      {/* Background Decorative Circles */}
      <div className="absolute top-[-80px] left-[-80px] w-[180px] h-[180px] bg-[#F9E5C0] rounded-full opacity-20 z-0 blur-sm" />
      <div className="absolute bottom-[-100px] right-[-80px] w-[220px] h-[220px] bg-[#F5D9AF] rounded-full opacity-25 z-0 blur-sm" />

      <div className="relative z-10 container mx-auto flex flex-col-reverse md:flex-row items-center gap-14">
        {/* Left - Text */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="md:w-1/2 text-center md:text-left"
        >
          <h2 className="text-4xl font-bold text-[#A68345] mb-6 leading-tight tracking-tight uppercase">
            Câu chuyện của chúng tôi
          </h2>
          <div className="w-24 h-1 bg-[#C29E75] mb-8 rounded-full mx-auto md:mx-0"></div>
          <p className="text-[#333333] text-sm md:text-lg mb-5 leading-relaxed tracking-wide">
            Sushi Takumi được sinh ra từ một gia đình có ba thế hệ đầu bếp
            sushi, nơi tinh hoa ẩm thực Nhật Bản được gìn giữ và phát triển qua
            từng thế hệ.
          </p>
          <p className="text-[#333333] text-sm md:text-lg mb-8 leading-relaxed tracking-wide">
            Chúng tôi cam kết chỉ sử dụng nguyên liệu chất lượng cao nhất để tạo
            nên những món sushi tinh tế, mang lại trải nghiệm vị giác khó quên
            cho thực khách.
          </p>
          <button className="inline-flex items-center gap-2 transition-all duration-300 border border-[#A68345] text-[#A68345] hover:bg-[#A68345] hover:text-white px-6 py-3 rounded-full text-sm font-semibold shadow hover:shadow-lg">
            Tìm hiểu thêm <ChevronRight size={16} />
          </button>
        </motion.div>

        {/* Right - Image */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          viewport={{ once: true }}
          className="md:w-1/2"
        >
          <div className="relative w-full h-[400px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FBE9D0]">
            <img
              src="https://i.pinimg.com/736x/5d/80/54/5d80548dfc4bee7bb966b83c568a514b.jpg"
              alt="Đầu bếp sushi đang làm việc"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#FFEEDB] rounded-xl z-[-1] shadow-inner" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
