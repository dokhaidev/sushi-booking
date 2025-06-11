"use client";

import { useEffect, useState } from "react";
import type { MenuItem } from "../../../types/menu";
import axios from "axios";

export default function RollsSection() {
  const [rolls, setRolls] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRolls = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/food/category/3"
        );
        setRolls(response.data); // đảm bảo API trả về mảng các MenuItem
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu roll.");
        setLoading(false);
      }
    };

    fetchRolls();
  }, []);

  return (
    <section id="rolls" className="py-[60px] sm:px-16 lg:px-24 bg-[#B1B6A3]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-[#333333] mb-2 text-center">
          Rolls
        </h2>
        <p className="text-[#666666] text-center mb-12">
          Các loại roll truyền thống và hiện đại
        </p>

        {loading ? (
          <p className="text-center text-[#666]">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rolls.map((item) => (
              <div
                key={item.id}
                className="flex justify-between p-4 border-b border-[#666666]"
              >
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="text-lg font-semibold text-[#333333]">
                      {item.name}
                    </h3>
                    <span className="italic ml-2 text-sm text-[#333333]">
                      ( {item.jpName} )
                    </span>
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
