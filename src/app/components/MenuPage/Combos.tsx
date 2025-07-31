"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChefHat, Users, Star } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "../../lib/i18n/client";

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

const slideVariants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "right" ? 100 : -100,
    opacity: 0,
    position: "absolute" as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative" as const,
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "right" ? -100 : 100,
    opacity: 0,
    position: "absolute" as const,
  }),
};

export default function ComboSlider() {
  const { t, lang } = useTranslation("combos");

  const [combos, setCombos] = useState<Combo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://127.0.0.1:8000/api/combos", {
          params: { lang },
        });

        if (!Array.isArray(res.data)) throw new Error("Invalid data");

        const data = res.data.map((combo: Combo) => ({
          ...combo,
          rating: parseFloat((Math.random() * 0.5 + 4.5).toFixed(1)),
          serving_size: Math.max(
            2,
            Math.min(6, Math.ceil(combo.combo_items.length * 0.6))
          ),
        }));

        setCombos(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(t("error_message"));
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, [t]);

  const nextSlide = () => {
    if (!combos.length) return;
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % combos.length);
  };

  const prevSlide = () => {
    if (!combos.length) return;
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + combos.length) % combos.length);
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="h-96 flex justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-2xl p-8 shadow max-w-md mx-auto">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t("error_title")}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            {t("reload_button")}
          </button>
        </div>
      </div>
    );
  }

  const combo = combos[currentIndex];

  return (
    <section className="py-16 px-6 sm:px-16 bg-white relative overflow-hidden">
      <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-amber-50 opacity-20"></div>
      <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-amber-50 opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm mb-4 border border-amber-100"
          >
            <ChefHat className="text-amber-600" size={18} />
            <span className="text-amber-600 font-medium">{t("badge")}</span>
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <motion.div
          className="relative max-w-5xl mx-auto h-[500px] rounded-3xl overflow-visible bg-white shadow-lg border border-amber-50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <button
            onClick={prevSlide}
            className="absolute z-10 -left-5 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-amber-100 transition border border-amber-100 group"
            aria-label={t("aria_labels.prev_combo")}
          >
            <motion.div whileHover={{ x: -2 }}>
              <ArrowLeft className="text-amber-600 group-hover:text-amber-800" />
            </motion.div>
          </button>
          <button
            onClick={nextSlide}
            className="absolute z-10 -right-5 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-amber-100 transition border border-amber-100 group"
            aria-label={t("aria_labels.next_combo")}
          >
            <motion.div whileHover={{ x: 2 }}>
              <ArrowRight className="text-amber-600 group-hover:text-amber-800" />
            </motion.div>
          </button>

          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.div
              key={combo.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
              className="w-full h-full md:flex px-6 py-6"
            >
              {/* Left content */}
              <div className="md:w-1/2 h-full flex flex-col justify-center gap-4 pr-6">
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                    {combo.name}
                  </h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="text-amber-500 fill-amber-500" size={16} />
                      {combo.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {combo.serving_size} {t("serving_size")}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {combo.description}
                  </p>

                  {/* Combo items with image */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                  {combo.combo_items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-lg px-2 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-md overflow-hidden border border-amber-100 bg-white">
                          <Image
                            src={item.food.image || "/placeholder.svg"}
                            alt={item.food.name}
                            width={36}
                            height={36}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="text-sm text-gray-800 truncate max-w-[100px]">
                          {item.food.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-amber-600">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                </div>

                <div className="mt-4">
                  <div className="text-lg md:text-xl font-bold text-amber-700 mb-3">
                    {parseFloat(combo.price).toLocaleString()} {t("currency")}
                  </div>
                  <button className="w-full bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white py-2 rounded-full font-semibold text-sm sm:text-base hover:opacity-90 transition">
                    {t("order_button")}
                  </button>
                </div>
              </div>

              {/* Right image */}
              <div className="md:w-1/2 flex items-center justify-center relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 rounded-xl border-2 border-amber-50 opacity-30 pointer-events-none"></div>
                {combo.image ? (
                  <Image
                    src={combo.image}
                    alt={`${t("aria_labels.combo_image")}: ${combo.name}`}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded-xl transition duration-300"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = "/placeholder.svg")
                    }
                  />
                ) : (
                  <ChefHat size={48} className="text-amber-400" />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Dots */}
        <motion.div
          className="flex justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {combos.map((_, i) => (
            <motion.div
              key={i}
              onClick={() => goToSlide(i)}
              whileHover={{ scale: 1.2 }}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                i === currentIndex
                  ? "bg-gradient-to-br from-amber-600 to-amber-400 w-5 shadow-sm"
                  : "bg-amber-200 hover:bg-amber-300"
              }`}
              aria-label={`${t("aria_labels.go_to_combo")} ${i + 1}`}
            ></motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
