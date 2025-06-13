"use client";

import { motion } from "framer-motion";
import { ChefHat, Star, Award, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FAF4EC] via-[#F8F1E9] to-[#F5EDE3] overflow-hidden h-[680px] flex items-center">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating sushi elements */}
          {["🍣", "🍱", "🥢", "🍤", "🍙"].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-10"
              style={{
                left: `${10 + i * 20}%`,
                top: `${15 + (i % 2) * 60}%`,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 3, -3, 0],
              }}
              transition={{
                duration: 6 + i,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            >
              {emoji}
            </motion.div>
          ))}

          {/* Gradient circles */}
          <motion.div
            className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-gradient-to-br from-[#F7DED0]/40 to-[#E4B7A0]/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-gradient-to-tl from-[#A68345]/20 to-[#BD944A]/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="container mx-auto sm:px-12 lg:px-18 relative z-10 h-full flex items-center">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 w-full">
            {/* Left: Enhanced Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#A68345]/10 to-[#BD944A]/10 border border-[#A68345]/20 rounded-full px-5 py-3 mb-6">
                <Award className="text-[#A68345]" size={18} />
                <span className="text-[#A68345] text-base font-medium">
                  Nhà hàng sushi #1 Việt Nam
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
              >
                <span className="block text-[#333333] mb-1">寿司匠</span>
                <span className="block text-transparent bg-gradient-to-r from-[#A68345] to-[#BD944A] bg-clip-text">
                  SUSHI TAKUMI
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-[#666666] text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8"
              >
                Trải nghiệm tinh hoa ẩm thực Nhật Bản với nguyên liệu tươi sống,
                kỹ thuật truyền thống và không gian đậm chất Edo.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex justify-center lg:justify-start gap-6 mb-6"
              >
                {[
                  { icon: ChefHat, label: "20+ năm", desc: "Kinh nghiệm" },
                  { icon: Star, label: "4.9/5", desc: "Đánh giá" },
                  { icon: Clock, label: "30 phút", desc: "Phục vụ" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#A68345] to-[#BD944A] rounded-xl mb-3 mx-auto">
                      <stat.icon className="text-white" size={24} />
                    </div>
                    <div className="text-[#333333] font-bold text-xl">
                      {stat.label}
                    </div>
                    <div className="text-[#666666] text-sm">{stat.desc}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
              >
                <motion.a
                  href="/menu"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white px-8 py-4 rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#BD944A] to-[#A68345] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2 font-semibold text-lg">
                    🍣 Xem thực đơn
                  </span>
                </motion.a>

                <motion.a
                  href="/datban"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group border-2 border-[#A68345] text-[#A68345] hover:bg-[#A68345] hover:text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold text-lg"
                >
                  📞 Đặt bàn ngay
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Right: Enhanced Image */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              {/* Main Image Container */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-[2rem] overflow-hidden shadow-2xl border-6 border-[#F7DED0] bg-gradient-to-br from-[#F7DED0] to-[#E4B7A0] p-2"
                >
                  <div className="rounded-[1.5rem] overflow-hidden">
                    <img
                      src="https://i.pinimg.com/736x/ec/75/1f/ec751f453b9bd675a91ef0faaa8890fd.jpg"
                      alt="Sushi nghệ thuật"
                      className="object-cover w-full h-[420px] lg:h-[480px] transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-5 -right-5 bg-gradient-to-br from-[#A68345] to-[#BD944A] text-white p-4 rounded-xl shadow-xl"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">20+</div>
                    <div className="text-sm opacity-90">Năm kinh nghiệm</div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 6, 0],
                    rotate: [0, -2, 2, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-[#F7DED0]"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="text-yellow-400 fill-current"
                          size={16}
                        />
                      ))}
                    </div>
                    <span className="text-[#333333] font-semibold text-base">
                      4.9/5
                    </span>
                  </div>
                  <div className="text-[#666666] text-sm mt-1">
                    1000+ đánh giá
                  </div>
                </motion.div>

                {/* Light Effects */}
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-[#FCEEE3]/60 to-[#F8D6C5]/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-gradient-to-tr from-[#A68345]/20 to-[#BD944A]/10 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-[#A68345]"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium">Cuộn xuống</span>
            <div className="w-5 h-8 border-2 border-[#A68345] rounded-full flex justify-center">
              <div className="w-1 h-2 bg-[#A68345] rounded-full mt-1"></div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
