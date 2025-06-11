"use client";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactInfo() {
  return (
    <section className="relative bg-[#FFF9F0] py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-extrabold text-[#594545] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Thông tin liên hệ
        </motion.h2>
        <motion.p
          className="text-[#7B5E5E] text-lg mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Chúng tôi luôn sẵn sàng lắng nghe bạn. Hãy liên hệ để được phục vụ tận
          tình nhất từ đội ngũ của Sushi Takumi.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              title: "Địa chỉ",
              icon: <MapPin className="w-8 h-8 text-[#D97706]" />,
              content: "123 Đường Nhật Bản, Quận 1, TP.HCM",
            },
            {
              title: "Điện thoại",
              icon: <Phone className="w-8 h-8 text-[#D97706]" />,
              content: "0909 123 456",
            },
            {
              title: "Email",
              icon: <Mail className="w-8 h-8 text-[#D97706]" />,
              content: "contact@sushitakumi.vn",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white/80 backdrop-blur-md border border-[#FDEBD0] rounded-2xl shadow-lg p-6 text-left hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-[#FEF3C7] rounded-full shadow">
                  {item.icon}
                </div>
                <h4 className="text-xl font-semibold text-[#594545]">
                  {item.title}
                </h4>
              </div>
              <p className="text-[#7B5E5E] text-base">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
