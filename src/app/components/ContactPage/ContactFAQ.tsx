"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Làm thế nào để đặt bàn tại Sushi Takumi?",
      answer:
        "Bạn có thể đặt bàn qua hotline 0909 123 456, hoặc trực tiếp tại nhà hàng. Chúng tôi khuyến khích đặt bàn trước để đảm bảo có chỗ ngồi tốt nhất.",
    },
    {
      question: "Nhà hàng có phục vụ món chay không?",
      answer:
        "Có, chúng tôi có nhiều lựa chọn sushi chay và các món Nhật Bản dành cho người ăn chay. Vui lòng thông báo khi đặt bàn để được tư vấn chi tiết.",
    },
    {
      question: "Giờ hoạt động của nhà hàng?",
      answer:
        "Sushi Takumi mở cửa từ 11:00 - 14:00 (trưa) và 17:00 - 22:00 (tối) từ thứ 2 đến chủ nhật. Nghỉ thứ 3 hàng tuần.",
    },
    {
      question: "Có dịch vụ giao hàng tận nơi không?",
      answer:
        "Hiện tại chúng tôi chưa có dịch vụ giao hàng, nhưng bạn có thể đặt món và đến lấy tại nhà hàng. Chúng tôi sẽ chuẩn bị sẵn để bạn tiết kiệm thời gian.",
    },
    {
      question: "Nhà hàng có chỗ đậu xe không?",
      answer:
        "Có, chúng tôi có bãi đậu xe miễn phí cho khách hàng ngay trước nhà hàng và khu vực lân cận.",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#F8F1E9] via-[#F8F1E9] to-[#F8F1E9]/90 py-[60px] px-[90px] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #AF763E 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, #AF763E 1px, transparent 1px)`,
            backgroundSize: "50px 50px, 30px 30px",
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-16 right-20 w-8 h-8 rounded-full border-2 border-[#AF763E]/20 bg-[#F8F1E9]"
          animate={{
            rotate: [0, 360],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-1.5 bg-[#7FB069] rounded-full" />
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-16 w-6 h-6 rounded-full border-2 border-[#AF763E]/15 bg-[#F8F1E9]"
          animate={{
            rotate: [360, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <div className="absolute inset-1 bg-[#FFD23F] rounded-full" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
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
              <HelpCircle className="w-8 h-8 text-[#F8F1E9]" />
            </div>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-black text-[#AF763E] mb-4 leading-tight">
            Câu hỏi thường gặp
          </h2>
          <p className="text-lg text-[#AF763E]/80 max-w-2xl mx-auto">
            Những thắc mắc phổ biến về dịch vụ tại Sushi Takumi
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#AF763E]/10 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.button
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-[#F8F1E9]/50 transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                whileHover={{ backgroundColor: "rgba(248, 241, 233, 0.3)" }}
              >
                <span className="text-lg font-semibold text-[#AF763E] pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-[#AF763E]" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-[#AF763E]/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
