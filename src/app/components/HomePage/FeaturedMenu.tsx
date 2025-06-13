"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChefHat, Sparkles, ArrowRight, Star } from "lucide-react";
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
}

interface CardItem {
  id: number;
  name: string;
  jpName?: string;
  price: number;
  image?: string;
  type: string;
}

interface ApiResponse {
  data?: Product[];
  success?: boolean;
  message?: string;
}

export default function FeaturedMenu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<ApiResponse | Product[]>(
        "http://127.0.0.1:8000/api/food/category/1"
      );

      let productData: Product[] = [];

      if (Array.isArray(response.data)) {
        productData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        productData = response.data.data;
      } else {
        throw new Error("Định dạng dữ liệu không hợp lệ");
      }

      setProducts(productData);
    } catch (err) {
      console.error("Lỗi khi gọi API menu:", err);
      setError("Không thể tải thực đơn. Vui lòng thử lại sau.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayedProducts = products.slice(0, 3);

  // Transform Product[] to CardItem[] with better error handling
  const cardItems: CardItem[] = displayedProducts.map((item) => ({
    id:
      typeof item.id === "string" ? Number.parseInt(item.id, 10) || 0 : item.id,
    name: item.name || "Tên món ăn",
    jpName: item.jpName,
    price:
      typeof item.price === "string"
        ? Number.parseFloat(item.price) || 0
        : item.price,
    image: item.image,
    type: item.category || "special",
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <section className="relative py-[60px] sm:px-16 lg:px-24 bg-gradient-to-br from-[#FEFCF8] to-[#F8F5F0] overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <ChefHat className="animate-spin text-[#A68345]" size={24} />
              <span className="text-[#A68345] font-medium">
                Đang tải thực đơn...
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-[60px] sm:px-16 lg:px-24 bg-gradient-to-br from-[#FEFCF8] to-[#F8F5F0] overflow-hidden">
        <div className="container mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md mx-auto">
            <div className="text-red-500 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-[#333333] mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-[#666666] mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="menu"
      className="relative py-[60px] sm:px-16 lg:px-24 bg-gradient-to-br from-[#FEFCF8] to-[#F8F5F0] overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating sushi elements */}
        {["🍣", "🍱", "🥢"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-5"
            style={{
              left: `${15 + i * 30}%`,
              top: `${20 + (i % 2) * 50}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Gradient orbs */}
        <motion.div
          className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-gradient-to-br from-[#A68345]/10 to-[#BD944A]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-gradient-to-tl from-[#F7DED0]/20 to-[#E4B7A0]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#A68345]/10 to-[#BD944A]/10 border border-[#A68345]/20 rounded-full px-6 py-3 mb-6"
          >
            <Sparkles className="text-[#A68345]" size={18} />
            <span className="text-[#A68345] text-sm font-medium tracking-wide">
              THỰC ĐƠN ĐẶC BIỆT
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-[#333333] mb-4"
          >
            <span className="block mb-2">精選料理</span>
            <span className="text-transparent bg-gradient-to-r from-[#A68345] to-[#BD944A] bg-clip-text">
              Tinh Hoa Ẩm Thực
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-[#666666] text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Những món ăn đặc biệt được chế biến từ nguyên liệu tươi ngon theo
            mùa, mang đến trải nghiệm ẩm thực đích thực của Nhật Bản
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-[#A68345] to-[#BD944A] mx-auto mt-6 rounded-full"
          />
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <CardList data={cardItems} filterType="all" />
        </motion.div>

        {/* View More Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#A68345]/10 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="text-[#A68345]" size={20} />
              <span className="text-[#333333] font-medium">
                Khám phá thêm nhiều món ngon
              </span>
              <Star className="text-[#A68345]" size={20} />
            </div>

            <motion.button
              onClick={() => router.push("/thuc-don")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <ChefHat size={20} />
              <span>Xem toàn bộ thực đơn</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
