"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="relative bg-[#F8F1E9] py-[60px] sm:px-16 lg:px-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 -top-32 w-64 h-64 rounded-full bg-[#F3D9CB] opacity-20 blur-xl" />
        <div className="absolute -right-40 bottom-1/3 w-80 h-80 rounded-full bg-[#A56748] opacity-10 blur-xl" />
        <div className="absolute right-1/4 top-1/4 w-40 h-40 rounded-full bg-[#6B392A] opacity-10 blur-xl" />
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-24 relative z-10">
        {/* Image Stack */}
        <motion.div
          className="w-full lg:w-1/2 relative flex justify-center h-[520px]"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Image */}
          <div className="absolute left-10 top-2 w-[320px] h-[420px] rounded-[20px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-[10px] border-white/95 rotate-[-4deg] z-20 hover:rotate-0 transition-all duration-500 will-change-transform">
            <Image
              src="https://images.unsplash.com/photo-1724115890005-a610449d9ab7?w=1000&auto=format&fit=crop&q=80"
              alt="Sushi Roll"
              width={700}
              height={700}
              className="object-cover w-full h-full transition-all duration-700 hover:scale-105"
              priority
            />
          </div>

          {/* Secondary Image */}
          <div className="absolute right-10 bottom-2 w-[300px] h-[380px] rounded-[18px] overflow-hidden shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] border-[8px] border-white/95 rotate-[6deg] z-10 hover:rotate-0 hover:scale-105 transition-all duration-500 will-change-transform">
            <Image
              src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1000&auto=format&fit=crop&q=80"
              alt="Sushi Dish"
              width={700}
              height={700}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {/* Decorative Element */}
          <div className="absolute left-6 bottom-0 w-[180px] h-[180px] rounded-full overflow-hidden shadow-lg border-[5px] border-white/90 z-30 rotate-[-10deg] hover:rotate-0 transition-all duration-700">
            <Image
              src="https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHN1c2hpfGVufDB8fDB8fHww"
              alt="Japanese Ingredients"
              width={350}
              height={350}
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left max-w-2xl"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className="text-sm tracking-[0.3em] uppercase text-[#A68345] font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Nhà hàng của chúng tôi
          </motion.p>

          <motion.h2
            className="text-3xl sm:text-4 xl lg:text-[3.5rem] font-medium text-[#333333] uppercase mb-8 leading-[1.15]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className="block">Chúng tôi yêu thích</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68345] to-[#A68345]">
              ẩm thực Nhật Bản truyền thống
            </span>
          </motion.h2>

          <motion.p
            className="text-[#666666] text-lg mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Nếu bạn là người đam mê ẩm thực, đừng bỏ lỡ những món ăn mang đậm
            bản sắc Nhật Bản, được chế biến bởi các đầu bếp tài năng với tình
            yêu và sự tỉ mỉ.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-[#F3D9CB] px-6 py-5 rounded-xl text-[#4B3325] text-sm leading-relaxed shadow-sm backdrop-blur-sm border border-white/50 hover:shadow-md transition-all">
              <p className="font-medium">
                Thứ Hai - Thứ Sáu:{" "}
                <strong className="text-[#333333]">9 AM – 10 PM</strong>
              </p>
              <p className="font-medium">
                Thứ Bảy: <strong className="text-[#333333]">9 AM – 8 PM</strong>
              </p>
            </div>

            <div className="bg-white px-6 py-5 rounded-xl text-[#4B3325] text-sm leading-relaxed shadow-sm backdrop-blur-sm border border-white/50 hover:shadow-md transition-all">
              <p className="font-medium">
                Chủ Nhật:{" "}
                <strong className="text-[#333333]">10 AM – 6 PM</strong>
              </p>
              <p className="font-medium">
                Ngày lễ:{" "}
                <strong className="text-[#333333]">11 AM – 5 PM</strong>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <button className="relative overflow-hidden group mt-2 bg-[#8E9482] text-white hover:bg-[#7a5e5e] px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1">
              <span className="relative z-10 flex items-center justify-center gap-2 font-medium tracking-wide">
                <span>Khám phá thực đơn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#8A4A32] to-[#6B392A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
