"use client";
import { motion } from "framer-motion";
import { Sparkles, Heart, Award, Users } from "lucide-react";

export default function Introduction() {
  return (
    <section className="relative py-[60px] px-[90px] bg-[#F8F1E9] overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #AF763E 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Minimal Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-6 h-6 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full shadow-lg opacity-60"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-24 left-24 w-8 h-8 border-2 border-[#AF763E]/30 rounded-full bg-[#F8F1E9]/50"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-2 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full opacity-60" />
        </motion.div>
      </div>

      <motion.div
        className="container mx-auto max-w-6xl text-center relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Enhanced Header Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Top Decoration */}
          <motion.div
            className="flex justify-center items-center gap-4 mb-8"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
              <Sparkles className="w-6 h-6 text-[#F8F1E9]" />
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
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wider mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
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
              Về Chúng Tôi
            </motion.span>
          </motion.h2>

          {/* Enhanced Description */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-[#AF763E]/90 text-xl sm:text-2xl leading-relaxed max-w-4xl mx-auto font-light">
              Sushi Takumi là sự kết hợp giữa nghệ thuật chế biến truyền thống
              Nhật Bản và tinh thần hiếu khách hiện đại.
            </p>
            <p className="text-[#AF763E]/70 text-lg leading-relaxed max-w-3xl mx-auto">
              Chúng tôi tự hào mang đến những món sushi thủ công với hương vị
              tinh tế, đậm đà và nguyên liệu tươi ngon mỗi ngày.
            </p>
          </motion.div>
        </motion.div>

        {/* Enhanced Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: <Heart className="w-8 h-8" />,
              title: "Tươi Mỗi Ngày",
              description:
                "Chúng tôi chỉ chọn những nguyên liệu tươi ngon nhất mỗi ngày để đảm bảo chất lượng tối ưu cho từng món ăn.",
              gradient: "from-[#AF763E] to-[#8B5A2B]",
              delay: 0,
            },
            {
              icon: <Award className="w-8 h-8" />,
              title: "Nghệ Thuật Sushi",
              description:
                "Mỗi món sushi là một tác phẩm nghệ thuật, được tạo nên bởi đôi bàn tay tài hoa của các đầu bếp Takumi.",
              gradient: "from-[#D97706] to-[#AF763E]",
              delay: 0.1,
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Không Gian Nhật",
              description:
                "Thực khách sẽ được trải nghiệm không gian Nhật Bản ấm cúng, tinh tế ngay giữa lòng Sài Gòn.",
              gradient: "from-[#8B5A2B] to-[#D97706]",
              delay: 0.2,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-[#AF763E]/10 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + item.delay }}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(175, 118, 62, 0.2)",
              }}
            >
              {/* Background Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#AF763E]/5 via-transparent to-[#8B5A2B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon Container */}
              <motion.div
                className={`inline-flex p-4 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-lg mb-6 relative z-10`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-[#F8F1E9]">{item.icon}</div>
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent mb-4 group-hover:from-[#8B5A2B] group-hover:to-[#AF763E] transition-all duration-300">
                  {item.title}
                </h3>
                <p className="text-[#AF763E]/80 text-base leading-relaxed group-hover:text-[#AF763E]/90 transition-colors duration-300">
                  {item.description}
                </p>
              </div>

              {/* Decorative Corner Element */}
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#AF763E]/20 to-[#8B5A2B]/20 rounded-full"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 1.5,
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

        {/* Bottom Decorative Elements */}
        <motion.div
          className="flex justify-center mt-16 gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-4 h-4 bg-gradient-to-r from-[#AF763E] to-[#D97706] rounded-full shadow-sm"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
