"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface FoodItem {
  name: string;
  price: string;
  bottle?: string;
}

interface Group {
  group_id: number;
  group_name: string;
  foods: FoodItem[];
}

export default function DrinksSection() {
  const [drinkGroups, setDrinkGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/foods/category/6/groups"
        );
        setDrinkGroups(res.data.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu đồ uống:", error);
      }
    };

    fetchDrinks();
  }, []);

  const renderGroup = (group: Group) => {
    return (
      <div key={group.group_id} className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-[#333333] mb-4 pb-2 border-b border-[#666666]">
          {group.group_name}
        </h3>
        {group.foods.length > 0 ? (
          <ul className="space-y-4">
            {group.foods.map((item, index) => (
              <li
                key={index}
                className={
                  group.group_name.toLowerCase().includes("sake")
                    ? "flex flex-col"
                    : "flex justify-between"
                }
              >
                <span className="text-[#594545] font-medium">{item.name}</span>
                <div className="flex justify-between text-sm text-[#333333]">
                  <span className="text-[#ff0000] font-bold text-lg">
                    {item.price}
                  </span>
                  {item.bottle && <span className="italic">{item.bottle}</span>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-[#999]">
            Chưa có món nào trong nhóm này.
          </p>
        )}
      </div>
    );
  };

  return (
    <section id="drinks" className="py-[60px] sm:px-16 lg:px-24 bg-[#B1B6A3]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-[#333333] mb-2 text-center">
          Đồ uống
        </h2>
        <p className="text-[#666666] text-center mb-12">
          Thức uống truyền thống và hiện đại của Nhật Bản
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {drinkGroups.map(renderGroup)}
        </div>
      </div>
    </section>
  );
}
