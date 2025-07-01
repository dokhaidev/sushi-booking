"use client";
import { motion } from "framer-motion";
import { MapPin, Clock, Bus } from "lucide-react";

export default function ContactMap() {
  return (
    <section className="relative bg-gradient-to-br from-[#F8F1E9] via-[#F8F1E9] to-[#F8F1E9]/90 py-[60px] px-[90px] overflow-hidden">
      {/* Sushi Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #AF763E 2px, transparent 2px),
                              radial-gradient(circle at 75% 75%, #AF763E 1px, transparent 1px),
                              radial-gradient(circle at 50% 50%, #AF763E 1.5px, transparent 1.5px)`,
            backgroundSize: "80px 80px, 60px 60px, 100px 100px",
          }}
        />
      </div>

      {/* Floating Sushi Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-16 right-20 w-20 h-20 rounded-full border-4 border-[#AF763E]/20 bg-[#F8F1E9]"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-4 bg-[#FF6B47] rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#7FB069] rounded-full" />
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-16 w-16 h-16 rounded-full border-3 border-[#AF763E]/15 bg-[#F8F1E9]"
          animate={{
            rotate: [360, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <div className="absolute inset-3 bg-[#FFD23F] rounded-full" />
        </motion.div>

        {/* Chopsticks */}
        <motion.div
          className="absolute top-32 left-24 w-32 h-2 bg-[#AF763E]/30 rounded-full"
          animate={{
            rotate: [0, 5, 0, -5, 0],
            scaleX: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />

        <motion.div
          className="absolute bottom-32 right-32 w-28 h-1.5 bg-[#AF763E]/25 rounded-full"
          animate={{
            rotate: [0, -10, 0, 10, 0],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            delay: 4,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Sushi Roll Decoration */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-32 h-6 bg-[#AF763E] rounded-full" />
              <motion.div
                className="absolute -top-1.5 left-6 w-6 h-6 bg-[#F8F1E9] border-3 border-[#AF763E] rounded-full"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="absolute inset-1.5 bg-[#FF6B47] rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -top-1 right-6 w-5 h-5 bg-[#F8F1E9] border-2 border-[#AF763E] rounded-full"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="absolute inset-1 bg-[#7FB069] rounded-full" />
              </motion.div>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#FFD23F] rounded-full" />
            </div>
          </motion.div>

          <motion.h3
            className="text-5xl lg:text-6xl font-black text-[#AF763E] mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textShadow:
                "2px 2px 0px #F8F1E9, 4px 4px 8px rgba(175, 118, 62, 0.2)",
            }}
          >
            Tìm chúng tôi trên bản đồ
          </motion.h3>

          <motion.p
            className="text-xl text-[#AF763E]/80 max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              textShadow: "1px 1px 2px rgba(248, 241, 233, 0.8)",
            }}
          >
            Dễ dàng đến với Sushi Takumi bằng nhiều phương tiện. Chúng tôi luôn
            chào đón bạn!
            <span className="text-2xl ml-2">🗺️</span>
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map Section */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Map Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#AF763E]/20 bg-[#F8F1E9]">
              {/* Decorative Frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#AF763E]/10 to-transparent z-10 pointer-events-none" />

              {/* Sushi Corner Decorations */}
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full border-2 border-[#AF763E]/40 bg-[#F8F1E9] z-20">
                <div className="absolute inset-1.5 bg-[#FF6B47] rounded-full" />
              </div>
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-[#AF763E]/40 bg-[#F8F1E9] z-20">
                <div className="absolute inset-1 bg-[#7FB069] rounded-full" />
              </div>
              <div className="absolute bottom-4 left-4 w-7 h-7 rounded-full border-2 border-[#AF763E]/40 bg-[#F8F1E9] z-20">
                <div className="absolute inset-1.5 bg-[#FFD23F] rounded-full" />
              </div>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d125402.99854153027!2d106.6795008!3d10.8232704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1747056252176!5m2!1svi!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="relative z-0"
              />
            </div>

            {/* Floating Map Pin */}
            <motion.div
              className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full shadow-lg flex items-center justify-center"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <MapPin className="w-6 h-6 text-[#F8F1E9]" />
            </motion.div>
          </motion.div>

          {/* Information Section */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              {
                icon: <MapPin className="w-8 h-8 text-[#F8F1E9]" />,
                title: "Địa chỉ nhà hàng",
                content: "123 Đường Nhật Bản, Phường Bến Nghé, Quận 1, TP.HCM",
                bgColor: "from-[#AF763E] to-[#8B5A2B]",
                sushiColor: "#FF6B47",
              },
              {
                icon: <Clock className="w-8 h-8 text-[#F8F1E9]" />,
                title: "Giờ mở cửa",
                content: "Thứ 2 – Chủ Nhật: 10:00 – 22:00",
                bgColor: "from-[#AF763E] to-[#8B5A2B]",
                sushiColor: "#7FB069",
              },
              {
                icon: <Bus className="w-8 h-8 text-[#F8F1E9]" />,
                title: "Phương tiện đến",
                content:
                  "Gần trạm xe buýt số 03, 36\nCách ga tàu Bến Thành 1km",
                bgColor: "from-[#AF763E] to-[#8B5A2B]",
                sushiColor: "#FFD23F",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <motion.div
                  className={`relative bg-gradient-to-br ${item.bgColor} rounded-2xl shadow-xl p-6 border-3 border-[#F8F1E9]/20 overflow-hidden`}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(175, 118, 62, 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Decorative Sushi Element */}
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-[#F8F1E9]/30 bg-[#F8F1E9]/10">
                    <div
                      className="absolute inset-1 rounded-full"
                      style={{ backgroundColor: item.sushiColor }}
                    />
                  </div>

                  <div className="flex items-start gap-4">
                    {/* Icon Container */}
                    <motion.div
                      className="p-3 bg-[#F8F1E9]/20 backdrop-blur-sm rounded-xl border border-[#F8F1E9]/30 shadow-lg flex-shrink-0"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.icon}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-[#F8F1E9] mb-2 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[#F8F1E9]/90 font-medium leading-relaxed whitespace-pre-line">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#F8F1E9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(45deg, rgba(248, 241, 233, 0.1), transparent)",
                    }}
                  />
                </motion.div>

                {/* Floating Sushi Decoration */}
                <motion.div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#AF763E] bg-[#F8F1E9] shadow-lg"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: idx * 0.7,
                  }}
                >
                  <div
                    className="absolute inset-0.5 rounded-full"
                    style={{ backgroundColor: item.sushiColor }}
                  />
                </motion.div>
              </motion.div>
            ))}

            {/* Quote Section */}
            <motion.div
              className="relative mt-8 p-6 bg-gradient-to-br from-[#F8F1E9] to-[#F8F1E9]/80 rounded-2xl border-3 border-[#AF763E]/20 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {/* Quote Decoration */}
              <div className="absolute top-3 left-3 text-4xl text-[#AF763E]/30 font-bold">
                "
              </div>
              <div className="absolute bottom-3 right-3 text-4xl text-[#AF763E]/30 font-bold">
                "
              </div>

              <p className="text-[#AF763E] italic text-lg leading-relaxed font-medium text-center px-6">
                Đến với Sushi Takumi, bạn không chỉ tìm thấy món ăn ngon mà còn
                là trải nghiệm tinh tế của văn hóa Nhật
                <span className="text-2xl ml-2">🍱</span>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Sushi Train Decoration */}
        <motion.div
          className="flex justify-center mt-16 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <motion.div
              key={index}
              className="w-5 h-5 bg-[#F8F1E9] border-2 border-[#AF763E] rounded-full relative shadow-lg"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.4,
                ease: "easeInOut",
              }}
            >
              <div
                className={`absolute inset-1 rounded-full ${
                  index % 3 === 0
                    ? "bg-[#FF6B47]"
                    : index % 3 === 1
                    ? "bg-[#7FB069]"
                    : "bg-[#FFD23F]"
                }`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
