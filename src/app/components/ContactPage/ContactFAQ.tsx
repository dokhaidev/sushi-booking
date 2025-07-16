"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Làm thế nào để đặt bàn tại Sushi Takumi?",
      answer:
        "Bạn có thể đặt bàn qua hotline 0909 123 456, hoặc trực tiếp tại nhà hàng. Chúng tôi khuyến khích đặt bàn trước để đảm bảo có chỗ ngồi tốt nhất.",
      icon: "📞",
    },
    {
      question: "Nhà hàng có phục vụ món chay không?",
      answer:
        "Có, chúng tôi có nhiều lựa chọn sushi chay và các món Nhật Bản dành cho người ăn chay. Vui lòng thông báo khi đặt bàn để được tư vấn chi tiết.",
      icon: "🥗",
    },
    {
      question: "Giờ hoạt động của nhà hàng?",
      answer:
        "Sushi Takumi mở cửa từ 11:00 - 14:00 (trưa) và 17:00 - 22:00 (tối) từ thứ 2 đến chủ nhật. Nghỉ thứ 3 hàng tuần.",
      icon: "⏱️",
    },
    {
      question: "Có dịch vụ giao hàng tận nơi không?",
      answer:
        "Hiện tại chúng tôi chưa có dịch vụ giao hàng, nhưng bạn có thể đặt món và đến lấy tại nhà hàng. Chúng tôi sẽ chuẩn bị sẵn để bạn tiết kiệm thời gian.",
      icon: "🚗",
    },
    {
      question: "Nhà hàng có chỗ đậu xe không?",
      answer:
        "Có, chúng tôi có bãi đậu xe miễn phí cho khách hàng ngay trước nhà hàng và khu vực lân cận.",
      icon: "🅿️",
    },
  ];

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#AF763E] mb-2">
            <HelpCircle className="w-5 h-5" />
            <span className="uppercase text-sm tracking-wide font-semibold">
              Giải đáp
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4B3B2A]">
            Câu hỏi thường gặp
          </h2>
          <p className="text-[#6D5F50] mt-3 max-w-xl mx-auto">
            Những điều bạn nên biết khi đến Sushi Takumi.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-[#E7DDD1] rounded-xl p-5 shadow-sm"
            >
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex gap-3 items-center text-[#AF763E] font-medium">
                  <span>{faq.icon}</span>
                  <span>{faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-[#AF763E]" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-3 pl-8 pr-2 text-[#5B4A3B]"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-[#6D5F50] mb-4">
            Bạn vẫn còn câu hỏi? Chúng tôi luôn sẵn sàng hỗ trợ!
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-2 bg-[#AF763E] text-white rounded-full shadow-md hover:shadow-lg transition">
            Liên hệ ngay <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
