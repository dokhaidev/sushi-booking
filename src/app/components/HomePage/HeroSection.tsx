// app/page.tsx hoặc pages/index.tsx nếu dùng Pages Router

"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative bg-[#FAF4EC] overflow-hidden py-24 sm:px-16 lg:px-18">
        {/* Decor Background Circles */}
        <div className="absolute top-[-80px] left-[-80px] w-[250px] h-[250px] bg-[#F7DED0] rounded-full opacity-30 z-0" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#E4B7A0] rounded-full opacity-20 z-0" />

        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-16">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="md:w-1/2 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#333333] leading-tight mb-6">
              <span className="block">SUSHI TRUYỀN THỐNG</span>
              <span className="text-[#A68345]">GIAO HÒA HIỆN ĐẠI</span>
            </h1>
            <p className="text-[#666666] text-lg leading-relaxed max-w-md mx-auto md:mx-0 mb-8">
              Tận hưởng tinh hoa ẩm thực Nhật Bản với nguyên liệu tươi sống, kỹ
              thuật tinh xảo và không gian đậm chất Edo.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="/menu"
                className="bg-[#A68345] hover:bg-[#BD944A] text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300"
              >
                Xem thực đơn
              </a>
              <a
                href="/datban"
                className="border-2 border-[#A68345] text-[#A68345] hover:bg-[#A68345] hover:text-white px-6 py-3 rounded-full transition-all duration-300"
              >
                Đặt bàn
              </a>
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="md:w-1/2 relative"
          >
            <div className="rounded-[2rem] overflow-hidden shadow-2xl border-[10px] border-[#F7DED0]">
              <img
                src="https://i.pinimg.com/736x/ec/75/1f/ec751f453b9bd675a91ef0faaa8890fd.jpg"
                alt="Sushi nghệ thuật"
                className="object-cover w-full h-full max-h-[550px]"
              />
            </div>

            {/* Gradient Light Effect */}
            <div className="absolute top-[-40px] right-[-40px] w-40 h-40 bg-gradient-to-br from-[#FCEEE3] to-[#F8D6C5] rounded-full blur-2xl opacity-50 z-[-1]" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
