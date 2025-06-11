"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { MenuItem } from "../../../types/menu";

export default function AppetizersSection() {
  const [appetizers, setAppetizers] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppetizers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://127.0.0.1:8000/api/food/category/1"
        );
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        const mappedData: MenuItem[] = data.map((item: any) => ({
          id: typeof item.id === "string" ? parseInt(item.id) : item.id,
          name: item.name,
          jpName: item.jpName,
          price: typeof item.price === "string" ? item.price : `${item.price}¥`,
          description: item.description,
        }));
        setAppetizers(mappedData);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu khai vị:", err);
        setError("Không thể tải dữ liệu món khai vị.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppetizers();
  }, []);

  return (
    <section
      id="appetizers"
      className="py-[60px] sm:px-16 lg:px-24 bg-[#F8F1E9]"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-[#333333] mb-2 text-center">
          Khai vị
        </h2>
        <p className="text-[#666666] text-center mb-12">
          Khởi đầu bữa ăn với những món khai vị truyền thống
        </p>

        {loading ? (
          <div className="text-center text-[#666666]">Đang tải món ăn...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appetizers.map((item) => (
              <div
                key={item.id}
                className="flex justify-between p-4 border-b border-[#666666]"
              >
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="text-lg font-semibold text-[#333333]">
                      {item.name}
                    </h3>
                    {item.jpName && (
                      <span className="italic ml-2 text-sm text-[#333333]">
                        ( {item.jpName} )
                      </span>
                    )}
                  </div>
                  <p className="text-[#666666] text-sm italic">
                    {item.description}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-[#FF0000] mb-2">
                    {item.price}
                  </span>
                  <button className="text-lg bg-[#8E9482] hover:bg-[#815B5B] text-white px-4 py-1 rounded-md transition-colors">
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
