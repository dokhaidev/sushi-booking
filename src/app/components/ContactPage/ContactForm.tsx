"use client";
import { motion } from "framer-motion";
import type React from "react";

import { Send, User, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="relative bg-gradient-to-br from-[#AF763E] via-[#8B5A2B] to-[#AF763E] py-[60px] px-[90px] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, #F8F1E9 2px, transparent 2px),
                              radial-gradient(circle at 70% 80%, #F8F1E9 1px, transparent 1px)`,
            backgroundSize: "80px 80px, 60px 60px",
          }}
        />
      </div>

      {/* Floating Sushi */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-24 left-24 w-12 h-12 rounded-full border-3 border-[#F8F1E9]/30 bg-[#F8F1E9]/20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-2 bg-[#FF6B47] rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#F8F1E9] rounded-full" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-32 w-10 h-10 rounded-full border-2 border-[#F8F1E9]/20 bg-[#F8F1E9]/10"
          animate={{
            rotate: [360, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 5,
          }}
        >
          <div className="absolute inset-2 bg-[#7FB069] rounded-full" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-20 h-4 bg-[#F8F1E9] rounded-full" />
              <motion.div
                className="absolute -top-1 left-2 w-4 h-4 bg-[#AF763E] border-2 border-[#F8F1E9] rounded-full"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="absolute inset-1 bg-[#FF6B47] rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -top-1 right-2 w-4 h-4 bg-[#AF763E] border-2 border-[#F8F1E9] rounded-full"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="absolute inset-1 bg-[#7FB069] rounded-full" />
              </motion.div>
            </div>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-black text-[#F8F1E9] mb-4 leading-tight">
            Gửi tin nhắn cho chúng tôi
          </h2>
          <p className="text-lg text-[#F8F1E9]/90 max-w-2xl mx-auto">
            Chia sẻ ý kiến, đóng góp hoặc đặt câu hỏi. Chúng tôi sẽ phản hồi sớm
            nhất có thể!
          </p>
        </motion.div>

        <motion.div
          className="bg-[#F8F1E9]/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-[#F8F1E9]/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <User className="w-5 h-5 text-[#AF763E]/60" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Họ và tên"
                  className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-[#AF763E]/20 rounded-2xl focus:border-[#AF763E] focus:outline-none transition-colors duration-200 text-[#AF763E] placeholder-[#AF763E]/60"
                  required
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Mail className="w-5 h-5 text-[#AF763E]/60" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email của bạn"
                  className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-[#AF763E]/20 rounded-2xl focus:border-[#AF763E] focus:outline-none transition-colors duration-200 text-[#AF763E] placeholder-[#AF763E]/60"
                  required
                />
              </motion.div>
            </div>

            {/* Message Field */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="absolute left-4 top-6 z-10">
                <MessageSquare className="w-5 h-5 text-[#AF763E]/60" />
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tin nhắn của bạn..."
                rows={6}
                className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-[#AF763E]/20 rounded-2xl focus:border-[#AF763E] focus:outline-none transition-colors duration-200 text-[#AF763E] placeholder-[#AF763E]/60 resize-none"
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.button
                type="submit"
                className="group relative bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] text-[#F8F1E9] px-8 py-4 rounded-2xl font-bold text-lg shadow-lg border-2 border-[#AF763E]/20 overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(175, 118, 62, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#F8F1E9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <Send className="w-5 h-5" />
                  <span>Gửi tin nhắn</span>
                </div>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
