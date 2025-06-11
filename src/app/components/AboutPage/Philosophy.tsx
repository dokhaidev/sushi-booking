"use client";
import { motion } from "framer-motion";
import { Diamond, Palette, Smile } from "lucide-react";

export default function Philosophy() {
  return (
    <section className="py-[60px] sm:px-16 lg:px-24 bg-[#FFFAF3]">
      <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-16 items-center">
        {/* Text block */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-[#A68345] mb-6">
            Triết Lý Ẩm Thực
          </h3>
          <p className="text-[#666666] leading-relaxed text-lg mb-8">
            Mỗi món ăn tại Sushi Takumi là một tác phẩm nghệ thuật, là sự kết
            hợp giữa kỹ thuật truyền thống và tinh thần hiện đại. Từng lát cá
            tươi sống được lựa chọn kỹ lưỡng từ chợ Tsukiji nổi tiếng Nhật Bản,
            kết hợp với bàn tay tỉ mỉ của đầu bếp để tạo nên trải nghiệm ẩm thực
            trọn vẹn.
          </p>

          {/* Core values */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Diamond className="text-[#A68345] mt-1" />
              <div>
                <h4 className="text-xl font-semibold text-[#333333]">
                  Chất Lượng Là Hàng Đầu
                </h4>
                <p className="text-[#666666]">
                  Sử dụng nguyên liệu tươi ngon nhất, nhập khẩu trực tiếp từ
                  Nhật và được xử lý đúng chuẩn.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Palette className="text-[#A68345] mt-1" />
              <div>
                <h4 className="text-xl font-semibold text-[#333333]">
                  Thẩm Mỹ Trong Từng Chi Tiết
                </h4>
                <p className="text-[#666666]">
                  Cách trình bày món ăn tinh tế, đầy nghệ thuật, làm nổi bật bản
                  sắc văn hóa Nhật Bản.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Smile className="text-[#A68345] mt-1" />
              <div>
                <h4 className="text-xl font-semibold text-[#333333]">
                  Trải Nghiệm Khách Hàng Là Trọng Tâm
                </h4>
                <p className="text-[#666666]">
                  Chúng tôi mong muốn mỗi khách hàng khi bước vào đều cảm thấy
                  như đang ở Nhật Bản thực thụ.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Image block */}
        <motion.img
          src="/img/sushi-hokkaido-sachi.jpg"
          alt="Handmade Sushi"
          className="rounded-3xl shadow-xl border-4 border-[#EBDACB]"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />
      </div>
    </section>
  );
}
