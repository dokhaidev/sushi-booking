"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface SashimiItem {
  id: number;
  name: string;
  jpName?: string;
  price: number;
  pieces?: string; // cho nhóm đơn lẻ
  desc?: string; // cho bộ sưu tập
  image?: string | null;
}

interface SashimiGroup {
  name: string;
  items: SashimiItem[];
}

export default function SashimiSection() {
  const [groups, setGroups] = useState<SashimiGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          "http://127.0.0.1:8000/api/foods/category/2/groups"
        );

        const raw = Array.isArray(resp.data.data) ? resp.data.data : [];
        const mapped: SashimiGroup[] = raw.map((group: any) => ({
          name: group.group_name,
          items: Array.isArray(group.foods)
            ? group.foods.map((f: any) => ({
                id: f.id,
                name: f.name,
                jpName: f.jpName,
                price: parseFloat(f.price),
                pieces: group.group_id === 1 ? f.description : undefined,
                desc: group.group_id !== 1 ? f.description : undefined,
                image: f.image,
              }))
            : [],
        }));

        setGroups(mapped);
      } catch (err) {
        console.error("Lỗi khi tải sashimi:", err);
        setError("Không thể tải dữ liệu sashimi.");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <section id="sashimi" className="py-[60px] sm:px-16 lg:px-24 bg-[#F8F1E9]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-[#333333] mb-2 text-center">
          Sashimi
        </h2>
        <p className="text-[#666666] text-center mb-12">
          Cá tươi ngon nhất được cắt thành từng lát mỏng
        </p>

        {loading ? (
          <p className="text-center text-gray-600">Đang tải sashimi...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : groups.length === 0 ? (
          <p className="text-center text-gray-500">Không có sashimi nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groups.map((group) => (
              <div key={group.name}>
                <h3 className="text-xl font-semibold text-[#333333] mb-4 pb-2 border-b border-[#666666]">
                  {group.name}
                </h3>

                {group.name === "Sashimi đơn lẻ" ? (
                  <div className="space-y-4">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <div className="flex items-center">
                            <span className="text-[#333333] font-medium">
                              {item.name}
                            </span>
                            {item.jpName && (
                              <span className="text-xs text-[#333333] ml-1 italic">
                                {item.jpName}
                              </span>
                            )}
                          </div>
                          {item.pieces && (
                            <span className="text-xs text-[#666666] italic">
                              {item.pieces}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold text-xl text-[#ff0000] mr-4">
                            ¥{item.price.toFixed(0)}
                          </span>
                          <button className="text-lg bg-[#8E9482] hover:bg-[#815B5B] text-white px-4 py-1 rounded-md transition-colors">
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex bg-white rounded-lg overflow-hidden shadow-sm"
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-1/3 h-40 object-cover"
                        />
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center mb-1">
                              <h4 className="text-[#333333] font-medium">
                                {item.name}
                              </h4>
                              {item.jpName && (
                                <span className="text-xs text-[#333333] ml-1">
                                  {item.jpName}
                                </span>
                              )}
                            </div>
                            {item.desc && (
                              <p className="text-xs text-[#666666] mb-2 italic">
                                {item.desc}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xl text-[#ff0000]">
                              ¥{item.price.toFixed(0)}
                            </span>
                            <button className="text-sm bg-[#8E9482] hover:bg-[#815B5B] text-white px-4 py-2 rounded-md transition-colors">
                              Đặt món
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
