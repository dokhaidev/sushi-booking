"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChefHat,
  Award,
  Star,
  Sparkles,
  Users,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const chefs = [
  {
    name: "Takumi Yamamoto",
    title: "Bếp trưởng",
    image: "img/chef1.jpg",
    desc: "30 năm kinh nghiệm, từng làm tại các nhà hàng Michelin tại Tokyo và Osaka. Chuyên gia về nghệ thuật sushi truyền thống.",
    specialties: ["Omakase", "Nigiri", "Sashimi"],
    experience: "30+ năm",
    awards: "5 giải thưởng",
    gradient: "from-[#AF763E] to-[#8B5A2B]",
  },
  {
    name: "Sora Nakamura",
    title: "Chuyên gia Sushi",
    image: "img/chef2.jpg",
    desc: "Tinh thông nigiri, sashimi, truyền thống & sáng tạo. Đã tu nghiệp tại trường Sushi danh tiếng Tokyo Sushi Academy.",
    specialties: ["Nigiri", "Maki", "Temaki"],
    experience: "15+ năm",
    awards: "3 giải thưởng",
    gradient: "from-[#D97706] to-[#AF763E]",
  },
  {
    name: "Hana Suzuki",
    title: "Chuyên gia Món Tráng Miệng",
    image: "img/chef3.jpg",
    desc: "Mỗi món ngọt như một kiệt tác nghệ thuật. Chuyên về wagashi truyền thống và dessert fusion Nhật-Pháp hiện đại.",
    specialties: ["Wagashi", "Mochi", "Dorayaki"],
    experience: "12+ năm",
    awards: "4 giải thưởng",
    gradient: "from-[#8B5A2B] to-[#D97706]",
  },
];

