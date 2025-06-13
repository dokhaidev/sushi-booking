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
    <section
      id="rolls"
      className="py-[60px] sm:px-16 lg:px-24 bg-gradient-to-br from-[#FEFCF8] to-[#F8F5F0]"
    >
      <div className="container mx-auto">
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
