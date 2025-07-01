"use client";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactInfo() {
  return (
    <section className="relative bg-gradient-to-br from-[#F8F1E9] via-[#F8F1E9] to-[#F8F1E9]/90 py-[60px] px-[90px] overflow-hidden">
      {/* Sushi Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, #AF763E 2px, transparent 2px),
                              radial-gradient(circle at 60% 70%, #AF763E 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, #AF763E 1.5px, transparent 1.5px)`,
            backgroundSize: "60px 60px, 40px 40px, 80px 80px",
          }}
        />
      </div>

      {/* Floating Sushi Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-16 h-16 rounded-full border-4 border-[#AF763E]/20 bg-[#F8F1E9]"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-3 bg-[#FF6B47] rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#7FB069] rounded-full" />
        </motion.div>

        <motion.div
          className="absolute top-32 right-24 w-12 h-12 rounded-full border-3 border-[#AF763E]/15 bg-[#F8F1E9]"
          animate={{
            rotate: [360, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="absolute inset-2 bg-[#FFD23F] rounded-full" />
        </motion.div>

        <motion.div
          className="absolute bottom-24 left-32 w-10 h-10 rounded-full border-3 border-[#AF763E]/20 bg-[#F8F1E9]"
          animate={{
            rotate: [0, -360],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        >
          <div className="absolute inset-2 bg-[#E85D3D] rounded-full" />
        </motion.div>

        {/* Nori Strips */}
        <motion.div
          className="absolute top-40 right-40 w-20 h-3 bg-[#AF763E]/30 rounded-full"
          animate={{
            scaleX: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />

        <motion.div
          className="absolute bottom-40 right-20 w-16 h-2 bg-[#AF763E]/25 rounded-full"
          animate={{
            scaleX: [1, 0.8, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            delay: 3,
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Header Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Sushi Decoration */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-24 h-4 bg-[#AF763E] rounded-full" />
              <motion.div
                className="absolute -top-1 left-3 w-5 h-5 bg-[#F8F1E9] border-3 border-[#AF763E] rounded-full"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="absolute inset-1 bg-[#FF6B47] rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -top-1 right-3 w-4 h-4 bg-[#F8F1E9] border-2 border-[#AF763E] rounded-full"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="absolute inset-1 bg-[#7FB069] rounded-full" />
              </motion.div>
              <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#FFD23F] rounded-full" />
            </div>
          </motion.div>

          <motion.h2
            className="text-5xl lg:text-6xl font-black text-[#AF763E] mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textShadow:
                "2px 2px 0px #F8F1E9, 4px 4px 8px rgba(175, 118, 62, 0.2)",
            }}
          >
            Thông tin liên hệ
          </motion.h2>

          <motion.p
            className="text-xl text-[#AF763E]/80 max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              textShadow: "1px 1px 2px rgba(248, 241, 233, 0.8)",
            }}
          >
            Chúng tôi luôn sẵn sàng lắng nghe bạn. Hãy liên hệ để được phục vụ
            tận tình nhất từ đội ngũ của Sushi Takumi
            <span className="text-2xl ml-2">🍣</span>
          </motion.p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Địa chỉ nhà hàng",
              icon: <MapPin className="w-10 h-10 text-[#F8F1E9]" />,
              content: "123 Đường Nhật Bản, Quận 1, TP.HCM",
              bgColor: "from-[#AF763E] to-[#8B5A2B]",
              sushiColor: "#FF6B47",
            },
            {
              title: "Hotline đặt bàn",
              icon: <Phone className="w-10 h-10 text-[#F8F1E9]" />,
              content: "0909 123 456",
              bgColor: "from-[#AF763E] to-[#8B5A2B]",
              sushiColor: "#7FB069",
            },
            {
              title: "Email liên hệ",
              icon: <Mail className="w-10 h-10 text-[#F8F1E9]" />,
              content: "contact@sushitakumi.vn",
              bgColor: "from-[#AF763E] to-[#8B5A2B]",
              sushiColor: "#FFD23F",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="group relative h-80"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              {/* Card Background */}
              <motion.div
                className={`relative bg-gradient-to-br ${item.bgColor} rounded-3xl shadow-2xl p-8 text-center overflow-hidden border-4 border-[#F8F1E9]/20 h-[300px] flex flex-col justify-center`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(175, 118, 62, 0.3)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative Sushi Element */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-[#F8F1E9]/30 bg-[#F8F1E9]/10">
                  <div
                    className="absolute inset-1.5 rounded-full"
                    style={{ backgroundColor: item.sushiColor }}
                  />
                </div>

                {/* Icon Container */}
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-4 bg-[#F8F1E9]/20 backdrop-blur-sm rounded-2xl border border-[#F8F1E9]/30 shadow-lg">
                    {item.icon}
                  </div>
                </motion.div>

                {/* Content */}
                <h4 className="text-2xl font-bold text-[#F8F1E9] mb-4 leading-tight">
                  {item.title}
                </h4>
                <p className="text-lg text-[#F8F1E9]/90 font-medium leading-relaxed">
                  {item.content}
                </p>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#F8F1E9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(45deg, rgba(248, 241, 233, 0.1), transparent)",
                  }}
                />
              </motion.div>

              {/* Floating Sushi Decoration */}
              <motion.div
                className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-[#AF763E] bg-[#F8F1E9] shadow-lg"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: idx * 0.5,
                }}
              >
                <div
                  className="absolute inset-1 rounded-full"
                  style={{ backgroundColor: item.sushiColor }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Sushi Train Decoration */}
        <motion.div
          className="flex justify-center mt-16 gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="w-4 h-4 bg-[#F8F1E9] border-2 border-[#AF763E] rounded-full relative shadow-lg"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.3,
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
