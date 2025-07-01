"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Banner from "@/src/app/components/MenuPage/Banner";
import MenuHeader from "../../../components/MenuPage/MenuHeader";
import AppetizersSection from "../../../components/MenuPage/sections/appertizerSection";
import SushiSection from "../../../components/MenuPage/sections/sushiSection";
import SashimiSection from "../../../components/MenuPage/sections/sashimiSection";
import RollsSection from "../../../components/MenuPage/sections/rollSection";
import RiceNoodlesSection from "../../../components/MenuPage/sections/rice-noodleSection";
import DrinksSection from "../../../components/MenuPage/sections/drinkSection";
import DietaryInfo from "../../../components/MenuPage/DietaryInfo";
import { ChefHat } from "lucide-react";
import ComboSlider from "@/src/app/components/MenuPage/Combos";

const categoryIcons: { [key: string]: string } = {
  Appetizers: "🥢",
  Sushi: "🍣",
  Sashimi: "🐟",
  Rolls: "🍱",
  "Rice & Noodles": "🍜",
  Drinks: "🍹",
};

export default function MenuPage() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const sectionRefs = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
    3: useRef<HTMLDivElement>(null),
    4: useRef<HTMLDivElement>(null),
    5: useRef<HTMLDivElement>(null),
    6: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/category")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleScrollToSection = (id: number) => {
    setSelectedCategoryId(id);
    const section = sectionRefs[id as keyof typeof sectionRefs]?.current;
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const tabVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    hover: {
      y: -3,
      transition: {
        duration: 0.2,
      },
    },
  } as const;

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <Banner />
      {/* Combo Slider */}
      <ComboSlider />

      {/* Enhanced Menu Header */}
      <div className="relative py-8 bg-gradient-to-br from-[#FEFCF8] to-[#F8F5F0]">
        <div className="container mx-auto px-4">
          {/* Title with decorative elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm mb-4">
              <ChefHat className="text-[#A68345]" size={18} />
              <span className="text-[#A68345] font-medium tracking-wider">
                ẨM THỰC NHẬT BẢN
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68345] to-[#BD944A]">
                Thực Đơn Nhà Hàng Chúng Tôi
              </span>
            </h2>

            <p className="text-[#666] max-w-2xl mx-auto">
              Khám phá các món ăn đặc biệt được chế biến từ nguyên liệu tươi
              ngon nhất
            </p>
          </motion.div>

          {/* Enhanced Category Navigation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            className="flex flex-wrap justify-center gap-3 mt-6"
          >
            {categories.map((cate) => (
              <motion.button
                key={cate.id}
                variants={tabVariants}
                whileHover="hover"
                onClick={() => handleScrollToSection(cate.id)}
                className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategoryId === cate.id
                    ? "bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white shadow-lg"
                    : "bg-white text-[#333] border border-[#e0e0e0] hover:border-[#A68345]/50 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {categoryIcons[cate.name] || "🍽️"}
                  </span>
                  <span className="whitespace-nowrap">{cate.name}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Menu Header */}
      <MenuHeader />
      {/* Menu Sections */}
      <div ref={sectionRefs[1]}>
        <AppetizersSection />
      </div>
      <div ref={sectionRefs[5]}>
        <SushiSection />
      </div>
      <div ref={sectionRefs[2]}>
        <SashimiSection />
      </div>
      <div ref={sectionRefs[3]}>
        <RollsSection />
      </div>
      <div ref={sectionRefs[4]}>
        <RiceNoodlesSection />
      </div>
      <div ref={sectionRefs[6]}>
        <DrinksSection />
      </div>
      <DietaryInfo />
    </div>
  );
}
