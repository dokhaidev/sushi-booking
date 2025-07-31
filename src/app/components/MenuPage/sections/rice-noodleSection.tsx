"use client";

import { useEffect, useState } from "react";
import { ChefHat } from "lucide-react";
import { motion } from "framer-motion";

interface FoodItem {
  id: number;
  name: string;
  jpName: string;
  price: string | number;
  desc: string;
}

interface FoodGroup {
  group_id: number;
  group_name: string;
  foods: FoodItem[];
}

export default function RiceNoodlesSection() {
  const [groups, setGroups] = useState<FoodGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/foods/category/4/groups");
        const result = await res.json();

        if (result.type === "group") {
          setGroups(result.data);
        } else {
          setError("Dữ liệu không hợp lệ.");
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
        setError("Không thể tải dữ liệu cơm & mì.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const addToCart = (item: FoodItem) => {
    console.log("Đã thêm món vào giỏ:", item.name);
  };

  return (
    <section
      id="rice"
      className="py-[60px] sm:px-6 lg:px-20 bg-white relative overflow-hidden"
    >
      <div className="relative z-10 container mx-auto">
        {/* Header */}
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

        {/* Content */}
        {loading ? (
          <div className="text-center text-[#A68345] py-6 animate-pulse flex justify-center items-center gap-2">
            <ChefHat className="animate-spin" size={28} />
            Đang tải món ăn...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-6">{error}</div>
        ) : groups.length === 0 ? (
          <div className="text-center text-[#777] py-6">Không có món nào.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {groups.map((group) => (
              <div key={group.group_id}>
                <h3 className="text-lg md:text-xl font-bold text-[#333] mb-4">
                  {group.group_name}
                </h3>
                <div className="space-y-4">
                  {group.foods.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      viewport={{ once: true }}
                      className="border-b border-dashed border-[#ccc] pb-3"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-[#333]">
                            {item.name}
                            {item.jpName && (
                              <span className="ml-2 italic text-sm text-[#777]">
                                ({item.jpName})
                              </span>
                            )}
                          </h4>
                          {item.desc && (
                            <p className="text-sm text-[#666] italic">
                              {item.desc}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#A83D3D] font-bold text-base">
                            {formatPrice(
                              typeof item.price === "string"
                                ? parseFloat(item.price)
                                : item.price
                            )}
                          </span>
                          <button
                            className="bg-[#A68345] hover:bg-[#8D6B32] text-white text-sm px-3 py-1 rounded-full transition"
                            onClick={() => addToCart(item)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
