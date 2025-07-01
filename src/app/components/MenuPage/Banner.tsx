"use client";

import { motion } from "framer-motion";
import { Noto_Serif_JP } from "next/font/google";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";

// Load font
const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-noto-serif-jp",
});

export default function BannerMenu() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".floating-element").forEach((element: any) => {
      gsap.to(element, {
        y: () => ScrollTrigger.maxScroll(window) * 0.1 * Math.random(),
        scrollTrigger: {
          trigger: ".menu-banner",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    gsap.fromTo(
      ".menu-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        scrollTrigger: {
          trigger: ".menu-banner",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  return (
    <section className="menu-banner relative bg-gradient-to-br from-[#4b3720] via-[#3a2917] to-[#2e200f] h-[665px] max-h-[665px] min-h-[665px] overflow-hidden py-[60px] sm:px-16 lg:px-24">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('/images/japanese-paper-texture.png')] bg-repeat pointer-events-none" />

      {/* Decorative sushi emojis */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {["🍣", "🍱", "🍙", "🍤", "🥢", "🍶", "🍵", "🎎"].map((emoji, i) => (
          <motion.div
            key={i}
            className="floating-element absolute text-4xl md:text-5xl opacity-20"
            style={{
              left: `${5 + i * 12}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            initial={{ y: 0, rotate: 0 }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8 + i,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Background wave pattern */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 bg-[url('/images/japanese-wave-pattern.svg')] bg-repeat-x opacity-15"
          initial={{ x: 0 }}
          animate={{ x: ["0%", "100%"] }}
          transition={{
            duration: 60,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Light glow */}
        <motion.div
          className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-gradient-to-br from-[#A68345]/50 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full h-full max-w-8xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left column */}
        <div className="flex-1 w-full text-center md:text-left flex flex-col gap-4">
          {/* Japanese title */}
          <motion.div
            className={`${notoSerifJP.variable} font-noto-serif-jp text-[#F4E5D4] text-2xl sm:text-3xl md:text-4xl tracking-widest`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            寿司匠メニュー
          </motion.div>

          {/* Main title */}
          <motion.h1
            className="menu-title text-5xl sm:text-6xl md:text-7xl font-bold text-[#F4E5D4] tracking-tight leading-tight"
            style={{ textShadow: "0px 2px 10px rgba(0, 0, 0, 0.5)" }}
          >
            <span className="block">SUSHI TAKUMI</span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#A68345] tracking-wider mt-2 block">
              MENU COLLECTION
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-[#F4E5D4]/80 text-base sm:text-lg w-full max-w-xl mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Trải nghiệm tinh hoa ẩm thực Nhật Bản qua thực đơn độc quyền của
            Sushi Takumi - nơi nghệ thuật gặp hương vị.
          </motion.p>

          {/* CTA */}

          <motion.a
            className="mt-6 inline-block px-6 py-3 bg-[#A68345] hover:bg-[#BD944A] text-white rounded-full shadow-lg transition-all duration-300 text-sm sm:text-base w-max mx-auto md:mx-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            ĐẶT BÀN NGAY
          </motion.a>
        </div>

        {/* Right column - Image */}
        <motion.div
          className="flex-1 w-full flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="w-full max-w-[600px]">
            <Image
              src="https://image.phunuonline.com.vn/fckeditor/upload/2022/20221113/images/2020-04-08-92239-1586333880-large.jpg_721668338712.jpg"
              alt="Sushi banner"
              width={600}
              height={400}
              className="w-full h-auto rounded-xl shadow-xl object-cover"
              layout="responsive"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
