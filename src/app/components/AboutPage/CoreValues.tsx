"use client";
import { motion } from "framer-motion";
import {
  Award,
  Heart,
  Lightbulb,
  Sparkles,
  Star,
  ArrowRight,
} from "lucide-react";

export default function CoreValues() {
  const values = [
    {
      title: "Chất lượng",
      desc: "Nguyên liệu tươi sống và kỹ thuật chế biến chuẩn Nhật.",
      detail:
        "Chúng tôi cam kết sử dụng nguyên liệu tươi ngon, được chọn lọc kỹ càng từ các nhà cung cấp uy tín, kết hợp cùng kỹ thuật chế biến truyền thống Nhật Bản để mang đến trải nghiệm ẩm thực đỉnh cao.",
      icon: <Award className="w-8 h-8" />,
      gradient: "from-[#AF763E] to-[#8B5A2B]",
      bgGradient: "from-[#AF763E]/5 to-[#8B5A2B]/5",
      stats: "100%",
      statsLabel: "Tươi ngon",
      delay: 0,
    },
    {
      title: "Tôn trọng",
      desc: "Đối xử với khách hàng như thượng khách trong văn hóa Nhật.",
      detail:
        "Chúng tôi luôn đặt khách hàng lên hàng đầu, mang đến sự tận tâm, lịch thiệp và không gian phục vụ đúng chuẩn tinh thần hiếu khách Nhật Bản.",
      icon: <Heart className="w-8 h-8" />,
      gradient: "from-[#D97706] to-[#AF763E]",
      bgGradient: "from-[#D97706]/5 to-[#AF763E]/5",
      stats: "4.9★",
      statsLabel: "Đánh giá",
      delay: 0.2,
    },
    {
      title: "Sáng tạo",
      desc: "Luôn đổi mới thực đơn nhưng vẫn giữ hồn sushi truyền thống.",
      detail:
        "Chúng tôi không ngừng sáng tạo để làm mới thực đơn, kết hợp các nguyên liệu độc đáo, mang đến trải nghiệm ẩm thực đa dạng nhưng vẫn giữ vững giá trị truyền thống.",
      icon: <Lightbulb className="w-8 h-8" />,
      gradient: "from-[#8B5A2B] to-[#D97706]",
      bgGradient: "from-[#8B5A2B]/5 to-[#D97706]/5",
      stats: "50+",
      statsLabel: "Món đặc sắc",
      delay: 0.4,
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#F8F1E9] via-[#F5EDE3] to-[#F8F1E9] py-[60px] px-[90px] relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-16 right-20 w-16 h-4 bg-gradient-to-r from-[#AF763E]/15 to-[#8B5A2B]/15 rounded-full"
          animate={{
            scaleX: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-24 left-16 w-10 h-10 border-2 border-[#AF763E]/20 rounded-full bg-[#F8F1E9]/50"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <div className="absolute inset-2.5 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full opacity-50" />
        </motion.div>

        {/* Floating sparkles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-[#AF763E] to-[#D97706] rounded-full shadow-sm"
            style={{
              left: `${25 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Enhanced Header Section */}
      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Top Decoration */}
          <motion.div
            className="flex justify-center items-center gap-4 mb-8"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-px bg-gradient-to-r from-transparent via-[#AF763E] to-[#D97706]"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="p-3 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-2xl shadow-lg"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
              className="w-20 h-px bg-gradient-to-l from-transparent via-[#AF763E] to-[#D97706]"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </motion.div>

          {/* Enhanced Title */}
          <motion.h3
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.span
              className="bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              Giá Trị Cốt Lõi
            </motion.span>
          </motion.h3>

          {/* Enhanced Description */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-[#AF763E]/90 text-xl font-light leading-relaxed max-w-5xl mx-auto">
              Ba giá trị then chốt tạo nên bản sắc và trải nghiệm đậm chất Nhật
              Bản trong từng món ăn và dịch vụ của chúng tôi.
            </p>
            <p className="text-[#AF763E]/70 text-lg max-w-3xl mx-auto">
              Những nguyên tắc này định hướng mọi hoạt động và cam kết của Sushi
              Takumi.
            </p>
          </motion.div>
        </motion.div>

        {/* Core Values Stats */}
        <motion.div
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {[
            {
              icon: <Award className="w-5 h-5" />,
              number: "3",
              text: "Giá trị cốt lõi",
            },
            {
              icon: <Star className="w-5 h-5" />,
              number: "15+",
              text: "Năm kinh nghiệm",
            },
            {
              icon: <Heart className="w-5 h-5" />,
              number: "100%",
              text: "Cam kết chất lượng",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-[#AF763E]/20 to-[#8B5A2B]/20 rounded-lg group-hover:from-[#AF763E]/30 group-hover:to-[#8B5A2B]/30 transition-colors duration-300">
                  <div className="text-[#AF763E]">{stat.icon}</div>
                </div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-sm text-[#AF763E]/70">{stat.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {values.map((value, idx) => (
          <motion.div
            key={idx}
            className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-[#AF763E]/10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: value.delay }}
            viewport={{ once: true }}
            whileHover={{
              y: -8,
              scale: 1.02,
              boxShadow: "0 25px 50px rgba(175, 118, 62, 0.2)",
            }}
          >
            {/* Background Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col items-center text-center">
              {/* Enhanced Icon Container */}
              <motion.div
                className={`inline-flex p-4 bg-gradient-to-br ${value.gradient} rounded-2xl shadow-lg mb-6 relative`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-white">{value.icon}</div>

                {/* Icon Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              {/* Stats Badge */}
              <motion.div
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: value.delay + 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-sm font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
                  {value.stats}
                </div>
                <div className="text-xs text-[#AF763E]/70">
                  {value.statsLabel}
                </div>
              </motion.div>

              {/* Title */}
              <h4 className="text-2xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent mb-4 group-hover:from-[#8B5A2B] group-hover:to-[#AF763E] transition-all duration-300">
                {value.title}
              </h4>

              {/* Short Description */}
              <p className="text-[#AF763E]/80 font-medium mb-4 group-hover:text-[#AF763E]/90 transition-colors duration-300">
                {value.desc}
              </p>

              {/* Detailed Description */}
              <p className="text-[#AF763E]/70 leading-relaxed mb-6 group-hover:text-[#AF763E]/80 transition-colors duration-300">
                {value.detail}
              </p>

              {/* Enhanced Button */}
              <motion.button
                type="button"
                className="group/btn relative bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(175, 118, 62, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B5A2B] to-[#AF763E] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  <span>Tìm hiểu thêm</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </div>
              </motion.button>
            </div>

            {/* Decorative Corner Element */}
            <motion.div
              className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-[#AF763E]/20 to-[#8B5A2B]/20 rounded-full"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                delay: idx * 1.5,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-2 bg-gradient-to-br from-[#D97706] to-[#AF763E] rounded-full opacity-60" />
            </motion.div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#AF763E]/10 to-[#8B5A2B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        ))}
      </div>

      {/* Bottom Quote Section */}
      <motion.div
        className="max-w-4xl mx-auto mt-16 text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="bg-gradient-to-r from-[#AF763E]/10 to-[#8B5A2B]/10 rounded-2xl p-8 border border-[#AF763E]/20 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="w-8 h-8 text-[#AF763E]" />
          </div>
          <blockquote className="text-xl italic text-[#AF763E]/80 leading-relaxed mb-4">
            "Ba giá trị cốt lõi này không chỉ là kim chỉ nam cho hoạt động kinh
            doanh, mà còn là cam kết của chúng tôi với mỗi thực khách."
          </blockquote>
          <cite className="text-sm font-semibold text-[#AF763E] not-italic">
            — Sushi Takumi Team
          </cite>
        </div>
      </motion.div>
    </section>
  );
}
