"use client";
import { motion } from "framer-motion";
import { Salsa } from "next/font/google";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";

const salsa = Salsa({ subsets: ["latin"], weight: "400" });

export default function AboutHero() {
  return (
    <section className="relative bg-gradient-to-br from-[#fceedb] via-[#d0c3b5] to-[#d5bfa5] flex items-center overflow-hidden py-[60px] px-[90px]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-8">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #AF763E 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #8B5A2B 1.5px, transparent 1.5px),
              radial-gradient(circle at 50% 10%, #D97706 2px, transparent 2px)
            `,
            backgroundSize: "100px 100px, 80px 80px, 120px 120px",
            backgroundPosition: "0 0, 40px 40px, 20px 60px",
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-6 h-6 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full shadow-lg"
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/3 right-1/4 w-8 h-8 border-2 border-[#AF763E]/50 rounded-full bg-[#fceedb]/30"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="absolute inset-1.5 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-gradient-to-br from-[#D97706] to-[#AF763E] rotate-45 rounded-sm shadow-md"
          animate={{
            rotate: [45, 405],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Top Decoration */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="w-16 h-px bg-gradient-to-r from-[#AF763E] to-[#D97706]"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-6 h-6 text-[#AF763E]" />
              </motion.div>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <h1
                className="text-[60px] sm:text-[70px] lg:text-[80px] font-bold tracking-wider leading-none"
                style={{ fontFamily: salsa.style.fontFamily }}
              >
                <motion.span
                  className="bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent block"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  SUSHI
                </motion.span>
                <motion.span
                  className="bg-gradient-to-r from-[#8B5A2B] via-[#AF763E] to-[#D97706] bg-clip-text text-transparent block"
                  animate={{
                    backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  TAKUMI
                </motion.span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="text-2xl lg:text-3xl bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent font-light">
                Nghệ thuật sushi truyền thống Nhật Bản
              </p>
              <p className="text-lg text-[#AF763E]/80 leading-relaxed max-w-lg">
                Nơi mỗi miếng sushi được chế tác với tâm huyết và kỹ thuật hoàn
                hảo, mang đến trải nghiệm ẩm thực đích thực từ xứ sở hoa anh
                đào.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {[
                { number: "15+", text: "Năm kinh nghiệm" },
                {
                  number: "4.9",
                  text: "Đánh giá",
                  icon: (
                    <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                  ),
                },
                { number: "100+", text: "Món đặc sắc" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-[#AF763E]/20 shadow-lg min-w-[120px]"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderColor: "rgba(175, 118, 62, 0.4)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
                      {stat.number}
                    </span>
                    {stat.icon}
                  </div>
                  <div className="text-sm text-[#AF763E]/70 text-center">
                    {stat.text}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <Link href="/menu">
                <motion.button
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] text-white rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8B5A2B] to-[#AF763E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center gap-2">
                    <span>Khám phá thực đơn</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button
                  className="group px-8 py-4 bg-white/70 backdrop-blur-sm text-[#AF763E] rounded-2xl text-lg font-semibold border-2 border-[#AF763E]/30 hover:border-[#AF763E] hover:bg-white/90 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="group-hover:text-[#8B5A2B] transition-colors duration-300">
                    Đặt bàn ngay
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Image Grid */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-4 h-[500px]">
              {/* Large Image - Top Left */}
              <motion.div
                className="relative row-span-2 rounded-3xl overflow-hidden shadow-2xl group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://sushiworld.com.vn/wp-content/uploads/2025/03/z6395411743857_e52ea2f676293290be4c6493f37b421b.jpg?height=400&width=300"
                  alt="Sushi Master at Work"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-semibold">Nghệ nhân sushi</p>
                  <p className="text-sm opacity-80">Kỹ thuật truyền thống</p>
                </div>

                {/* Decorative Border */}
                <div className="absolute inset-0 border-4 border-[#AF763E]/20 rounded-3xl group-hover:border-[#AF763E]/40 transition-colors duration-300" />
              </motion.div>

              {/* Top Right Image */}
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-xl group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://sushiworld.com.vn/wp-content/uploads/2025/03/z6395411743855_50d51c359086dd8a148ec385e1461954.jpg?height=240&width=280"
                  alt="Fresh Sushi Platter"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-medium text-sm">Sushi tươi ngon</p>
                </div>

                {/* Decorative Border */}
                <div className="absolute inset-0 border-3 border-[#AF763E]/20 rounded-3xl group-hover:border-[#AF763E]/40 transition-colors duration-300" />
              </motion.div>

              {/* Bottom Right Image */}
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-xl group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://sushiworld.com.vn/wp-content/uploads/2025/03/z6395411743851_27e135da72d1d52699411ef26996af26.jpg?height=240&width=280"
                  alt="Restaurant Interior"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-medium text-sm">Không gian ấm cúng</p>
                </div>

                {/* Decorative Border */}
                <div className="absolute inset-0 border-3 border-[#AF763E]/20 rounded-3xl group-hover:border-[#AF763E]/40 transition-colors duration-300" />
              </motion.div>
            </div>

            {/* Floating Decoration around Images */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full shadow-lg"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-[#D97706] to-[#AF763E] rounded-full shadow-lg"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#d5bfa5] via-[#d0c3b5]/20 to-transparent" />
    </section>
  );
}
