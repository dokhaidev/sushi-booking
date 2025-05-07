import Link from "next/link";
import { motion } from "framer-motion";

export default function ReservationSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#FFF9F5] to-[#FFFDFA] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-16 h-16 border border-[#D94F4F] rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-[#D94F4F] rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 border border-[#D94F4F] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-24 h-1 bg-[#D94F4F]"></div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 font-serif">
            Đặt bàn tại <span className="text-[#D94F4F]">Sushi Takumi</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi mang đến trải nghiệm ẩm thực Nhật Bản đích thực với không
            gian ấm cúng và những món sushi tinh tế được chế biến bởi đầu bếp
            hàng đầu.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Link
              href="/reservations"
              className="bg-[#D94F4F] hover:bg-[#E76B6B] text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#D94F4F]/30 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
              Đặt bàn ngay
            </Link>
            <Link
              href="/takeaway"
              className="border-2 border-[#D94F4F] hover:border-[#E76B6B] text-[#D94F4F] hover:text-[#E76B6B] px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#D94F4F]/20 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              Đặt món mang về
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
