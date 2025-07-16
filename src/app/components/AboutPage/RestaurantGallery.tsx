"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import Image from "next/image";

const images = [
  {
    src: "/img/interior7.jpg",
    title: "Phòng Ăn Chính",
    desc: "Không gian rộng rãi, ánh sáng tự nhiên tạo cảm giác ấm cúng và thư thái cho thực khách.",
    category: "Dining",
    featured: true,
  },
  {
    src: "/img/interior1.jpg",
    title: "Góc Riêng Tư",
    desc: "Phòng riêng yên tĩnh, thích hợp cho các cuộc gặp gỡ quan trọng và bữa ăn riêng tư.",
    category: "Private",
    featured: false,
  },
  {
    src: "/img/interior2.jpg",
    title: "Khu Vườn Nhật",
    desc: "Thiên nhiên hòa quyện, không gian xanh mát mang đến cảm giác thư giãn tuyệt vời.",
    category: "Garden",
    featured: true,
  },
  {
    src: "/img/interior3.jpg",
    title: "Quầy Bar",
    desc: "Thiết kế sang trọng với đa dạng đồ uống cao cấp và không gian hiện đại.",
    category: "Bar",
    featured: false,
  },
  {
    src: "/img/interior4.jpg",
    title: "Lối Vào",
    desc: "Thiết kế ấm áp, đón khách thân thiện với phong cách Nhật Bản truyền thống.",
    category: "Entrance",
    featured: false,
  },
  {
    src: "/img/interior5.jpg",
    title: "Phòng Tiệc",
    desc: "Không gian rộng rãi, thích hợp tổ chức các sự kiện đặc biệt và tiệc tùng.",
    category: "Event",
    featured: false,
  },
  {
    src: "/img/interior6.jpg",
    title: "Phòng Trà",
    desc: "Trải nghiệm trà đạo truyền thống Nhật Bản trong không gian yên tĩnh, thiền định.",
    category: "Tea",
    featured: true,
  },
];

export default function RestaurantGallery() {
  const [filter] = useState("All");
  const filteredImages =
    filter === "All" ? images : images.filter((img) => img.category === filter);

  return (
    <section className="py-[60px] px-[90px] bg-[#F8F1E9]">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h3 className="text-4xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
          Không Gian Nhà Hàng
        </h3>
        <p className="mt-4 text-[#AF763E]/90 text-lg">
          Tận hưởng không gian ấm cúng, thanh lịch và đậm chất Nhật Bản
        </p>
      </div>

      {/* Featured Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {filteredImages
          .filter((img) => img.featured)
          .slice(0, 3)
          .map((image, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <Image
                src={image.src}
                alt={image.title}
                width={600}
                height={400}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <span>{image.category}</span>
                  {image.featured && (
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <h4 className="font-semibold text-lg">{image.title}</h4>
                <p className="text-sm opacity-90">{image.desc}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Regular Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredImages
          .filter((img) => !img.featured)
          .map((image, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-lg shadow hover:shadow-md transition duration-300"
            >
              <Image
                src={image.src}
                alt={image.title}
                width={300}
                height={200}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 text-white text-sm">
                <h5>{image.title}</h5>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
