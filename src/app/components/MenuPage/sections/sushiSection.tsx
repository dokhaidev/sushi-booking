"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface MenuItem {
  name: string;
  jpName?: string;
  price: string | number;
  desc?: string;
}

interface MenuGroup {
  name: string;
  items: MenuItem[];
}

export default function SushiSection() {
  const [groups, setGroups] = useState<MenuGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          "http://127.0.0.1:8000/api/foods/category/5/groups"
        );
        const rawData = Array.isArray(resp.data)
          ? resp.data
          : resp.data?.data || [];

        const transformedData: MenuGroup[] = rawData.map((group: any) => ({
          name: group.group_name || "Không tên",
          items: Array.isArray(group.foods)
            ? group.foods.map((food: any) => ({
                name: food.name,
                jpName: food.jpName,
                price: food.price,
                desc: food.description,
              }))
            : [],
        }));

        setGroups(transformedData);
      } catch (err) {
        console.error("Lỗi khi tải sushi:", err);
        setError("Không thể tải dữ liệu sushi.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <section id="sushi" className="py-[60px] sm:px-16 lg:px-24 bg-[#B1B6A3]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-[#333333] mb-2 text-center">
          Sushi
        </h2>
        <p className="text-[#666666] text-center mb-3">
          Mỗi miếng sushi được làm thủ công bởi đầu bếp sushi của chúng tôi
        </p>
        <p className="text-[#666666] text-center mb-12 italic">
          Giá cho 2 miếng (nigiri)
        </p>

        {loading ? (
          <div className="text-center text-[#666666]">Đang tải sushi...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {groups.map((group) => (
              <div
                key={group.name}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h3 className="text-xl font-semibold text-[#333333] mb-4 pb-2 border-b border-[#666666]">
                  {group.name}
                </h3>
                <ul className="space-y-4">
                  {group.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <div>
                        <span className="text-[#333333]">{item.name}</span>
                        {item.jpName && (
                          <span className="text-xs text-[#333333] ml-1 italic">
                            {item.jpName}
                          </span>
                        )}
                        {item.desc && (
                          <p className="text-[#666666] text-xs italic">
                            {item.desc}
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-xl text-[#ff0000]">
                        {typeof item.price === "number"
                          ? `¥${item.price}`
                          : `¥${parseFloat(item.price).toFixed(0)}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
