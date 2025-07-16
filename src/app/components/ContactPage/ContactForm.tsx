"use client";
import { motion } from "framer-motion";
import { Send, User, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="bg-white py-16 px-6 border-b border-[#AF763E]/20">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <motion.div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#AF763E] mb-4"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </motion.div>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-[#AF763E] mb-2"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Liên hệ với chúng tôi
        </motion.h2>
        <p className="text-[#444] max-w-xl mx-auto text-sm">
          Chia sẻ ý kiến, đóng góp hoặc đặt câu hỏi. Chúng tôi sẽ phản hồi sớm
          nhất!
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-[#AF763E]" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Họ và tên"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#AF763E]/20 focus:border-[#AF763E] focus:outline-none text-[#333] placeholder-[#AF763E]/50"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#AF763E]" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email của bạn"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#AF763E]/20 focus:border-[#AF763E] focus:outline-none text-[#333] placeholder-[#AF763E]/50"
              required
            />
          </div>
        </div>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-[#AF763E]" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tin nhắn của bạn..."
            rows={5}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#AF763E]/20 focus:border-[#AF763E] focus:outline-none text-[#333] placeholder-[#AF763E]/50 resize-none"
            required
          />
        </div>
        <div className="text-center">
          <motion.button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#AF763E] text-white font-medium shadow hover:shadow-md transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-4 h-4" /> Gửi tin nhắn
          </motion.button>
        </div>
      </motion.form>
    </section>
  );
}