export default function ChefTeam() {
  const [selectedChef, setSelectedChef] = useState<number | null>(null);

  const openChefPopup = (index: number) => {
    setSelectedChef(index);
  };

  const closeChefPopup = () => {
    setSelectedChef(null);
  };

  const nextChef = () => {
    if (selectedChef !== null) {
      setSelectedChef((selectedChef + 1) % chefs.length);
    }
  };

  const prevChef = () => {
    if (selectedChef !== null) {
      setSelectedChef(selectedChef === 0 ? chefs.length - 1 : selectedChef - 1);
    }
  };

  return (
    <section className="bg-white py-[60px] px-[90px] relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-24 w-16 h-4 bg-gradient-to-r from-[#AF763E]/15 to-[#8B5A2B]/15 rounded-full"
          animate={{
            scaleX: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-24 left-20 w-12 h-12 border-2 border-[#AF763E]/20 rounded-full bg-white/50"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        >
          <div className="absolute inset-3 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full opacity-50" />
        </motion.div>

        {/* Floating sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-[#AF763E] to-[#D97706] rounded-full shadow-sm"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.3, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Top Decoration */}
          <motion.div
            className="flex justify-center items-center gap-4 mb-8"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-px bg-gradient-to-r from-transparent via-[#AF763E] to-[#D97706]"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="p-3 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-2xl shadow-lg"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <ChefHat className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
              className="w-20 h-px bg-gradient-to-l from-transparent via-[#AF763E] to-[#D97706]"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              Đội Ngũ Đầu Bếp
            </motion.span>
          </motion.h2>

          {/* Description */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-[#AF763E]/90 text-xl font-light max-w-3xl mx-auto leading-relaxed">
              Từng món ăn tại Sushi Takumi đều là kết quả của niềm đam mê và sự
              tỉ mỉ từ đội ngũ đầu bếp tài hoa.
            </p>
            <p className="text-[#AF763E]/70 text-lg max-w-2xl mx-auto">
              Với hơn 50 năm kinh nghiệm tổng cộng, đội ngũ của chúng tôi mang
              đến những trải nghiệm ẩm thực đỉnh cao.
            </p>
          </motion.div>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {[
            {
              icon: <Users className="w-5 h-5" />,
              number: "3",
              text: "Đầu bếp chuyên nghiệp",
            },
            {
              icon: <Award className="w-5 h-5" />,
              number: "12+",
              text: "Giải thưởng",
            },
            {
              icon: <Star className="w-5 h-5" />,
              number: "50+",
              text: "Năm kinh nghiệm",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-[#AF763E]/20 to-[#8B5A2B]/20 rounded-lg group-hover:from-[#AF763E]/30 group-hover:to-[#8B5A2B]/30 transition-colors duration-300">
                  <div className="text-[#AF763E]">{stat.icon}</div>
                </div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-sm text-[#AF763E]/70">{stat.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Chef Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {chefs.map((chef, index) => (
          <motion.div
            key={index}
            className="group relative bg-white rounded-3xl shadow-xl overflow-hidden border border-[#AF763E]/20 hover:shadow-2xl transition-all duration-500 cursor-pointer"
            onClick={() => openChefPopup(index)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{
              y: -8,
              scale: 1.02,
            }}
          >
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#AF763E]/5 via-transparent to-[#8B5A2B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image Section */}
            <div className="relative overflow-hidden rounded-t-3xl">
              <img
                src={chef.image}
                alt={`${chef.name} - ${chef.title}`}
                className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Experience Badge */}
              <motion.div
                className={`absolute top-4 right-4 bg-gradient-to-br ${chef.gradient} text-white rounded-xl px-3 py-2 shadow-lg`}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xs font-semibold">{chef.experience}</div>
              </motion.div>

              {/* Awards Badge */}
              <motion.div
                className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#AF763E]" />
                  <span className="text-xs font-semibold text-[#AF763E]">
                    {chef.awards}
                  </span>
                </div>
              </motion.div>

              {/* Hover Caption */}
              <motion.div
                className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ y: 20 }}
                whileHover={{ y: 0 }}
              >
                <p className="font-semibold">Chuyên gia ẩm thực</p>
                <p className="text-sm opacity-90">Nghệ thuật sushi Nhật Bản</p>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="p-6 relative z-10">
              {/* Name and Title */}
              <div className="text-center mb-4">
                <h4 className="text-2xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent mb-2 group-hover:from-[#8B5A2B] group-hover:to-[#AF763E] transition-all duration-300">
                  {chef.name}
                </h4>
                <p className="text-[#AF763E]/80 text-sm font-medium italic">
                  {chef.title}
                </p>
              </div>

              {/* Description */}
              <p className="text-[#AF763E]/70 text-sm leading-relaxed mb-4 group-hover:text-[#AF763E]/90 transition-colors duration-300">
                {chef.desc}
              </p>

              {/* Specialties */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-[#AF763E] mb-2">
                  Chuyên môn:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {chef.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gradient-to-r from-[#AF763E]/10 to-[#8B5A2B]/10 text-[#AF763E] text-xs rounded-full border border-[#AF763E]/20 group-hover:from-[#AF763E]/20 group-hover:to-[#8B5A2B]/20 transition-colors duration-300"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="flex justify-between items-center pt-4 border-t border-[#AF763E]/20">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#AF763E]" />
                  <span className="text-xs text-[#AF763E]/70">
                    Đam mê ẩm thực
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-[#FFD700] text-[#FFD700]"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Corner Element */}
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#AF763E]/20 to-[#8B5A2B]/20 rounded-full"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 1.5,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-2 bg-gradient-to-br from-[#D97706] to-[#AF763E] rounded-full opacity-60" />
            </motion.div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#AF763E]/10 to-[#8B5A2B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        ))}
      </div>

      {/* Bottom Quote Section */}
      <motion.div
        className="max-w-4xl mx-auto mt-16 text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="bg-gradient-to-r from-[#AF763E]/10 to-[#8B5A2B]/10 rounded-2xl p-8 border border-[#AF763E]/20 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="w-8 h-8 text-[#AF763E]" />
          </div>
          <blockquote className="text-xl italic text-[#AF763E]/80 leading-relaxed mb-4">
            "Đội ngũ đầu bếp của chúng tôi không chỉ nấu ăn, mà còn truyền tải
            tình yêu và văn hóa Nhật Bản qua từng món ăn."
          </blockquote>
          <cite className="text-sm font-semibold text-[#AF763E] not-italic">
            — Sushi Takumi Team
          </cite>
        </div>
      </motion.div>

      {/* Chef Popup */}
      <AnimatePresence>
        {selectedChef !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChefPopup}
          >
            <motion.div
              className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-none md:rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chef Content - Layout mới */}
              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section - Chiếm 60% chiều rộng */}
                <div className="w-full md:w-3/5 h-1/2 md:h-full relative">
                  <img
                    src={chefs[selectedChef].image}
                    alt={`${chefs[selectedChef].name} - ${chefs[selectedChef].title}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Experience Badge - Lớn hơn */}
                  <div
                    className={`absolute top-6 right-6 bg-gradient-to-br ${chefs[selectedChef].gradient} text-white rounded-xl px-5 py-3 shadow-lg text-lg font-bold`}
                  >
                    {chefs[selectedChef].experience}
                  </div>
                </div>

                {/* Info Section - Chiếm 40% chiều rộng */}
                <div className="w-full md:w-2/5 h-1/2 md:h-full p-8 overflow-y-auto">
                  <div className="mb-8">
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent mb-3">
                      {chefs[selectedChef].name}
                    </h3>
                    <p className="text-2xl text-[#AF763E] font-medium">
                      {chefs[selectedChef].title}
                    </p>
                  </div>

                  <p className="text-lg text-[#AF763E]/90 leading-relaxed mb-8">
                    {chefs[selectedChef].desc}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-2xl font-semibold text-[#AF763E] mb-4">
                      Chuyên môn đặc biệt:
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {chefs[selectedChef].specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-5 py-2 bg-gradient-to-r from-[#AF763E]/10 to-[#8B5A2B]/10 text-[#AF763E] text-lg font-medium rounded-full border border-[#AF763E]/30"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#AF763E]/20 pt-6">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-[#AF763E]" />
                      <span className="text-xl text-[#AF763E]">
                        {chefs[selectedChef].awards} giải thưởng
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-[#FFD700] text-[#FFD700]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons - Lớn hơn */}
              <button
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#AF763E] rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  prevChef();
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#AF763E] rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  nextChef();
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Close Button - Lớn hơn */}
              <button
                className="absolute top-6 right-6 bg-white/90 hover:bg-white text-[#AF763E] rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                onClick={closeChefPopup}
              >
                <X className="w-8 h-8" />
              </button>

              {/* Chef Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-5 py-2 rounded-full text-lg">
                {selectedChef + 1} / {chefs.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
