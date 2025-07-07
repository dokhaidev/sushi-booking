"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  Users,
  Star,
  Clock,
} from "lucide-react";

interface Food {
  id: number;
  name: string;
  jpName: string | null;
  image: string | null;
  description: string;
  price: string;
}

interface ComboItem {
  id: number;
  quantity: number;
  food: Food;
}

interface Combo {
  id: number;
  name: string;
  image: string | null;
  description: string;
  price: string;
  combo_items: ComboItem[];
  rating: number;
  serving_size: number;
}

export default function ComboSlider() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/combos");

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Dữ liệu không hợp lệ");
        }

        const processedCombos = response.data.map((combo: Combo) => ({
          ...combo,
          rating: parseFloat((Math.random() * 0.5 + 4.5).toFixed(1)),
          serving_size: Math.max(
            2,
            Math.min(6, Math.ceil(combo.combo_items.length * 0.6))
          ),
        }));

        setCombos(processedCombos);
        setError(null);
      } catch (error) {
        console.error("Error fetching combos:", error);
        setError("Không thể tải dữ liệu combo. Vui lòng thử lại sau.");
        setCombos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    if (combos.length === 0) return;
    setDirection("right");
    setCurrentIndex((prev) => (prev === combos.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (combos.length === 0) return;
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? combos.length - 1 : prev - 1));
  };

  // Animation variants for smoother transitions
  const slideVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm max-w-md mx-auto">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Đã xảy ra lỗi
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  if (combos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm max-w-md mx-auto">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Hiện chưa có combo nào
          </h3>
          <p className="text-gray-600">
            Vui lòng quay lại sau khi chúng tôi cập nhật thực đơn
          </p>
        </div>
      </div>
    );
  }

  const currentCombo = combos[currentIndex];

  return (
    <section className="relative py-16 bg-gradient-to-b from-white via-amber-50 to-amber-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-300/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm mb-4">
            <ChefHat className="text-amber-600" size={18} />
            <span className="text-amber-600 font-medium tracking-wider">
              COMBO ƯU ĐÃI
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800">
              Gói Ưu Đãi Đặc Biệt
            </span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Tiết kiệm hơn khi đặt combo cho gia đình và bạn bè
          </p>
        </motion.div>

        {/* Slider */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 -ml-4 hover:scale-110 active:scale-95"
            aria-label="Previous combo"
          >
            <ArrowLeft className="text-amber-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 -mr-4 hover:scale-110 active:scale-95"
            aria-label="Next combo"
          >
            <ArrowRight className="text-amber-600" />
          </button>

          {/* Combo slides */}
          <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-xl bg-white">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 flex flex-col md:flex-row"
              >
                {/* Combo info (left side) */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white">
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                      {currentCombo.name}
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1 text-amber-600">
                        <Star className="fill-amber-500" size={18} />
                        <span className="font-medium">
                          {currentCombo.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users size={18} />
                        <span>{currentCombo.serving_size} người</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6">
                      {currentCombo.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Bao gồm:
                      </h4>
                      <ul className="space-y-2">
                        {currentCombo.combo_items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span className="text-gray-700">
                              {item.food.name}{" "}
                              <span className="text-amber-600">
                                (x{item.quantity})
                              </span>
                            </span>
                          </li>
                        ))}
                        {currentCombo.combo_items.length === 0 && (
                          <li className="text-gray-500">
                            Combo này chưa có món cụ thể
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="text-3xl font-bold text-amber-700 mb-6">
                      {parseFloat(currentCombo.price).toLocaleString()} VNĐ
                    </div>
                    <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95">
                      Đặt Ngay
                    </button>
                  </div>
                </div>

                {/* Combo image (right side) */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-[#363A5B] flex items-center justify-center">
                  {/* Overlay tối hai bên */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#363A5B] via-transparent to-[#363A5B] z-0" />

                  {currentCombo.image ? (
                    <motion.img
                      src={currentCombo.image}
                      alt={currentCombo.name}
                      className="max-h-full max-w-full object-contain z-10 relative"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    />
                  ) : (
                    <motion.div
                      className="w-full h-full flex items-center justify-center text-white z-10 relative"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <ChefHat size={48} />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {combos.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-amber-600" : "bg-amber-200"
                }`}
                aria-label={`Go to combo ${index + 1}`}
                whileHover={{ scale: 1.2 }}
                animate={{
                  width: index === currentIndex ? 24 : 12,
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 px-[90px]"
        >
          {[
            {
              icon: Users,
              label: "2-6 Người",
              desc: "Phù hợp cho gia đình và nhóm bạn",
            },
            {
              icon: Clock,
              label: "15-30 Phút",
              desc: "Thời gian phục vụ nhanh chóng",
            },
            {
              icon: Star,
              label: "4.8/5 Sao",
              desc: "Được yêu thích nhất",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl mb-3 mx-auto">
                <stat.icon className="text-white" size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {stat.label}
              </div>
              <div className="text-gray-600 text-sm">{stat.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
