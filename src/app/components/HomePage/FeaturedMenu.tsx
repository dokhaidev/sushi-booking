import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

export default function FeaturedMenu() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/food/category/1")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else {
          console.warn("Dữ liệu API không phải mảng:", res.data);
          setProducts([]);
        }
      })
      .catch((err) => console.error("Lỗi khi gọi API menu:", err));
  }, []);

  const displayedProducts = products.slice(0, 3);

  // Map Product[] sang CardItem[]
  const cardItems: CardItem[] = displayedProducts.map((item) => ({
    id: typeof item.id === "string" ? parseInt(item.id) : item.id,
    name: item.name,
    jpName: item.jpName,
    price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
    image: item.image,
    type: item.category || "special",
  }));

  return (
    <section
      id="menu"
      className="relative py-[60px] sm:px-16 lg:px-18 bg-[#ffffff] overflow-hidden"
    >
      {/* Decor Background Circles */}
      {/* Góc trái trên */}
      <div className="absolute top-[-80px] left-[-80px] w-[200px] h-[200px] bg-[#dfe3d2] rounded-full opacity-30 z-0" />

      {/* Góc phải trên */}
      <div className="absolute top-[-60px] right-[-60px] w-[140px] h-[140px] bg-[#dfe3d2] rounded-full opacity-20 z-0" />

      {/* Trung tâm bên trái */}
      <div className="absolute top-[35%] left-[1%] w-[160px] h-[160px] bg-[#dfe3d2] rounded-full opacity-20 z-0" />

      {/* Trung tâm chính giữa */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-[#dfe3d2] rounded-full opacity-25 z-0" />

      {/* Trung tâm bên phải */}
      <div className="absolute top-[40%] right-[3%] w-[140px] h-[140px] bg-[#dfe3d2] rounded-full opacity-15 z-0" />

      {/* Góc trái dưới */}
      <div className="absolute bottom-[-80px] left-[-60px] w-[160px] h-[160px] bg-[#dfe3d2] rounded-full opacity-10 z-0" />

      {/* Góc phải dưới */}
      <div className="absolute bottom-[-100px] right-[-80px] w-[220px] h-[220px] bg-[#dfe3d2] rounded-full opacity-15 z-0" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <div className="h-px w-16 md:w-24 bg-[#333333]"></div>
            <h2 className="text-xl md:text-2xl font-bold tracking-widest text-[#333333] uppercase">
              Thực đơn đặc biệt
            </h2>
            <div className="h-px w-16 md:w-24 bg-[#333333]"></div>
          </div>
          <p className="text-[#666666] mt-4">
            Thực đơn đặc biệt với nguyên liệu theo mùa được chọn lọc
          </p>
        </motion.div>

        {/* Danh sách sản phẩm */}
        <CardList data={cardItems} filterType="all" />

        {/* Nút hoặc phần mở rộng nếu cần */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        ></motion.div>
      </div>
    </section>
  );
}
