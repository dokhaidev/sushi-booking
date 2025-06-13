"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ChefHat, Sparkles } from "lucide-react";
import CardList from "../ProductCard/cardList";

interface Product {
  id: number | string;
  name: string;
  image?: string;
  tag?: string;
  jpName?: string;
  price: string | number;
  description?: string;
  category?: string;
  category_id?: number;
}

interface CardItem {
  id: number;
  name: string;
  jpName?: string;
  price: number;
  image?: string;
  type: string;
  category_id?: number;
}

export default function Menus() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/foods");

      let productsData: Product[] = [];

      if (Array.isArray(res.data)) {
        productsData = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        productsData = res.data.data;
      }

      setProducts(productsData);
    } catch (err) {
      console.error("Lỗi khi tải món ăn:", err);
      setError("Không thể tải món ăn. Vui lòng thử lại sau.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayedProducts = products.slice(0, 6);

  const cardItems: CardItem[] = displayedProducts.map((item) => ({
    id: typeof item.id === "string" ? parseInt(item.id) || 0 : item.id,
    name: item.name || "Tên món ăn",
    jpName: item.jpName,
    price:
      typeof item.price === "string" ? parseFloat(item.price) || 0 : item.price,
    image: item.image,
    type: item.category || "special",
    category_id: item.category_id,
  }));

  return (
    <section className="relative py-[60px] sm:px-6 lg:px-20 bg-gradient-to-br from-[#FEFCF8] to-[#F8F5F0] overflow-hidden">
      {/* Decor Circles */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#dfe3d2] rounded-full opacity-20 z-0" />
      <div className="absolute top-1/2 left-[10%] w-36 h-36 bg-[#dfe3d2] rounded-full opacity-15 z-0" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[220px] h-[220px] bg-[#dfe3d2] rounded-full opacity-10 z-0" />

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
              <Sparkles className="text-[#A68345]" size={24} />
              Đặc biệt của bếp trưởng
            </h2>
            <div className="h-px w-12 md:w-24 bg-[#555]" />
          </div>
          <p className="text-[#666] text-sm md:text-base mt-2">
            Những món ăn đặc sắc được chế biến từ nguyên liệu theo mùa
          </p>
        </motion.div>

        {/* Nội dung chính */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-flex items-center gap-2">
              <ChefHat className="animate-spin text-[#A68345]" size={28} />
              <span className="text-[#A68345] font-medium">
                Đang tải món ăn...
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-md animate-pulse"
                >
                  <div className="w-full h-40 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : cardItems.length === 0 ? (
          <div className="text-center py-8 text-[#555]">
            <p>Không có món ăn nào để hiển thị.</p>
            <p className="text-sm text-[#777]">Vui lòng thử lại sau.</p>
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
          >
            <CardList data={cardItems} filterType="all" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
