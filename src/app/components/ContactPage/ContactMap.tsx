"use client";
import { motion } from "framer-motion";
import { MapPin, Clock, Bus } from "lucide-react";

export default function ContactMap() {
  return (
    <section className="bg-[#F8F1E9] py-16 px-6 border-b border-[#AF763E]/20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl overflow-hidden border border-[#AF763E]/30 shadow-sm"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d125402.99854153027!2d106.6795008!3d10.8232704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1747056252176!5m2!1svi!2s"
            width="100%"
            height="360"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          {[
            {
              icon: <MapPin className="w-6 h-6 text-[#AF763E]" />,
              title: "Địa chỉ",
              text: "123 Đường Nhật Bản, Quận 1, TP.HCM",
            },
            {
              icon: <Clock className="w-6 h-6 text-[#AF763E]" />,
              title: "Giờ mở cửa",
              text: "Thứ 2 – Chủ Nhật: 10:00 – 22:00",
            },
            {
              icon: <Bus className="w-6 h-6 text-[#AF763E]" />,
              title: "Phương tiện",
              text: "Gần trạm xe buýt số 03, 36; cách ga Bến Thành 1km",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="p-2 bg-[#AF763E]/10 rounded-md">{item.icon}</div>
              <div>
                <h4 className="text-[#AF763E] font-semibold text-lg mb-1">
                  {item.title}
                </h4>
                <p className="text-[#444] text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}

          {/* Quote */}
          <div className="mt-6 p-4 bg-white/50 rounded-md border border-[#AF763E]/20 text-[#444] italic text-sm shadow-sm">
            “Sushi Takumi không chỉ là món ăn ngon mà còn là trải nghiệm văn hóa
            Nhật.” 🍱
          </div>
        </motion.div>
      </div>
    </section>
  );
}
