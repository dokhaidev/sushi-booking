"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function CallToAction() {
  return (
    <section
      id="order"
      className="relative py-20 px-4 sm:px-12 md:px-20 bg-gradient-to-b from-[#FFF5E0] to-[#FFF9F0] overflow-hidden"
    >
      {/* Background blur decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#FFEEDB] rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute bottom-[-120px] right-[-80px] w-[240px] h-[240px] bg-[#FCE8D5] rounded-full opacity-20 blur-2xl"></div>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-10">
        {/* Text content */}
        <div className="text-center lg:text-left max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-[#A68345] text-white text-xs font-semibold uppercase px-3 py-1 rounded-full mb-4">
              🍣 Best Seller
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#333] leading-tight mb-4">
              Hãy dành những khoảnh khắc đặc biệt <br />
              tại <span className="text-[#A68345]">Sushi Takumi</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-[#555] text-lg mb-8"
          >
            Trải nghiệm hương vị Nhật Bản chính hiệu – từ bàn ăn tại nhà đến
            không gian tinh tế tại nhà hàng. Đặt bàn hoặc gọi món ngay!
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              href="/dat-mon"
              className="bg-gradient-to-r from-[#A68345] to-[#6B5E3C] text-white px-8 py-4 rounded-xl text-base font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300"
            >
              🍣 Đặt món ngay
            </Link>
            <Link
              href="/dat-ban"
              className="border border-[#6B5E3C] text-[#6B5E3C] px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-[#6B5E3C] hover:text-white shadow hover:shadow-md hover:scale-105"
            >
              📅 Đặt bàn tại đây
            </Link>
          </motion.div>

          <p className="text-sm text-[#888] mt-4">
            *Chúng tôi phục vụ từ 10h đến 22h hàng ngày
          </p>
        </div>

        {/* Sushi Image Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="w-full max-w-sm"
        >
          <Image
            src="https://pastaxi-manager.onepas.vn/content/uploads/articles/2amthuc/nhahang/604/sushi-nhat-ban-9.jpg"
            alt="Sushi ngon tuyệt"
            width={500}
            height={500}
            className="rounded-3xl shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
