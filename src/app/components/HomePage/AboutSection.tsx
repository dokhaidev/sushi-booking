"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  Award,
  ArrowRight,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";

interface OperatingHour {
  day: string;
  hours: string;
  isSpecial?: boolean;
}

const operatingHours: OperatingHour[] = [
  { day: "Thứ Hai - Thứ Sáu", hours: "9:00 - 22:00" },
  { day: "Thứ Bảy", hours: "9:00 - 20:00" },
  { day: "Chủ Nhật", hours: "10:00 - 18:00", isSpecial: true },
  { day: "Ngày lễ", hours: "11:00 - 17:00", isSpecial: true },
];

const stats = [
  { icon: Award, label: "20+ năm", desc: "Kinh nghiệm" },
  { icon: Users, label: "1000+", desc: "Khách hàng" },
  { icon: Sparkles, label: "100%", desc: "Tươi ngon" },
];

export default function AboutSection() {
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleImageLoad = (imageKey: string) => {
    setImageLoaded((prev) => ({ ...prev, [imageKey]: true }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-[#F8F1E9] via-[#FAF4EC] to-[#F5EDE3] py-[60px] sm:px-16 lg:px-24 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating sushi elements */}
        {["🍣", "🥢", "🍱"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-5"
            style={{
              left: `${20 + i * 25}%`,
              top: `${15 + (i % 2) * 60}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 2,
            }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Gradient orbs */}
        <motion.div
          className="absolute -left-40 -top-40 w-80 h-80 rounded-full bg-gradient-to-br from-[#A68345]/15 to-[#BD944A]/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -right-48 bottom-1/3 w-96 h-96 rounded-full bg-gradient-to-tl from-[#F7DED0]/20 to-[#E4B7A0]/15 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 5,
          }}
        />

        <motion.div
          className="absolute right-1/4 top-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-[#6B392A]/10 to-[#8A4A32]/5 blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 8,
          }}
        />
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-24 relative z-10">
        {/* Enhanced Image Stack */}
        <motion.div
          className="w-full lg:w-1/2 relative flex justify-center h-[520px]"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Image with enhanced styling */}
          <motion.div
            className="absolute left-10 top-2 w-[320px] h-[420px] rounded-[24px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-[12px] border-white/95 rotate-[-4deg] z-20 group"
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {!imageLoaded.main && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            )}
            <Image
              src="https://images.unsplash.com/photo-1724115890005-a610449d9ab7?w=1000&auto=format&fit=crop&q=80"
              alt="Sushi Roll"
              width={700}
              height={700}
              className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
              priority
              onLoad={() => handleImageLoad("main")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Secondary Image with enhanced styling */}
          <motion.div
            className="absolute right-10 bottom-2 w-[300px] h-[380px] rounded-[20px] overflow-hidden shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)] border-[10px] border-white/95 rotate-[6deg] z-10 group"
            whileHover={{ rotate: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {!imageLoaded.secondary && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            )}
            <Image
              src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1000&auto=format&fit=crop&q=80"
              alt="Sushi Dish"
              width={700}
              height={700}
              className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110"
              priority
              onLoad={() => handleImageLoad("secondary")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Decorative Element with enhanced styling */}
          <motion.div
            className="absolute left-6 bottom-0 w-[180px] h-[180px] rounded-full overflow-hidden shadow-xl border-[6px] border-white/90 z-30 group"
            whileHover={{ rotate: 0, scale: 1.1 }}
            initial={{ rotate: -10 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {!imageLoaded.decorative && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-full" />
            )}
            <Image
              src="https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHN1c2hpfGVufDB8fDB8fHww"
              alt="Japanese Ingredients"
              width={350}
              height={350}
              className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110"
              onLoad={() => handleImageLoad("decorative")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Floating badge */}
          <motion.div
            className="absolute top-8 right-4 bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white px-4 py-2 rounded-full shadow-lg z-40"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2">
              <Award size={16} />
              <span className="text-sm font-semibold">Premium</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Content Section */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#A68345]/10 to-[#BD944A]/10 border border-[#A68345]/20 rounded-full px-6 py-3 mb-6"
          >
            <Sparkles className="text-[#A68345]" size={18} />
            <span className="text-[#A68345] text-sm font-medium tracking-wide uppercase">
              VỀ CHÚNG TÔI
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#333333] mb-6 leading-[1.1]"
          >
            <span className="block mb-2">和食の心</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68345] to-[#BD944A]">
              Tinh Thần Ẩm Thực Nhật
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-[#666666] text-xl mb-8 leading-relaxed"
          >
            Chúng tôi mang đến trải nghiệm ẩm thực Nhật Bản đích thực, được chế
            biến bởi những đầu bếp tài năng với tình yêu và sự tỉ mỉ trong từng
            món ăn.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-start gap-6 mb-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#A68345] to-[#BD944A] rounded-xl mb-2 mx-auto">
                  <stat.icon className="text-white" size={20} />
                </div>
                <div className="text-[#333333] font-bold text-lg">
                  {stat.label}
                </div>
                <div className="text-[#666666] text-sm">{stat.desc}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Operating Hours */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-[#A68345]" size={20} />
              <h3 className="text-lg font-semibold text-[#333333]">
                Giờ hoạt động
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {operatingHours.map((schedule, i) => (
                <motion.div
                  key={i}
                  className={`p-4 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${
                    schedule.isSpecial
                      ? "bg-gradient-to-br from-[#A68345]/10 to-[#BD944A]/5 border-[#A68345]/20"
                      : "bg-white/80 backdrop-blur-sm border-white/50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#333333] font-medium text-sm">
                      {schedule.day}
                    </span>
                    <span className="text-[#A68345] font-bold text-sm">
                      {schedule.hours}
                    </span>
                  </div>
                  {schedule.isSpecial && (
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar size={12} className="text-[#A68345]" />
                      <span className="text-xs text-[#666666]">
                        Giờ đặc biệt
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              className="group relative overflow-hidden bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#BD944A] to-[#A68345] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2 font-semibold text-lg">
                <span>Khám phá thực đơn</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
