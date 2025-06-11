"use client";

import { useEffect, useState, useRef } from "react";
import { StarIcon, HeartIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface CardItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  type: string;
  rating?: number;
  description?: string;
}

interface CardListProps {
  data: CardItem[];
  filterType: string;
}

export default function CardList({ data, filterType }: CardListProps) {
  const [filteredItems, setFilteredItems] = useState<CardItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CardItem | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setSelectedItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lọc sản phẩm theo loại
  useEffect(() => {
    const filtered =
      filterType === "all"
        ? data
        : data.filter((item) => item.type === filterType);
    setFilteredItems(filtered);
  }, [filterType, data]);

  // Ẩn/hiện thanh cuộn khi popup mở/đóng
  useEffect(() => {
    if (selectedItem) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedItem]);

  return (
    <div className="relative">
      {/* Grid sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-visible h-70 flex flex-col cursor-pointer group"
          >
            {/* Hình ảnh và icon */}
            <div className="relative h-40">
              <div className="absolute right-5 -top-6 w-50 h-50 rounded-full border-4 border-white shadow-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                {item.image && (
                  <Image
                    src={`${item.image}`}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="absolute top-3 left-5 flex gap-2">
                <button className="bg-white p-1 rounded-full shadow">
                  <HeartIcon className="h-5 w-5 text-red-500" />
                </button>
                <div className="bg-white px-2 py-1 rounded-full shadow flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs font-medium ml-1 text-gray-700">
                    {item.rating?.toFixed(1) || "4.5"}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-[#333333] line-clamp-2">
                {item.name}
              </h3>

              <div className="flex justify-between items-center mt-4 gap-4">
                <span className="text-red-600 font-bold text-xl flex-1">
                  {Number(item.price).toLocaleString("vi-VN")} VNĐ
                </span>
                <button className="bg-[#AF763E] text-white px-4 py-2 rounded-[30px] hover:bg-[#8a5c3a] transition text-sm whitespace-nowrap">
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup chi tiết */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/50">
          <div
            ref={popupRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#AF763E] p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {selectedItem.name}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-white hover:text-gray-200 transition"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
            </div>

            {/* Nội dung popup */}
            <div className="grid md:grid-cols-2 gap-8 p-8 overflow-y-auto">
              {/* Hình ảnh lớn */}
              <div className="relative rounded-xl overflow-hidden shadow-md max-h-[400px]">
                {selectedItem.image && (
                  <img
                    src={`${selectedItem.image}`}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                )}
              </div>

              {/* Thông tin chi tiết */}
              <div className="flex flex-col justify-between">
                {/* Đánh giá */}
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-5 w-5 ${
                          selectedItem.rating && star <= selectedItem.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-1 text-sm">
                    {selectedItem.rating?.toFixed(1) || "4.5"} / 5
                  </span>
                </div>

                {/* Mô tả */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Mô tả món ăn
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedItem.description ||
                      "Món ăn hấp dẫn với hương vị đặc biệt, được chế biến từ nguyên liệu tươi ngon, phù hợp với mọi đối tượng thực khách."}
                  </p>
                </div>

                {/* Giá và nút hành động */}
                <div className="mt-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <span className="text-2xl font-bold text-red-600">
                      {Number(selectedItem.price).toLocaleString("vi-VN")} VNĐ
                    </span>

                    <div className="flex gap-3">
                      <button className="bg-[#AF763E] text-white px-5 py-2 rounded-full hover:bg-[#8a5c3a] transition font-medium">
                        Thêm vào giỏ hàng
                      </button>

                      <a
                        href={`/dat-mon/${selectedItem.id}`}
                        className="bg-[#3B82F6] text-white px-5 py-2 rounded-full hover:bg-[#2563EB] transition font-medium"
                      >
                        Đặt món ngay
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
