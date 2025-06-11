"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const sushiList = [
  {
    src: "https://plus.unsplash.com/premium_photo-1668146927669-f2edf6e86f6f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3VzaGl8ZW58MHx8MHx8fDA%3D",
    title: "Chirashi (ちらし寿司) – Sushi rải",
  },
  {
    src: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VzaGl8ZW58MHx8MHx8fDA%3D",
    title: "Chirashi (ちらし寿司) – Sushi rải",
  },
  {
    src: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3VzaGl8ZW58MHx8MHx8fDA%3D",
    title: "Chirashi (ちらし寿司) – Sushi rải",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1668146932065-d08643791942?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHN1c2hpfGVufDB8fDB8fHww",
    title: "Chirashi (ちらし寿司) – Sushi rải",
  },
  {
    src: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHN1c2hpfGVufDB8fDB8fHww",
    title: "Chirashi (ちらし寿司) – Sushi rải",
  },
  {
    src: "https://images.unsplash.com/photo-1563612116625-3012372fccce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHN1c2hpfGVufDB8fDB8fHww",
    title: "Chirashi (ちらし寿司) – Sushi rải",
  },
];

export default function FavoriteSushiSection() {
  return (
    <section className="bg-[#ffffff] py-[60px] px-4 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        {/* Tiêu đề với 2 gạch ngang hai bên */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <div className="h-px w-16 md:w-24 bg-[#432D1F]"></div>
            <h2 className="text-xl md:text-3xl font-bold tracking-widest text-[#432D1F] uppercase">
              Khách hàng yêu thích
            </h2>
            <div className="h-px w-16 md:w-24 bg-[#432D1F]"></div>
          </div>
          <p className="text-[#666666] mt-2 text-sm md:text-base">
            Những món sushi được yêu thích và lựa chọn nhiều nhất bởi thực khách
          </p>
        </motion.div>

        {/* Grid of sushi cards */}
        <div className="columns-3 gap-6 mb-20">
          {sushiList.map((sushi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-md mb-6"
              style={{
                height: 280,
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={sushi.src.trim()}
                  alt={sushi.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-2xl"
                />
                <button
                  className="absolute left-1/2 bottom-[10px] transform -translate-x-1/2
                 text-white font-medium text-sm
                 rounded-[30px]
                 w-[90%]
                 py-2
                 bg-gradient-to-r from-[#000000] to-[#666666]
                 hover:from-[#222222] hover:to-[#888888]
                 transition-colors duration-300
                 shadow-lg"
                >
                  {sushi.title}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-[#AF763E] text-white rounded-3xl px-6 py-14 overflow-hidden flex flex-col items-center text-center max-w-4xl mx-auto shadow-lg"
        >
          {/* Ảnh nền mờ phía sau */}
          <div className="absolute inset-0 z-0 opacity-40">
            <Image
              src="https://plus.unsplash.com/premium_photo-1668146932065-d08643791942?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHN1c2hpfGVufDB8fDB8fHww"
              alt="Background texture"
              fill
              className="object-cover"
            />
          </div>

          {/* Nội dung chính */}
          <div className="z-10 max-w-xl">
            <h3 className="text-3xl font-bold mb-6 leading-snug">
              MÓN TỐI YÊU THÍCH KHIẾN BẠN THÊM MÃI KHÔNG THÔI
            </h3>
            <p className="text-base mb-8 max-w-110 mx-auto">
              Khám phá 88 công thức món tối thơm ngon, dễ làm, đậm đà hương vị
              và được cả gia đình yêu thích.
            </p>
            <button className="bg-white text-[#C06526] font-semibold px-8 py-3 rounded-full hover:bg-orange-100 transition-shadow duration-300 shadow-md">
              Xem công thức ngay
            </button>
          </div>

          {/* Hình tròn bên trái */}
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full border-10 border-[#FFECEC] overflow-hidden z-10">
            <Image
              src="https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHN1c2hpfGVufDB8fDB8fHww"
              alt="Decorative left circle"
              fill
              className="object-cover"
            />
          </div>

          {/* Hình tròn bên phải */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border-10 border-[#FFECEC] overflow-hidden z-10">
            <Image
              src="https://plus.unsplash.com/premium_photo-1675453377179-22d446fe10ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fHN1c2hpfGVufDB8fDB8fHww"
              alt="Decorative right circle"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
