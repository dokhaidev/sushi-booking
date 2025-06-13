"use client";

import { useEffect, useState } from "react";
import BoxSP from "../../ProductCard/boxSP";
import { ChefHat } from "lucide-react";
import { motion } from "framer-motion";

interface FoodItem {
  id: number;
  name: string;
  jpName: string;
  price: string;
  desc: string;
  image: string;
}

interface FoodGroup {
  group_id: number;
  group_name: string;
  foods: FoodItem[];
}

export default function RiceNoodlesSection() {
  const [groups, setGroups] = useState<FoodGroup[]>([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/foods/category/4/groups"
        );
        const result = await res.json();
        if (result.type === "group") {
          setGroups(result.data);
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <section
      id="rice"
      className="py-[60px] sm:px-16 lg:px-24 bg-gradient-to-br from-[#FAF4EC] via-[#F8F1E9] to-[#F5EDE3]"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 md:gap-5 mb-2">
            <div className="h-px w-12 md:w-24 bg-[#555]" />
            <h2 className="text-xl md:text-3xl font-bold uppercase tracking-wider text-[#444] flex items-center gap-2">
              <ChefHat className="text-[#A68345]" size={24} />
              Cơm & Mì
            </h2>
            <div className="h-px w-12 md:w-24 bg-[#555]" />
          </div>
          <p className="text-[#666] text-sm md:text-base mt-2">
            Các món cơm và mì truyền thống Nhật Bản
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {groups.map((group) => (
            <div key={group.group_id}>
              <h3 className="text-xl font-semibold text-[#333333] mb-6 pb-2 border-b border-[#666666]">
                {group.group_name}
              </h3>
              <div className="space-y-7">
                {group.foods.map((item, index) => (
                  <BoxSP
                    key={index}
                    {...item}
                    titleColor={
                      group.group_name === "Mì" ? "#594545" : undefined
                    }
                    jpColor={group.group_name === "Mì" ? "#9E7676" : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
