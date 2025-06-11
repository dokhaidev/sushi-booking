"use client";
import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative bg-[url('/img/contact.jpg')] bg-cover bg-center min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Blurred Overlay + Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/50 to-transparent backdrop-blur-md z-0" />

      {/* Floating Particles */}
      <div className="absolute w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping-slow left-[20%] top-[30%]" />
        <div className="absolute w-1.5 h-1.5 bg-orange-300/40 rounded-full animate-ping-slower left-[60%] top-[50%]" />
        <div className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping-slow left-[80%] top-[20%]" />
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center text-white px-6 max-w-3xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-xl">
          <span className="bg-gradient-to-r from-[#F59E0B] via-[#FFB347] to-[#FFD580] bg-clip-text text-transparent">
            Liên hệ với Sushi Takumi
          </span>
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-white/90 mb-6 drop-shadow-sm">
          Hãy để chúng tôi phục vụ bạn một cách chu đáo – đặt bàn, góp ý hay chỉ
          đơn giản là một lời chào!
        </p>

        <motion.a
          href="#contact-form"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-6 py-3 bg-[#F59E0B] hover:bg-[#d98200] transition-all duration-300 text-white font-semibold rounded-full shadow-lg"
        >
          Gửi tin nhắn ngay
        </motion.a>
      </motion.div>
    </section>
  );
}
