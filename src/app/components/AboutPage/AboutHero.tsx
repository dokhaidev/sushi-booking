"use client";
import { motion } from "framer-motion";
import { Salsa } from "next/font/google";
import Link from "next/link";

const salsa = Salsa({ subsets: ["latin"], weight: "400" });

export default function AboutHero() {
  return (
    <section className="relative bg-[url('/img/about-us-banner.png')] bg-cover bg-center min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Overlay gradient and dark layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-0" />

      {/* Optional: Light rays effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)] z-0" />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center text-white px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Title */}
        <motion.h1
          className="
            text-[70px] sm:text-[90px] md:text-[120px] lg:text-[140px]
            font-bold tracking-wide text-[#A68345]
          "
          style={{
            fontFamily: salsa.style.fontFamily,
            WebkitTextStroke: "0.1px #F8F1E9",
            textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          SUSHI TAKUMI
        </motion.h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-[20px] text-[#F8F1E9] mb-8 drop-shadow-sm">
          Hành trình mang tinh hoa ẩm thực Nhật Bản đến trái tim Sài Gòn.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/menu">
            <motion.button
              className="px-6 py-3 bg-[#A68345] text-white rounded-full text-sm font-semibold hover:bg-[#8B6C36] transition-all shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tìm hiểu thêm
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
