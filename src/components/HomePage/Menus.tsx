"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import CardList from "../ProductCard/cardList";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  description?: string;
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
  category_id?: number; // Thêm category_id để map với tab
}

interface CardItem {
  id: number;
  name: string;
  jpName?: string;
  price: number;
  image?: string;
  type: string;
  category_id?: number; // Thêm category_id cho việc filter
}

export default function Menus() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Lưu tất cả sản phẩm
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(-1); // Đổi thành number thay vì null
  const [loading, setLoading] = useState(false);

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/category");
        if (Array.isArray(res.data)) {
          const allTab = { id: -1, name: "Tất cả", description: null };
          setCategories([allTab, ...res.data]);
        } else {
          console.warn("Dữ liệu danh mục không hợp lệ:", res.data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  // Lấy tất cả sản phẩm một lần khi component mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://127.0.0.1:8000/api/foods");
        let productsData = [];

        if (Array.isArray(res.data)) {
          productsData = res.data;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          productsData = res.data.data;
        } else {
          console.warn("Dữ liệu món ăn không hợp lệ:", res.data);
          productsData = [];
        }

        setAllProducts(productsData);
        setProducts(productsData); // Hiển thị tất cả sản phẩm ban đầu
      } catch (err) {
        console.error("Lỗi khi lấy món ăn:", err);
        setAllProducts([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Filter sản phẩm theo category được chọn
  useEffect(() => {
    if (selectedCategoryId === -1) {
      // Hiển thị tất cả sản phẩm
      setProducts(allProducts);
    } else {
      // Filter theo category_id
      const filteredProducts = allProducts.filter(
        (product) => product.category_id === selectedCategoryId
      );
      setProducts(filteredProducts);
    }
  }, [selectedCategoryId, allProducts]);

  // Lấy 6 sản phẩm đầu tiên để hiển thị
  const displayedProducts = products.slice(0, 6);

  // Chuyển đổi dữ liệu cho CardList
  const cardItems: CardItem[] = displayedProducts.map((item) => ({
    id: typeof item.id === "string" ? parseInt(item.id) : item.id,
    name: item.name,
    jpName: item.jpName,
    price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
    image: item.image,
    type: item.category || "special",
    category_id: item.category_id,
  }));

  const handleTabClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <section
      id="menu"
      className="relative overflow-hidden py-[60px] sm:px-6 lg:px-18 bg-[#ffffff]"
    >
      {/* Decor Circles */}
      <div className="absolute top-[-80px] left-[-80px] w-[200px] h-[200px] bg-[#dfe3d2] rounded-full opacity-30 z-0" />
      <div className="absolute top-[-60px] right-[-60px] w-[140px] h-[140px] bg-[#dfe3d2] rounded-full opacity-20 z-0" />
      <div className="absolute top-[35%] left-[1%] w-[160px] h-[160px] bg-[#dfe3d2] rounded-full opacity-20 z-0" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-[#dfe3d2] rounded-full opacity-25 z-0" />
      <div className="absolute top-[40%] right-[3%] w-[140px] h-[140px] bg-[#dfe3d2] rounded-full opacity-15 z-0" />
      <div className="absolute bottom-[-80px] left-[-60px] w-[160px] h-[160px] bg-[#dfe3d2] rounded-full opacity-10 z-0" />
      <div className="absolute bottom-[-100px] right-[-80px] w-[220px] h-[220px] bg-[#dfe3d2] rounded-full opacity-15 z-0" />

      {/* Nội dung chính */}
      <div className="relative z-10 container mx-auto">
        {/* Tiêu đề */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <div className="h-px w-16 md:w-24 bg-[#333333]"></div>
            <h2 className="text-xl md:text-3xl font-bold tracking-widest text-[#333333] uppercase">
              Thực đơn của chúng tôi
            </h2>
            <div className="h-px w-16 md:w-24 bg-[#333333]"></div>
          </div>
          <p className="text-[#666666] mt-2 text-sm md:text-base">
            Khám phá các món ăn truyền thống và hiện đại được chế biến từ nguyên
            liệu tươi ngon nhất
          </p>
        </motion.div>

        {/* Tabs danh mục */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-10 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleTabClick(cat.id)}
              className={`px-5 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 hover:scale-105
              ${
                selectedCategoryId === cat.id
                  ? "bg-[#A68345] text-white border-none shadow-lg"
                  : "bg-[#F8F1E9] text-[#6B5E3C] border border-[#6B5E3C] hover:border-[#A68345] hover:text-[#A68345]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#A68345]"></div>
          </div>
        )}

        {/* Danh sách món ăn */}
        {!loading && (
          <>
            <CardList
              data={cardItems}
              filterType="all" // Không cần filter ở CardList nữa vì đã filter ở đây
            />

            {/* Hiển thị thông báo nếu không có sản phẩm */}
            {cardItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#666666] text-lg">
                  Không có món ăn nào trong danh mục này
                </p>
              </div>
            )}
          </>
        )}

        {/* Nút xem thêm - chỉ hiển thị khi có nhiều hơn 6 sản phẩm */}
        {products.length > 6 && (
          <div className="text-center mt-8">
            <Link href="/thuc-don">
              <button className="px-6 py-2 rounded-full bg-[#8E9482] text-white hover:bg-[#7a5e5e] transition-all duration-300 hover:scale-105 shadow-md">
                Xem thêm ({products.length - 6} món)
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
