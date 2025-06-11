"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section
      id="order"
      className="py-[60px] sm:px-16 lg:px-18 bg-[#FFF9F0] relative overflow-hidden"
    >
      {/* Background circle decor */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#FFEEDB] rounded-full z-0 opacity-30"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[240px] h-[240px] bg-[#FCE8D5] rounded-full z-0 opacity-20"></div>

      <div className="container mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-[#333333] mb-6 leading-snug"
        >
          Hãy dành những khoảnh khắc đặc biệt
          <br />
          tại <span className="text-[#A68345]">Sushi Takumi</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-[#666666] mb-10 max-w-xl mx-auto text-lg"
        >
          Chúng tôi nhận đặt bàn và đặt món mang về. Trải nghiệm hương vị Nhật
          Bản ngay tại nhà hoặc trong không gian ấm cúng của chúng tôi.
        </motion.p>
        ;
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button className="bg-[#6B5E3C] text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
            Đặt món ngay
          </button>

          <Link
            href="/dat-ban"
            className="border border-[#6B5E3C] text-[#6B5E3C] hover:bg-[#6B5E3C] hover:text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 shadow hover:shadow-md"
          >
            Đặt bàn tại đây
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
