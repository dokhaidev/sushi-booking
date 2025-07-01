"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactHero() {
  const MotionLink = motion(Link);
  return (
    <section className="relative bg-[url('/img/contact.jpg')] bg-cover bg-center min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Clean Modern Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 z-0" />

      {/* Geometric Sushi Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-16 left-16 w-24 h-24 border border-[#AF763E]/20 rounded-full" />
        <div className="absolute top-20 right-20 w-20 h-20 border border-[#F8F1E9]/10 rounded-full" />
        <div className="absolute bottom-20 left-24 w-28 h-28 border border-[#AF763E]/15 rounded-full" />
        <div className="absolute bottom-16 right-16 w-22 h-22 border border-[#F8F1E9]/10 rounded-full" />
      </div>

      {/* Main Content Container with Custom Spacing */}
      <div className="relative z-10 w-full h-full py-[60px] px-[90px]">
        <div className="h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
            {/* Left Side - Text Content */}
            <motion.div
              className="text-left flex flex-col justify-center h-full"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Small Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#AF763E]/20 backdrop-blur-sm border border-[#AF763E]/30 rounded-full mb-6 w-fit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-2 h-2 bg-[#AF763E] rounded-full animate-pulse" />
                <span className="text-[#F8F1E9] text-sm font-medium">
                  Authentic Japanese Cuisine
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl lg:text-6xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-[#F8F1E9] block">Liên hệ</span>
                <span className="text-[#AF763E] block">Sushi Takumi</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-lg text-white mb-8 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Đặt bàn để trải nghiệm nghệ thuật sushi đích thực từ bàn tay tài
                hoa của đầu bếp Takumi.
              </motion.p>

              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <MotionLink
                  href="/dat-ban"
                  passHref
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#AF763E] hover:bg-[#8B5A2B] text-[#F8F1E9] font-bold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>Đặt bàn ngay</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    →
                  </motion.div>
                </MotionLink>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                className="flex items-center gap-6 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+84 123 456 789</span>
                </div>
                <div className="w-1 h-1 bg-[#AF763E] rounded-full" />
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Quận 1, TP.HCM</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Sushi Visual - ENLARGED */}
            <motion.div
              className="relative flex justify-center lg:justify-end items-center h-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Main Sushi Plate - MUCH LARGER */}
              <div className="relative">
                {/* Plate Base - Increased from w-64 to w-96 */}
                <motion.div
                  className="w-96 h-96 bg-gradient-to-br from-[#F8F1E9] to-[#F8F1E9]/80 rounded-full shadow-2xl border-4 border-[#AF763E]/20"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 60,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                {/* Sushi Pieces - Enlarged and repositioned */}
                <motion.div
                  className="absolute top-16 left-20 w-14 h-14 bg-[#AF763E] rounded-full border-4 border-[#F8F1E9] shadow-lg"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="absolute inset-2 bg-[#FF6B47] rounded-full" />
                </motion.div>

                <motion.div
                  className="absolute top-28 right-16 w-12 h-12 bg-[#AF763E] rounded-full border-3 border-[#F8F1E9] shadow-lg"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -15, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                >
                  <div className="absolute inset-2 bg-[#7FB069] rounded-full" />
                </motion.div>

                <motion.div
                  className="absolute bottom-20 left-16 w-16 h-16 bg-[#AF763E] rounded-full border-4 border-[#F8F1E9] shadow-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 20, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 2,
                  }}
                >
                  <div className="absolute inset-2 bg-[#FFD23F] rounded-full" />
                </motion.div>

                <motion.div
                  className="absolute bottom-16 right-20 w-10 h-10 bg-[#AF763E] rounded-full border-3 border-[#F8F1E9] shadow-lg"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -25, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                  }}
                >
                  <div className="absolute inset-1.5 bg-[#E85D3D] rounded-full" />
                </motion.div>

                {/* Additional Sushi Pieces for larger plate */}
                <motion.div
                  className="absolute top-32 left-32 w-8 h-8 bg-[#AF763E] rounded-full border-2 border-[#F8F1E9] shadow-lg"
                  animate={{
                    scale: [1, 1.4, 1],
                    rotate: [0, 30, 0],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 3,
                  }}
                >
                  <div className="absolute inset-1 bg-[#FF6B47] rounded-full" />
                </motion.div>

                <motion.div
                  className="absolute top-20 right-32 w-9 h-9 bg-[#AF763E] rounded-full border-3 border-[#F8F1E9] shadow-lg"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3.8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1.5,
                  }}
                >
                  <div className="absolute inset-1.5 bg-[#7FB069] rounded-full" />
                </motion.div>

                {/* Center Wasabi - Larger */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#7FB069] rounded-full shadow-lg"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />

                {/* Chopsticks - Longer for larger plate */}
                <motion.div
                  className="absolute -right-8 top-1/2 transform -translate-y-1/2"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-36 h-1.5 bg-[#AF763E] rounded-full shadow-lg" />
                  <div className="w-36 h-1.5 bg-[#AF763E] rounded-full shadow-lg mt-1 ml-1" />
                </motion.div>

                {/* Decorative Elements - Larger */}
                <motion.div
                  className="absolute -top-4 -left-4 w-8 h-8 border-2 border-[#AF763E]/40 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.div
                  className="absolute -bottom-6 -right-6 w-7 h-7 border-2 border-[#F8F1E9]/40 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                />
                <motion.div
                  className="absolute top-8 left-8 w-6 h-6 border-2 border-[#AF763E]/30 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 2,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="flex flex-col items-center text-[#F8F1E9]/60"
        >
          <span className="text-xs mb-1">Scroll</span>
          <div className="w-5 h-8 border-2 border-[#AF763E]/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [1, 10, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-1 h-2 bg-[#AF763E] rounded-full mt-1"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
