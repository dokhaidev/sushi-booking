"use client";

import { useEffect, useState } from "react";
import type { MenuItem } from "../../../types/menu";
import axios from "axios";
import { ChefHat } from "lucide-react";
import { motion } from "framer-motion";

export default function RollsSection() {
  const [rolls, setRolls] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<MenuItem[]>([]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  useEffect(() => {
    const fetchRolls = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://127.0.0.1:8000/api/food/category/3"
        );
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        const mappedData: MenuItem[] = data.map((item: any) => ({
          id: typeof item.id === "string" ? Number.parseInt(item.id) : item.id,
          name: item.name,
          jpName: item.jpName,
          price: formatPrice(
            typeof item.price === "string"
              ? Number.parseFloat(item.price)
              : item.price
          ),
          description: item.description,
        }));
        setRolls(mappedData);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu rolls:", err);
        setError("Không thể tải dữ liệu roll.");
      } finally {
        setLoading(false);
      }
    };

    fetchRolls();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => [...prevCart, item]);
    console.log("Đã thêm món vào giỏ:", item.name);
  };

  return (
    <section
      id="rolls"
      className="py-[60px] sm:px-6 lg:px-20 bg-gradient-to-br from-[#FEFCF8] to-[#F8F5F0] relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#dfe3d2] rounded-full opacity-20 z-0" />
      <div className="absolute top-1/2 left-[10%] w-36 h-36 bg-[#dfe3d2] rounded-full opacity-15 z-0" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[220px] h-[220px] bg-[#dfe3d2] rounded-full opacity-10 z-0" />

      <div className="relative z-10 container mx-auto">
        {/* Header Section */}
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
              Rolls
            </h2>
            <div className="h-px w-12 md:w-24 bg-[#555]" />
          </div>
          <p className="text-[#666] text-sm md:text-base mt-2">
            Các loại roll truyền thống và hiện đại
          </p>
        </motion.div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center text-[#A68345] py-6 animate-pulse flex justify-center items-center gap-2">
            <ChefHat className="animate-spin" size={28} />
            Đang tải món ăn...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-6">{error}</div>
        ) : rolls.length === 0 ? (
          <div className="text-center text-[#777] py-6">
            Không có roll nào để hiển thị.
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          >
            {rolls.map((item) => (
              <motion.div
                key={item.id}
                className="border-b border-dashed border-[#ccc] pb-4"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#333]">
                      {item.name}
                      {item.jpName && (
                        <span className="ml-2 italic text-sm text-[#777]">
                          ({item.jpName})
                        </span>
                      )}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-[#666] italic">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#A83D3D] font-bold text-base">
                      {item.price}
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
          </motion.div>
        )}
      </div>
    </section>
  );
}
