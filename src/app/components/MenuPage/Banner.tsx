"use client";

import { motion } from "framer-motion";
import { Salsa } from "next/font/google";

// Load font ở module scope
const salsa = Salsa({ subsets: ["latin"], weight: "400" });

export default function Banner() {
  return (
    <section className="relative bg-[url('/img/banner-menus.jpg')] bg-cover bg-center min-h-[450px] flex items-center justify-center">
      {/* Optional overlay */}
      <div className="absolute inset-0 z-0" />

      {/* Heading text */}
      <motion.h1
        className="
          relative z-10 text-center
          text-[80px] sm:text-[100px] md:text-[130px] lg:text-[150px]
          font-bold text-[#A68345] tracking-wide
        "
        style={{
          fontFamily: salsa.style.fontFamily,
          WebkitTextStroke: "0.3px #F8F1E9",
          textShadow: "1px 1px 1px rgba(0,0,0,0.1)",
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        SUSHI TAKUMI
      </motion.h1>
    </section>
  );
}
