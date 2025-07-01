"use client";
import { motion } from "framer-motion";
import {
  Diamond,
  Palette,
  Smile,
  Sparkles,
  ChefHat,
  Heart,
} from "lucide-react";

export default function Philosophy() {
  return (
    <section className="py-[60px] px-[90px] bg-gradient-to-br from-[#FFFAF3] via-[#FFF8F0] to-[#FFFAF3] relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-16 left-16 w-16 h-4 bg-gradient-to-r from-[#AF763E]/15 to-[#8B5A2B]/15 rounded-full"
          animate={{
            scaleX: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-20 right-20 w-10 h-10 border-2 border-[#AF763E]/20 rounded-full bg-[#FFFAF3]/50"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
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
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-[#AF763E] to-[#D97706] rounded-full shadow-sm"
            style={{
              left: `${20 + i * 12}%`,
              top: `${25 + (i % 3) * 20}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.7,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Enhanced Text Content */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Top Decoration */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                className="w-12 h-px bg-gradient-to-r from-[#AF763E] to-[#D97706]"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="p-2 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-xl shadow-lg"
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
                <ChefHat className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>

            {/* Enhanced Title */}
            <h3 className="text-4xl lg:text-5xl font-bold tracking-wide mb-6">
              <motion.span
                className="bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent"
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
                Triết Lý Ẩm Thực
              </motion.span>
            </h3>

            {/* Enhanced Description */}
            <div className="space-y-4">
              <p className="text-[#AF763E]/90 leading-relaxed text-xl font-light">
                Mỗi món ăn tại Sushi Takumi là một tác phẩm nghệ thuật, là sự
                kết hợp giữa kỹ thuật truyền thống và tinh thần hiện đại.
              </p>
              <p className="text-[#AF763E]/70 leading-relaxed text-lg">
                Từng lát cá tươi sống được lựa chọn kỹ lưỡng từ chợ Tsukiji nổi
                tiếng Nhật Bản, kết hợp với bàn tay tỉ mỉ của đầu bếp để tạo nên
                trải nghiệm ẩm thực trọn vẹn.
              </p>
            </div>
          </motion.div>

          {/* Enhanced Core Values */}
          <div className="space-y-6">
            {[
              {
                icon: <Diamond className="w-7 h-7" />,
                title: "Chất Lượng Là Hàng Đầu",
                description:
                  "Sử dụng nguyên liệu tươi ngon nhất, nhập khẩu trực tiếp từ Nhật và được xử lý đúng chuẩn theo quy trình nghiêm ngặt.",
                gradient: "from-[#AF763E] to-[#8B5A2B]",
                delay: 0.4,
              },
              {
                icon: <Palette className="w-7 h-7" />,
                title: "Thẩm Mỹ Trong Từng Chi Tiết",
                description:
                  "Cách trình bày món ăn tinh tế, đầy nghệ thuật, làm nổi bật bản sắc văn hóa Nhật Bản qua từng đường nét.",
                gradient: "from-[#D97706] to-[#AF763E]",
                delay: 0.6,
              },
              {
                icon: <Smile className="w-7 h-7" />,
                title: "Trải Nghiệm Khách Hàng Là Trọng Tâm",
                description:
                  "Chúng tôi mong muốn mỗi khách hàng khi bước vào đều cảm thấy như đang ở Nhật Bản thực thụ với dịch vụ tận tâm.",
                gradient: "from-[#8B5A2B] to-[#D97706]",
                delay: 0.8,
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#AF763E]/10 overflow-hidden"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: value.delay }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(175, 118, 62, 0.15)",
                }}
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#AF763E]/5 via-transparent to-[#8B5A2B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-start gap-5 relative z-10">
                  {/* Icon Container */}
                  <motion.div
                    className={`flex-shrink-0 p-3 bg-gradient-to-br ${value.gradient} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-white">{value.icon}</div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent group-hover:from-[#8B5A2B] group-hover:to-[#AF763E] transition-all duration-300">
                      {value.title}
                    </h4>
                    <p className="text-[#AF763E]/70 leading-relaxed group-hover:text-[#AF763E]/90 transition-colors duration-300">
                      {value.description}
                    </p>
                  </div>
                </div>

                {/* Decorative Corner Element */}
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#AF763E]/20 to-[#8B5A2B]/20 rounded-full"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 1.2,
                    ease: "easeInOut",
                  }}
                >
                  <div className="absolute inset-1.5 bg-gradient-to-br from-[#D97706] to-[#AF763E] rounded-full opacity-60" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Philosophy Quote */}
          <motion.div
            className="bg-gradient-to-r from-[#AF763E]/10 to-[#8B5A2B]/10 rounded-2xl p-6 border-l-4 border-[#AF763E] relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="absolute top-4 right-4 opacity-20">
              <Heart className="w-8 h-8 text-[#AF763E]" />
            </div>
            <blockquote className="text-lg italic text-[#AF763E]/80 leading-relaxed relative z-10">
              "Sushi không chỉ là món ăn, mà là cầu nối văn hóa, là nghệ thuật
              được thể hiện qua từng miếng cơm và lát cá tươi."
            </blockquote>
            <cite className="block mt-3 text-sm font-semibold text-[#AF763E] not-italic">
              — Takumi Yamamoto, Đầu bếp trưởng
            </cite>
          </motion.div>
        </motion.div>

        {/* Enhanced Image Section */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {/* Main Image */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="img/sushi-hokkaido-sachi.jpg?height=600&width=500"
              alt="Handmade Sushi - Art of Japanese Cuisine"
              className="w-full h-[600px] object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image Caption */}
            <motion.div
              className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={{ y: 20 }}
              whileHover={{ y: 0 }}
            >
              <p className="font-semibold text-lg">Nghệ thuật sushi thủ công</p>
              <p className="text-sm opacity-90">Từng chi tiết đều hoàn hảo</p>
            </motion.div>

            {/* Decorative Border */}
            <div className="absolute inset-0 border-4 border-[#AF763E]/30 rounded-3xl group-hover:border-[#AF763E]/60 transition-colors duration-500" />
          </motion.div>

          {/* Floating Quality Badge */}
          <motion.div
            className="absolute -top-4 -right-4 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] text-white rounded-2xl p-4 shadow-xl"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <div className="text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs font-semibold">Premium</div>
              <div className="text-xs opacity-90">Quality</div>
            </div>
          </motion.div>

          {/* Floating Experience Badge */}
          <motion.div
            className="absolute -bottom-4 -left-4 bg-white border-4 border-[#AF763E]/20 rounded-2xl p-4 shadow-xl"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.05, rotate: -5 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-[#AF763E]">30+</div>
              <div className="text-xs text-[#AF763E]/70">Năm kinh nghiệm</div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute top-1/4 -left-6 w-12 h-12 bg-gradient-to-br from-[#AF763E]/20 to-[#8B5A2B]/20 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-3 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full opacity-60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
