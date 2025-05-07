import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
    }),
    hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
      >
        <Image
          src="https://i.pinimg.com/736x/ec/75/1f/ec751f453b9bd675a91ef0faaa8890fd.jpg"
          alt="Premium Sushi Selection"
          fill
          className="object-cover brightness-60"
          priority
        />
      </motion.div>

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/80 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-10 pt-24 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
          variants={childVariants}
        >
          Trải nghiệm <span className="text-[#D94F4F]">sushi tuyệt hảo</span>
          <br className="hidden md:block" />
          giữa truyền thống & đổi mới
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-10 max-w-4xl mx-auto font-light"
          variants={childVariants}
        >
          Khám phá hương vị sushi Edo truyền thống được chế tác tinh xảo bởi các
          nghệ nhân Nhật Bản – nơi tinh hoa ẩm thực gặp gỡ không gian hiện đại.
        </motion.p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.div custom={0} variants={buttonVariants} whileHover="hover">
            <Link
              href="/menu"
              className="w-full sm:w-auto bg-[#D94F4F] hover:bg-[#E76B6B] text-white px-8 py-3 rounded-full font-medium transition duration-300 shadow-lg text-center"
            >
              Xem thực đơn
            </Link>
          </motion.div>
          <motion.div custom={1} variants={buttonVariants} whileHover="hover">
            <Link
              href="/reservations"
              className="w-full sm:w-auto border-2 border-[#D4A017] hover:bg-[#D4A017] hover:text-black text-white px-8 py-3 rounded-full font-medium transition duration-300 shadow-lg text-center"
            >
              Đặt bàn
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
