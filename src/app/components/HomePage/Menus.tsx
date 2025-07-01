"use client";

import type React from "react";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { ChefHat, ArrowRight, Search, Star, Clock } from "lucide-react";
import CardList from "../ProductCard/cardList";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from "framer-motion";

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

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
  rating?: number;
  cookTime?: string;
}

interface CardItem {
  id: number;
  name: string;
  jpName?: string;
  price: number;
  image?: string;
  type: string;
  category_id?: number;
  rating?: number;
  cookTime?: string;
}

interface ApiResponse {
  data?: Product[];
  success?: boolean;
  message?: string;
}

const categoryIcons: { [key: string]: string } = {
  "Tất cả": "🍽️",
  Sushi: "🍣",
  Sashimi: "🐟",
  Maki: "🍱",
  Tempura: "🍤",
  Ramen: "🍜",
  Dessert: "🍮",
};

export default function Menus() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      } as Transition,
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1], // Thay string bằng easing function hợp lệ
      } as Transition,
    },
  };

  const tabVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1], // Thay string bằng easing function hợp lệ
      } as Transition,
    },
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const menuElement = document.getElementById("enhanced-menu");
    if (menuElement) {
      observer.observe(menuElement);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch categories with error handling
  const fetchCategories = useCallback(async () => {
    try {
      console.log("Fetching categories..."); // Debug
      const res = await axios.get("http://127.0.0.1:8000/api/category");
      console.log("Categories response:", res.data); // Debug

      if (Array.isArray(res.data)) {
        const allTab: Category = {
          id: -1,
          name: "Tất cả",
          description: "Tất cả món ăn",
          icon: "🍽️",
        };
        const categoriesWithIcons = res.data.map((cat: Category) => ({
          ...cat,
          icon: categoryIcons[cat.name] || "🍽️",
        }));
        const finalCategories = [allTab, ...categoriesWithIcons];
        console.log("Final categories:", finalCategories); // Debug
        setCategories(finalCategories);
      } else {
        console.warn("Dữ liệu danh mục không hợp lệ:", res.data);
        setCategories([]);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh mục:", err);
      setCategories([]);
    }
  }, []);

  // Fetch all products with enhanced error handling
  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<ApiResponse | Product[]>(
        "http://127.0.0.1:8000/api/foods"
      );

      let productsData: Product[] = [];

      if (Array.isArray(res.data)) {
        productsData = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        productsData = res.data.data;
      } else {
        throw new Error("Định dạng dữ liệu không hợp lệ");
      }

      // Add mock data for demo purposes
      const enhancedProducts = productsData.map((product) => ({
        ...product,
        rating: Math.random() * 2 + 3, // Random rating between 3-5
        cookTime: `${Math.floor(Math.random() * 20) + 10} phút`,
      }));

      setAllProducts(enhancedProducts);
      setProducts(enhancedProducts);
    } catch (err) {
      console.error("Lỗi khi lấy món ăn:", err);
      setAllProducts([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, [fetchCategories, fetchAllProducts]);

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategoryId !== -1) {
      filtered = filtered.filter(
        (product) => product.category_id === selectedCategoryId
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.jpName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allProducts, selectedCategoryId, searchTerm]);

  // Update products when filters change
  useEffect(() => {
    setProducts(filteredProducts);
  }, [filteredProducts]);

  // Get displayed products (first 6)
  const displayedProducts = products.slice(0, 6);

  // Transform data for CardList
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
    category_id: item.category_id,
    rating: item.rating,
    cookTime: item.cookTime,
  }));

  const handleTabClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setSearchTerm(""); // Clear search when changing category
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 shadow-sm animate-pulse"
        >
          <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="text-center py-12">
      <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md mx-auto">
        <div className="text-red-500 mb-4 text-4xl">⚠️</div>
        <h3 className="text-lg font-semibold text-[#333333] mb-2">
          Có lỗi xảy ra
        </h3>
        <p className="text-[#666666] mb-4">
          Không thể tải thực đơn. Vui lòng thử lại sau.
        </p>
        <button
          onClick={() => {
            fetchCategories();
            fetchAllProducts();
          }}
          className="bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <section
      id="enhanced-menu"
      className="relative overflow-hidden py-[60px] sm:px-16 lg:px-24 bg-gradient-to-br from-[#FEFCF8] to-[#F8F5F0]"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Floating sushi elements */}
        {["🍣", "🍱", "🥢", "🍤", "🍙"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-5"
            style={{
              left: `${10 + i * 20}%`,
              top: `${15 + (i % 2) * 60}%`,
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
          className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-[#A68345]/10 to-[#BD944A]/5 rounded-full blur-3xl"
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
          className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-tl from-[#F7DED0]/20 to-[#E4B7A0]/10 rounded-full blur-3xl"
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

      <div className="relative z-10 container mx-auto">
        {/* Wrap toàn bộ content trong div có z-index cao */}
        <div className="relative z-20">
          {/* Enhanced Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#A68345]/10 to-[#BD944A]/10 border border-[#A68345]/20 rounded-full px-6 py-3 mb-6"
            >
              <ChefHat className="text-[#A68345]" size={18} />
              <span className="text-[#A68345] text-sm font-medium tracking-wide uppercase">
                THỰC ĐƠN ĐẶC BIỆT
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h2
              variants={itemVariants}
              className="text-4xl lg:text-5xl font-bold text-[#333333] mb-4"
            >
              <span className="block mb-2">美味料理</span>
              <span className="text-transparent bg-gradient-to-r from-[#A68345] to-[#BD944A] bg-clip-text">
                Thực Đơn Tinh Hoa
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-[#666666] text-xl max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Khám phá các món ăn truyền thống và hiện đại được chế biến từ
              nguyên liệu tươi ngon nhất, mang đến trải nghiệm ẩm thực đích thực
              của Nhật Bản
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              className="max-w-md mx-auto mb-8"
            >
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A68345]"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm món ăn..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#A68345]/20 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-[#A68345] focus:bg-white transition-all duration-300 text-[#333333] placeholder-[#666666]"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Category Tabs - Fixed z-index */}
          <div className="relative z-30 bg-transparent">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative z-50 flex flex-wrap justify-center gap-4 mb-12" // Thêm z-50
              style={{ zIndex: 50 }} // Force z-index
            >
              {/* Debug: Hiển thị số lượng categories */}
              {categories.length === 0 && (
                <div className="text-center w-full mb-4">
                  <p className="text-red-500">
                    Đang tải danh mục... ({categories.length} categories loaded)
                  </p>
                </div>
              )}

              {categories.map((cat, index) => (
                <motion.button
                  key={`category-${cat.id}`}
                  variants={tabVariants}
                  custom={index}
                  onClick={() => {
                    console.log("Clicked category:", cat);
                    handleTabClick(cat.id);
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    zIndex: 100,
                    position: "relative",
                    visibility: "visible",
                    display: "flex",
                  }} // Force visibility
                  className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-sm ${
                    selectedCategoryId === cat.id
                      ? "bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-[#333333] border border-[#A68345]/20 hover:border-[#A68345] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {categoryIcons[cat.name] || "🍽️"}
                    </span>
                    <span className="text-sm lg:text-base">{cat.name}</span>
                  </div>
                  {selectedCategoryId === cat.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#BD944A] to-[#A68345] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Fallback categories nếu API fail */}
          {categories.length === 0 && !loading && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { id: -1, name: "Tất cả", icon: "🍽️" },
                { id: 1, name: "Sushi", icon: "🍣" },
                { id: 2, name: "Sashimi", icon: "🐟" },
                { id: 3, name: "Maki", icon: "🍱" },
              ].map((cat, index) => (
                <button
                  key={`fallback-${cat.id}`}
                  onClick={() => handleTabClick(cat.id)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-sm ${
                    selectedCategoryId === cat.id
                      ? "bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-[#333333] border border-[#A68345]/20 hover:border-[#A68345] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm lg:text-base">{cat.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-sm">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#A68345] border-t-transparent"></div>
                  <span className="text-[#A68345] font-medium">
                    Đang tải thực đơn...
                  </span>
                </div>
                <LoadingSkeleton />
              </motion.div>
            ) : cardItems.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm max-w-md mx-auto">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-lg font-semibold text-[#333333] mb-2">
                    Không tìm thấy món ăn
                  </h3>
                  <p className="text-[#666666] mb-4">
                    {searchTerm
                      ? `Không có món ăn nào phù hợp với "${searchTerm}"`
                      : "Không có món ăn nào trong danh mục này"}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-[#A68345] hover:text-[#BD944A] font-medium transition-colors duration-300"
                    >
                      Xóa tìm kiếm
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <CardList data={cardItems} filterType="all" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced View More Section */}
          {products.length > 6 && (
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
                    Còn {products.length - 6} món ngon đang chờ bạn khám phá
                  </span>
                  <Star className="text-[#A68345]" size={20} />
                </div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/thuc-don"
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  >
                    <ChefHat size={20} />
                    <span>Xem toàn bộ thực đơn</span>
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Stats Section */}
          {!loading && cardItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: ChefHat,
                  label: `${allProducts.length}+`,
                  desc: "Món ăn đặc biệt",
                },
                { icon: Star, label: "4.9/5", desc: "Đánh giá trung bình" },
                { icon: Clock, label: "15-30", desc: "Phút phục vụ" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-[#A68345]/10 shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#A68345] to-[#BD944A] rounded-xl mb-3 mx-auto">
                    <stat.icon className="text-white" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-[#333333] mb-1">
                    {stat.label}
                  </div>
                  <div className="text-[#666666] text-sm">{stat.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
