"use client";

import { useEffect, useState } from "react";
import BoxSP from "../../ProductCard/boxSP";

interface FoodItem {
  id: number;
  name: string;
  jpName: string;
  price: string;
  desc: string;
  image: string;
}

interface FoodGroup {
  group_id: number;
  group_name: string;
  foods: FoodItem[];
}

export default function RiceNoodlesSection() {
  const [groups, setGroups] = useState<FoodGroup[]>([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/foods/category/4/groups"
        );
        const result = await res.json();
        if (result.type === "group") {
          setGroups(result.data);
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <section id="rice" className="py-[60px] sm:px-16 lg:px-24 bg-[#F8F1E9]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-[#333333] mb-2 text-center">
          Cơm & Mì
        </h2>
        <p className="text-[#666666] text-center mb-12">
          Các món cơm và mì truyền thống Nhật Bản
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {groups.map((group) => (
            <div key={group.group_id}>
              <h3 className="text-xl font-semibold text-[#333333] mb-6 pb-2 border-b border-[#666666]">
                {group.group_name}
              </h3>
              <div className="space-y-7">
                {group.foods.map((item, index) => (
                  <BoxSP
                    key={index}
                    {...item}
                    titleColor={
                      group.group_name === "Mì" ? "#594545" : undefined
                    }
                    jpColor={group.group_name === "Mì" ? "#9E7676" : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
