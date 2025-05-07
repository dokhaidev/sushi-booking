"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";

// Simple seed-based pseudo-random number generator for consistent SSR
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Define interface for sushi icon
interface SushiIcon {
  id: number;
  width: number;
  height: number;
  scale: number;
  x: number;
  y: number;
  animateX: number;
  animateY: number;
  rotate: number;
  type: "nigiri" | "maki";
}

export default function NotFoundPage() {
  const [sushiIcons, setSushiIcons] = useState<SushiIcon[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const random = mulberry32(42);
    const icons: SushiIcon[] = Array.from({ length: 12 }, (_, i) => {
      const width = 30 + random() * 20;
      const height = 30 + random() * 20;
      const scale = 0.4 + random() * 0.3;
      const x = random() * (window.innerWidth || 1000);
      const y = random() * (window.innerHeight || 1000);
      const animateX = random() * (window.innerWidth || 1000);
      const animateY = random() * (window.innerHeight || 1000);
      const rotate = random() * 360;
      return {
        id: i,
        width,
        height,
        scale,
        x,
        y,
        animateX,
        animateY,
        rotate,
        type: random() > 0.5 ? "nigiri" : "maki",
      };
    });
    setSushiIcons(icons);
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <Head>
        <title>404 - Không tìm thấy trang | Sushi Haven</title>
      </Head>

      {/* Gradient background with Japanese-inspired colors */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-red-50 to-green-50 z-0" />

      {/* Sushi icons animation */}
      <div className="fixed inset-0 overflow-hidden z-10">
        {sushiIcons.map((sushi) => (
          <motion.div
            key={sushi.id}
            className="absolute opacity-25"
            initial={{
              x: sushi.x,
              y: sushi.y,
              scale: sushi.scale,
              rotate: sushi.rotate,
            }}
            animate={{
              x: sushi.animateX,
              y: sushi.animateY,
              rotate: sushi.rotate,
              transition: {
                duration: 10 + sushi.id * 2,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
            style={{
              width: `${sushi.width}px`,
              height: `${sushi.height}px`,
            }}
          >
            {sushi.type === "nigiri" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-red-500"
              >
                <rect
                  x="6"
                  y="10"
                  width="12"
                  height="6"
                  rx="2"
                  fill="currentColor"
                />
                <rect x="8" y="6" width="8" height="4" rx="1" fill="#FFF" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-green-600"
              >
                <circle cx="12" cy="12" r="8" fill="currentColor" />
                <circle cx="12" cy="12" r="4" fill="#FFF" />
              </svg>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center items-center h-screen text-center relative z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-gray-100"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto text-red-600"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </motion.div>

          <motion.h1
            className="text-5xl font-bold text-red-700 mb-4 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            404
          </motion.h1>

          <motion.h2
            className="text-2xl font-semibold text-gray-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Món Sushi Biến Mất!
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-6 text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Trang bạn tìm đã bị cuốn đi như một cuộn maki. Hãy thử quay lại thực
            đơn chính!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <motion.span
                className="block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Về Thực Đơn Chính
              </motion.span>
            </Link>
          </motion.div>

          <motion.p
            className="text-gray-500 text-sm mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Cần hỗ trợ? Gọi ngay cho đầu bếp của chúng tôi!
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative bamboo mat element */}
      <motion.div
        className="fixed bottom-0 left-0 w-full h-16 bg-green-800/20 z-30"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="h-full flex items-center justify-center gap-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-1 w-8 bg-green-700/50 rounded" />
          ))}
        </div>
      </motion.div>

      {/* Decorative chopsticks element */}
      <motion.div
        className="fixed top-10 right-10 z-30"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 0.7, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-700"
        >
          <path d="M2 2l20 20" />
          <path d="M2 6l20-4" />
        </svg>
      </motion.div>
    </>
  );
}
