"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  MapPin,
} from "lucide-react";

const images = [
  {
    src: "img/interior7.jpg",
    title: "Phòng Ăn Chính",
    desc: "Không gian rộng rãi, ánh sáng tự nhiên tạo cảm giác ấm cúng và thư thái cho thực khách.",
    category: "Dining",
    featured: true,
  },
  {
    src: "img/interior1.jpg",
    title: "Góc Riêng Tư",
    desc: "Phòng riêng yên tĩnh, thích hợp cho các cuộc gặp gỡ quan trọng và bữa ăn riêng tư.",
    category: "Private",
    featured: false,
  },
  {
    src: "img/interior2.jpg",
    title: "Khu Vườn Nhật",
    desc: "Thiên nhiên hòa quyện, không gian xanh mát mang đến cảm giác thư giãn tuyệt vời.",
    category: "Garden",
    featured: true,
  },
  {
    src: "img/interior3.jpg",
    title: "Quầy Bar",
    desc: "Thiết kế sang trọng với đa dạng đồ uống cao cấp và không gian hiện đại.",
    category: "Bar",
    featured: false,
  },
  {
    src: "img/interior4.jpg",
    title: "Lối Vào",
    desc: "Thiết kế ấm áp, đón khách thân thiện với phong cách Nhật Bản truyền thống.",
    category: "Entrance",
    featured: false,
  },
  {
    src: "img/interior5.jpg",
    title: "Phòng Tiệc",
    desc: "Không gian rộng rãi, thích hợp tổ chức các sự kiện đặc biệt và tiệc tùng.",
    category: "Event",
    featured: false,
  },
  {
    src: "img/interior6.jpg",
    title: "Phòng Trà",
    desc: "Trải nghiệm trà đạo truyền thống Nhật Bản trong không gian yên tĩnh, thiền định.",
    category: "Tea",
    featured: true,
  },
];

export default function RestaurantGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1
      );
    }
  };

  const categories = [
    "All",
    "Dining",
    "Private",
    "Garden",
    "Bar",
    "Entrance",
    "Event",
    "Tea",
  ];
  const filteredImages =
    filter === "All" ? images : images.filter((img) => img.category === filter);

  return (
    <section className="py-[60px] px-[90px] bg-gradient-to-br from-[#F8F1E9] via-[#F5EDE3] to-[#F8F1E9] relative overflow-hidden">
      {/* Header Section */}
      <div className="text-center mb-16 max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-wide"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent">
              Không Gian Nhà Hàng
            </span>
          </motion.h3>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-[#AF763E]/90 text-xl font-light leading-relaxed">
              Tận hưởng không gian ấm cúng, thanh lịch và đậm chất Nhật Bản
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === category
                  ? "bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] text-white shadow-md"
                  : "bg-white/80 text-[#AF763E] hover:bg-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="grid gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Featured Images Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredImages
                .filter((img) => img.featured)
                .slice(0, 3)
                .map((image, idx) => {
                  const originalIndex = images.findIndex(
                    (img) => img.src === image.src
                  );
                  return (
                    <motion.div
                      key={originalIndex}
                      className="group relative cursor-pointer rounded-3xl overflow-hidden shadow-xl"
                      onClick={() => setLightboxIndex(originalIndex)}
                      whileHover={{ scale: 1.02, y: -5 }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.6 }}
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <motion.div
                        className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={{ y: 20 }}
                        whileHover={{ y: 0 }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] rounded-full text-xs font-semibold">
                              {image.category}
                            </span>
                            {image.featured && (
                              <Sparkles className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <h4 className="text-2xl font-bold">{image.title}</h4>
                          <p className="text-sm opacity-90 leading-relaxed">
                            {image.desc}
                          </p>
                        </div>
                      </motion.div>

                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="w-4 h-4 text-[#AF763E]" />
                      </div>
                    </motion.div>
                  );
                })}
            </div>

            {/* Regular Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredImages
                .filter((img) => !img.featured)
                .map((image, idx) => {
                  const originalIndex = images.findIndex(
                    (img) => img.src === image.src
                  );
                  return (
                    <motion.div
                      key={originalIndex}
                      className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-lg"
                      onClick={() => setLightboxIndex(originalIndex)}
                      whileHover={{ scale: 1.02, y: -3 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (idx + 3) * 0.1, duration: 0.6 }}
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <motion.div
                        className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ y: 10 }}
                        whileHover={{ y: 0 }}
                      >
                        <span className="px-2 py-1 bg-[#AF763E]/80 rounded-lg text-xs font-semibold mb-2 self-start">
                          {image.category}
                        </span>
                        <h5 className="text-lg font-bold">{image.title}</h5>
                      </motion.div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightboxIndex].src}
                alt={images[lightboxIndex].title}
                className="w-full max-h-[70vh] object-contain"
              />

              <div className="p-6 bg-gradient-to-r from-[#F8F1E9] to-[#F5EDE3]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] text-white rounded-full text-sm font-semibold">
                        {images[lightboxIndex].category}
                      </span>
                      {images[lightboxIndex].featured && (
                        <Sparkles className="w-5 h-5 text-[#AF763E]" />
                      )}
                    </div>
                    <h4 className="text-3xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
                      {images[lightboxIndex].title}
                    </h4>
                  </div>
                </div>
                <p className="text-[#AF763E]/80 leading-relaxed text-lg">
                  {images[lightboxIndex].desc}
                </p>
              </div>

              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-[#AF763E] rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-[#AF763E] rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <button
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-[#AF763E] rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {lightboxIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
