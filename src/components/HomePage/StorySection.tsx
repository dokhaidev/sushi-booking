import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StorySection() {
  return (
    <section className="py-28 bg-gradient-to-b from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Section with Image */}
          <motion.div
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, rotateY: 90 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#E8D5B5]/20 transform hover:shadow-[0_0_30px_rgba(232,213,181,0.3)] transition-all duration-500">
              <Image
                src="https://saigonreview.vn/wp-content/uploads/2024/08/nha-hang-sushi-o-binh-thanh-1.jpg"
                alt="Sushi Chef at Work"
                fill
                className="object-cover transform hover:scale-105 transition duration-700 ease-in-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            {/* Decorative elements */}
            <motion.div
              className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#E8D5B5] rounded-full opacity-10"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute -top-6 -left-6 w-16 h-16 border-2 border-[#E8D5B5] rounded-full opacity-30" />
          </motion.div>

          {/* Right Section with Text */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-1 bg-[#E8D5B5] mr-4"></div>
              <span className="text-[#E8D5B5] font-medium tracking-widest">
                TRUYỀN THỐNG NHẬT BẢN
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-[#E8D5B5] mb-8 leading-tight font-serif">
              Hành trình <span className="text-white">Sushi Takumi</span>
            </h2>

            <p className="text-lg text-[#E8D5B5]/90 mb-6 leading-relaxed">
              Được thành lập bởi bậc thầy sushi Nhật Bản với hơn 30 năm kinh
              nghiệm, Sushi Takumi mang đến tinh hoa ẩm thực Nhật Bản đích thực.
              Mỗi món ăn là sự kết hợp hoàn hảo giữa kỹ thuật truyền thống và sự
              sáng tạo không ngừng.
            </p>

            <p className="text-lg text-[#E8D5B5]/90 mb-10 leading-relaxed">
              Chúng tôi chỉ sử dụng nguyên liệu cao cấp nhất - từ cá tươi được
              đánh bắt hàng ngày tại Nhật Bản đến gạo sushi đặc biệt từ vùng
              Niigata. Mỗi chi tiết đều được chăm chút tỉ mỉ, từ cách cắt cá đến
              nhiệt độ cơm, để mang đến trải nghiệm sushi hoàn hảo nhất.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/about"
                className="inline-block bg-[#E8D5B5] hover:bg-[#F0E5D0] text-[#1A1A1A] px-8 py-3 rounded-lg font-medium text-lg transition duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
              >
                Câu chuyện của chúng tôi
              </Link>
              <Link
                href="/chefs"
                className="inline-block border-2 border-[#E8D5B5] hover:border-[#F0E5D0] text-[#E8D5B5] hover:text-[#F0E5D0] px-8 py-3 rounded-lg font-medium text-lg transition duration-300 transform hover:scale-[1.02]"
              >
                Đội ngũ đầu bếp
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
