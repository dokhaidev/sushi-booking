"use client";
import { useState } from "react";
import DishItem from "./DishItem";

const categories = ["Tất cả", "Sushi", "Maki", "Set", "Đồ uống"];

const dummyData = [
  {
    id: 1,
    name: "Sushi cá hồi",
    price: 120000,
    category: "Sushi",
    image: "/images/sushi1.jpg",
  },
  {
    id: 2,
    name: "Maki thanh cua",
    price: 90000,
    category: "Maki",
    image: "/images/maki1.jpg",
  },
  // thêm dữ liệu giả khác...
];

export default function MenuCategoryTabs() {
  const [activeTab, setActiveTab] = useState("Tất cả");

  const filtered =
    activeTab === "Tất cả"
      ? dummyData
      : dummyData.filter((d) => d.category === activeTab);

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full border ${
              cat === activeTab ? "bg-orange-400 text-white" : "bg-white"
            }`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((dish) => (
          <DishItem key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
}
