"use client";
import { motion } from "framer-motion";

const chefs = [
  {
    name: "Takumi Yamamoto",
    title: "Bếp trưởng",
    image: "/img/chef1.jpg",
    desc: "30 năm kinh nghiệm, từng làm tại các nhà hàng Michelin.",
  },
  {
    name: "Sora Nakamura",
    title: "Chuyên gia Sushi",
    image: "/img/chef2.jpg",
    desc: "Tinh thông nigiri, sashimi, truyền thống & sáng tạo.",
  },
  {
    name: "Hana Suzuki",
    title: "Chuyên gia Món Tráng Miệng",
    image: "/img/chef3.jpg",
    desc: "Mỗi món ngọt như một kiệt tác nghệ thuật.",
  },
];

export default function ChefTeam() {
  return (
    <section className="bg-[#fff] py-[60px] sm:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <motion.h2
          className="text-4xl font-bold text-[#A68345] mb-4 tracking-wide"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Đội Ngũ Đầu Bếp
        </motion.h2>
        <p className="text-[#666666] text-lg max-w-3xl mx-auto">
          Từng món ăn tại Sushi Takumi đều là kết quả của niềm đam mê và sự tỉ
          mỉ từ đội ngũ đầu bếp tài hoa.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {chefs.map((chef, index) => (
          <motion.div
            key={index}
            className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-[#A68345] hover:shadow-2xl transition duration-500"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="overflow-hidden rounded-t-3xl">
              <img
                src={chef.image}
                alt={chef.name}
                className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5 text-center">
              <h4 className="text-xl font-semibold text-[#333333]">
                {chef.name}
              </h4>
              <p className="text-[#A68345] text-sm mb-3 italic">{chef.title}</p>
              <p className="text-[#666666] text-sm">{chef.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
