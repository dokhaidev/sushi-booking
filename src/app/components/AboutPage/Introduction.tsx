"use client";
import { motion } from "framer-motion";

export default function Introduction() {
  return (
    <section className="relative py-[60px] sm:px-16 lg:px-24 bg-[#F8F1E9] overflow-hidden">
      <motion.div
        className="container mx-auto max-w-5xl text-center relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-[#A68345] tracking-wider mb-6">
          Về Chúng Tôi
        </h2>

        {/* Description */}
        <p className="text-[#666666] text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-12">
          Sushi Takumi là sự kết hợp giữa nghệ thuật chế biến truyền thống Nhật
          Bản và tinh thần hiếu khách hiện đại. Chúng tôi tự hào mang đến những
          món sushi thủ công với hương vị tinh tế, đậm đà và nguyên liệu tươi
          ngon mỗi ngày.
        </p>

        {/* Core values or highlights section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left mt-8">
          <motion.div
            className="bg-white shadow-lg rounded-2xl p-6 border border-[#EADBC8]"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-[#A68345] mb-2">
              Tươi Mỗi Ngày
            </h3>
            <p className="text-[#7B5E5E] text-sm">
              Chúng tôi chỉ chọn những nguyên liệu tươi ngon nhất mỗi ngày để
              đảm bảo chất lượng tối ưu.
            </p>
          </motion.div>

          <motion.div
            className="bg-white shadow-lg rounded-2xl p-6 border border-[#EADBC8]"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold text-[#A68345] mb-2">
              Nghệ Thuật Sushi
            </h3>
            <p className="text-[#7B5E5E] text-sm">
              Mỗi món sushi là một tác phẩm nghệ thuật, được tạo nên bởi đôi bàn
              tay tài hoa của các đầu bếp Takumi.
            </p>
          </motion.div>

          <motion.div
            className="bg-white shadow-lg rounded-2xl p-6 border border-[#EADBC8]"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-[#A68345] mb-2">
              Không Gian Nhật
            </h3>
            <p className="text-[#7B5E5E] text-sm">
              Thực khách sẽ được trải nghiệm không gian Nhật Bản ấm cúng, tinh
              tế ngay giữa lòng Sài Gòn.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
