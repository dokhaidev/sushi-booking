"use client";
import Image from "next/image";

export default function DishItem({ dish }: { dish: any }) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <Image
        src={dish.image}
        alt={dish.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{dish.name}</h3>
        <p className="text-orange-500 font-bold">
          {dish.price.toLocaleString()} đ
        </p>
        <button className="mt-2 bg-orange-400 hover:bg-orange-500 text-white rounded px-4 py-1 text-sm">
          Thêm món
        </button>
      </div>
    </div>
  );
}
