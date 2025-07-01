"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function ContactTestimonials() {
  const testimonials = [
    {
      name: "Nguyễn Minh Anh",
      rating: 5,
      comment:
        "Sushi tại đây thực sự tuyệt vời! Tôi đã thử nhiều nhà hàng Nhật nhưng Sushi Takumi vẫn là số 1 trong lòng tôi.",
      avatar: "MA",
    },
    {
      name: "Trần Văn Hùng",
      rating: 5,
      comment:
        "Dịch vụ chu đáo, không gian ấm cúng. Đặc biệt là món sashimi tươi ngon không thể tả được!",
      avatar: "TH",
    },
    {
      name: "Lê Thị Hoa",
      rating: 5,
      comment:
        "Nhà hàng yêu thích của gia đình tôi. Các bé rất thích món California roll và chicken teriyaki.",
      avatar: "LH",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#F8F1E9] via-[#F8F1E9] to-[#F8F1E9]/90 py-[60px] px-[90px] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 40% 60%, #AF763E 1.5px, transparent 1.5px),
                              radial-gradient(circle at 80% 20%, #AF763E 1px, transparent 1px)`,
            backgroundSize: "70px 70px, 50px 50px",
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-24 w-10 h-10 rounded-full border-2 border-[#AF763E]/20 bg-[#F8F1E9]"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-2 bg-[#FF6B47] rounded-full" />
        </motion.div>

        <motion.div
          className="absolute bottom-24 left-20 w-8 h-8 rounded-full border-2 border-[#AF763E]/15 bg-[#F8F1E9]"
          animate={{
            rotate: [360, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="absolute inset-1.5 bg-[#7FB069] rounded-full" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-4 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-2xl shadow-lg">
              <Quote className="w-8 h-8 text-[#F8F1E9]" />
            </div>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-black text-[#AF763E] mb-4 leading-tight">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-lg text-[#AF763E]/80 max-w-2xl mx-auto">
            Những phản hồi chân thực từ khách hàng thân thiết của Sushi Takumi
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-[#AF763E]/10 relative overflow-hidden"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(175, 118, 62, 0.15)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative Quote */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-12 h-12 text-[#AF763E]" />
                </div>

                {/* Avatar */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full flex items-center justify-center text-[#F8F1E9] font-bold text-lg shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-[#AF763E] text-lg">
                      {testimonial.name}
                    </h4>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#FFD23F] text-[#FFD23F]"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-[#AF763E]/80 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>

                {/* Hover Effect */}
                <motion.div className="absolute inset-0 bg-gradient-to-r from-[#AF763E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              </motion.div>

              {/* Floating Sushi Decoration */}
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-[#AF763E] bg-[#F8F1E9] shadow-lg"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.8,
                }}
              >
                <div className="absolute inset-1 bg-[#FFD23F] rounded-full" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <motion.div
          className="flex justify-center mt-12 gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-[#AF763E]/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
