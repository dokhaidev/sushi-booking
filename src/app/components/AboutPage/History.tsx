"use client";
import { motion } from "framer-motion";
import { Clock, Star, Globe, Award, Users, Heart } from "lucide-react";

export default function History() {
  return (
    <section className="bg-white py-[60px] px-[90px] relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-20 h-4 bg-gradient-to-r from-[#AF763E]/20 to-[#8B5A2B]/20 rounded-full"
          animate={{
            scaleX: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-32 left-16 w-8 h-8 border-2 border-[#AF763E]/20 rounded-full bg-white/50"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="absolute inset-2 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full opacity-40" />
        </motion.div>
      </div>

      <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Enhanced Image Section */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
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
              src="img/history.jpg?height=500&width=600"
              alt="Sushi Takumi History - From Tokyo to Saigon"
              className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image Caption */}
            <motion.div
              className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={{ y: 20 }}
              whileHover={{ y: 0 }}
            >
              <p className="font-semibold text-lg">Hành trình 30 năm</p>
              <p className="text-sm opacity-90">Từ Tokyo đến Sài Gòn</p>
            </motion.div>

            {/* Decorative Border */}
            <div className="absolute inset-0 border-4 border-[#AF763E]/30 rounded-3xl group-hover:border-[#AF763E]/60 transition-colors duration-500" />
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            className="absolute -top-4 -right-4 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] text-white rounded-2xl p-4 shadow-xl"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold">30+</div>
              <div className="text-xs opacity-90">Năm kinh nghiệm</div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-4 bg-white border-4 border-[#AF763E]/20 rounded-2xl p-4 shadow-xl"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-[#AF763E]">2</div>
              <div className="text-xs text-[#AF763E]/70">Quốc gia</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Text Content */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: 50 }}
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
                <Clock className="w-5 h-5 text-white" />
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
                Lịch Sử Hình Thành
              </motion.span>
            </h3>

            {/* Enhanced Description */}
            <p className="text-[#AF763E]/80 leading-relaxed text-xl mb-8 max-w-2xl">
              Hành trình từ một cửa hàng nhỏ tại Tokyo đến chuỗi nhà hàng danh
              tiếng tại Việt Nam là kết tinh của đam mê, truyền thống và sáng
              tạo không ngừng nghỉ.
            </p>
          </motion.div>

          {/* Enhanced Timeline */}
          <div className="space-y-8">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                year: "1995",
                location: "Tokyo",
                title: "Khởi Nguồn Đam Mê",
                description:
                  "Đầu bếp trưởng Takumi Yamamoto mở nhà hàng đầu tiên, mang phong cách sushi thủ công độc đáo với triết lý 'mỗi miếng sushi là một tác phẩm nghệ thuật'.",
                gradient: "from-[#AF763E] to-[#8B5A2B]",
                delay: 0.4,
              },
              {
                icon: <Globe className="w-6 h-6" />,
                year: "2015",
                location: "Sài Gòn",
                title: "Mở Rộng Tầm Nhìn",
                description:
                  "Sushi Takumi khai trương tại Việt Nam, kết nối tinh hoa Nhật Bản với văn hóa ẩm thực địa phương, tạo nên sự hòa quyện độc đáo.",
                gradient: "from-[#D97706] to-[#AF763E]",
                delay: 0.6,
              },
              {
                icon: <Star className="w-6 h-6" />,
                year: "2024",
                location: "Hiện tại",
                title: "Thành Tựu Vượt Trội",
                description:
                  "Trở thành điểm đến yêu thích cho thực khách yêu mến sự tinh tế của ẩm thực Nhật Bản, với hơn 10,000 khách hàng thân thiết.",
                gradient: "from-[#8B5A2B] to-[#D97706]",
                delay: 0.8,
              },
            ].map((milestone, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: milestone.delay }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6">
                  {/* Icon Container */}
                  <motion.div
                    className={`flex-shrink-0 p-4 bg-gradient-to-br ${milestone.gradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-white">{milestone.icon}</div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    {/* Year and Location */}
                    <div className="flex items-center gap-3">
                      <motion.span
                        className="text-2xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                      >
                        {milestone.year}
                      </motion.span>
                      <span className="text-[#AF763E]/60 text-lg">—</span>
                      <span className="text-lg font-medium text-[#AF763E]/80">
                        {milestone.location}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-xl font-bold text-[#AF763E] group-hover:text-[#8B5A2B] transition-colors duration-300">
                      {milestone.title}
                    </h4>

                    {/* Description */}
                    <p className="text-[#AF763E]/70 leading-relaxed group-hover:text-[#AF763E]/90 transition-colors duration-300">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Line */}
                {index < 2 && (
                  <motion.div
                    className="absolute left-6 top-20 w-px h-12 bg-gradient-to-b from-[#AF763E]/30 to-[#AF763E]/10"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: milestone.delay + 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Achievement Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 pt-8 border-t border-[#AF763E]/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              {
                icon: <Award className="w-5 h-5" />,
                number: "15+",
                text: "Giải thưởng",
              },
              {
                icon: <Users className="w-5 h-5" />,
                number: "10K+",
                text: "Khách hàng",
              },
              {
                icon: <Heart className="w-5 h-5" />,
                number: "4.9★",
                text: "Đánh giá",
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
        </motion.div>
      </div>
    </section>
  );
}
