"use client";

import { useState } from "react";

const images = [
  {
    src: "interior1.jpg",
    title: "Phòng Ăn Chính",
    desc: "Không gian rộng rãi, ánh sáng tự nhiên.",
  },
  {
    src: "interior2.jpg",
    title: "Góc Riêng Tư",
    desc: "Phòng riêng yên tĩnh, thích hợp gặp gỡ.",
  },
  {
    src: "interior3.jpg",
    title: "Khu Vườn Nhật",
    desc: "Thiên nhiên hòa quyện, thư giãn tuyệt vời.",
  },
  {
    src: "interior4.jpg",
    title: "Quầy Bar",
    desc: "Thiết kế sang trọng với đa dạng đồ uống.",
  },
  {
    src: "interior5.jpg",
    title: "Lối Vào",
    desc: "Ấm áp, đón khách thân thiện.",
  },
  {
    src: "interior6.jpg",
    title: "Phòng Tiệc",
    desc: "Không gian rộng, thích hợp tổ chức sự kiện.",
  },
  {
    src: "interior7.jpg",
    title: "Phòng Trà",
    desc: "Trải nghiệm trà đạo truyền thống.",
  },
];

export default function RestaurantGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section className="py-[60px] sm:px-16 lg:px-24 bg-[#F8F1E9]">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h3 className="text-4xl font-bold mb-3 text-[#A68345] flex items-center justify-center gap-3">
          Không Gian Nhà Hàng
        </h3>
        <p className="text-[#666666] text-lg leading-relaxed">
          Tận hưởng không gian ấm cúng, thanh lịch và đậm chất Nhật Bản với
          thiết kế tinh tế.
        </p>
      </div>

      {/* Bố cục 7 ảnh */}
      <div className="max-w-6xl mx-auto grid gap-6">
        {/* Dòng 1 - 3 ảnh */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {images.slice(0, 3).map(({ src, title, desc }, idx) => (
            <div
              key={idx}
              className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg"
              onClick={() => setLightboxIndex(idx)}
            >
              <img
                src={`/img/${src}`}
                alt={title}
                className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white px-4 text-center">
                <h4 className="text-xl font-semibold mb-1">{title}</h4>
                <p className="text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dòng 2 - 4 ảnh nhỏ hơn */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {images.slice(3, 7).map(({ src, title, desc }, idx) => (
            <div
              key={idx + 3}
              className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md"
              onClick={() => setLightboxIndex(idx + 3)}
            >
              <img
                src={`/img/${src}`}
                alt={title}
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white px-2 text-center">
                <h5 className="text-md font-semibold">{title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-4xl max-h-[80vh]">
            <img
              src={`/img/${images[lightboxIndex].src}`}
              alt={images[lightboxIndex].title}
              className="max-w-full max-h-full rounded-lg shadow-xl"
            />
            <button
              className="absolute top-3 right-3 text-white text-3xl font-bold hover:text-red-500"
              onClick={() => setLightboxIndex(null)}
            >
              &times;
            </button>
            <div className="mt-3 text-white text-center px-4">
              <h4 className="text-2xl font-semibold">
                {images[lightboxIndex].title}
              </h4>
              <p className="mt-1">{images[lightboxIndex].desc}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
