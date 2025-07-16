"use client";
import { motion } from "framer-motion";
import { Diamond, Palette, Smile, Sparkles } from "lucide-react";
import Image from "next/image";

export default function Philosophy() {
  return (
    <section className="py-[60px] px-6 lg:px-28 bg-gradient-to-br from-[#FFFAF3] via-[#FFF8F0] to-[#FFFAF3] relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-16 left-16 w-16 h-4 bg-gradient-to-r from-[#AF763E]/15 to-[#8B5A2B]/15 rounded-full"
          animate={{ scaleX: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-10 h-10 border-2 border-[#AF763E]/20 rounded-full bg-[#FFFAF3]/50"
          animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <div className="absolute inset-2.5 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full opacity-50" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Text Content */}
        <motion.div
          className="space-y-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            <h3 className="text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent inline-block animate-gradient">
                Triết Lý Ẩm Thực
              </span>
            </h3>
            <p className="text-[#AF763E]/90 text-lg leading-relaxed">
              Mỗi món ăn tại Sushi Takumi là sự kết hợp giữa kỹ thuật truyền
              thống và tinh thần hiện đại. Từng lát cá được chọn lựa kỹ từ chợ
              Tsukiji, mang lại trải nghiệm ẩm thực trọn vẹn.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: Diamond,
                title: "Chất Lượng Là Hàng Đầu",
                desc: "Nguyên liệu tươi ngon, nhập khẩu từ Nhật và chế biến theo quy trình nghiêm ngặt.",
              },
              {
                icon: Palette,
                title: "Thẩm Mỹ Tinh Tế",
                desc: "Món ăn trình bày nghệ thuật, tôn vinh văn hoá Nhật qua từng đường nét.",
              },
              {
                icon: Smile,
                title: "Khách Hàng Là Trọng Tâm",
                desc: "Không gian và dịch vụ khiến khách như được trải nghiệm Nhật Bản thực thụ.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-[#AF763E]/10 shadow-lg group hover:shadow-xl transition"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * i }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-xl text-white">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
                      {item.title}
                    </h4>
                    <p className="text-[#AF763E]/80 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            className="bg-gradient-to-r from-[#AF763E]/10 to-[#8B5A2B]/10 rounded-xl p-6 border-l-4 border-[#AF763E] text-[#AF763E]/80 italic"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            &quot;Sushi không chỉ là món ăn, mà là cầu nối văn hóa và nghệ thuật
            qua từng lát cá và miếng cơm.&quot;
            <cite className="block mt-2 text-sm font-semibold text-[#AF763E] not-italic">
              — Takumi Yamamoto
            </cite>
          </motion.blockquote>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/img/sushi-hokkaido-sachi.jpg"
              alt="Handmade Sushi"
              width={500}
              height={600}
              className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-lg font-semibold">Nghệ thuật sushi thủ công</p>
              <p className="text-sm opacity-90">Từng chi tiết đều hoàn hảo</p>
            </div>
            <div className="absolute inset-0 border-4 border-[#AF763E]/30 rounded-3xl group-hover:border-[#AF763E]/60 transition" />
          </motion.div>

          <motion.div
            className="absolute -top-4 -right-4 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] text-white rounded-2xl p-4 shadow-xl"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs font-semibold">Premium</div>
              <div className="text-xs opacity-90">Quality</div>
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
              <div className="text-2xl font-bold text-[#AF763E]">30+</div>
              <div className="text-xs text-[#AF763E]/70">Năm kinh nghiệm</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
