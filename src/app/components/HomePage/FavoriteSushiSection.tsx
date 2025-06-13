"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const sushiList = [
  {
    src: "https://plus.unsplash.com/premium_photo-1668146927669-f2edf6e86f6f?w=600&auto=format&fit=crop&q=60",
    title: "Chirashi (ちらし寿司) – Sushi rải",
  },
  {
    src: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&auto=format&fit=crop&q=60",
    title: "Nigiri (握り寿司) – Sushi nắm",
  },
  {
    src: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60",
    title: "Maki (巻き寿司) – Sushi cuộn",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1668146932065-d08643791942?w=600&auto=format&fit=crop&q=60",
    title: "Temaki (手巻き寿司) – Sushi cuộn tay",
  },
  {
    src: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=600&auto=format&fit=crop&q=60",
    title: "Uramaki – Sushi cuộn ngược",
  },
  {
    src: "https://images.unsplash.com/photo-1563612116625-3012372fccce?w=600&auto=format&fit=crop&q=60",
    title: "Oshi (押し寿司) – Sushi ép",
  },
];

const SushiCard = ({
  src,
  title,
  index,
}: {
  src: string;
  title: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="break-inside-avoid bg-white rounded-3xl overflow-hidden shadow-xl mb-6 group relative h-[280px] transition-all"
  >
    <Image
      src={src}
      alt={title}
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] text-center">
      <div className="bg-black/70 backdrop-blur-md text-white py-2 px-4 rounded-full text-sm font-semibold shadow-lg hover:bg-black/80 transition-colors duration-300">
        {title}
      </div>
    </div>
  </motion.div>
);

const SectionTitle = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="text-center mb-12"
  >
    <div className="flex items-center justify-center gap-6">
      <div className="h-px w-24 bg-[#432D1F]" />
      <h2 className="text-3xl font-bold tracking-widest text-[#432D1F] uppercase">
        Khách hàng yêu thích
      </h2>
      <div className="h-px w-24 bg-[#432D1F]" />
    </div>
    <p className="text-[#666] mt-3 text-base">
      Những món sushi được yêu thích và lựa chọn nhiều nhất bởi thực khách
    </p>
  </motion.div>
);

const CallToAction = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className="relative bg-[#AF763E] text-white rounded-3xl px-6 py-16 overflow-hidden flex flex-col items-center text-center max-w-4xl mx-auto shadow-xl"
  >
    {/* Background image */}
    <div className="absolute inset-0 z-0 opacity-30">
      <Image
        src="https://plus.unsplash.com/premium_photo-1668146932065-d08643791942?w=600&auto=format&fit=crop&q=60"
        alt="Background"
        fill
        className="object-cover"
      />
    </div>

    {/* Main Content */}
    <div className="z-10 max-w-xl">
      <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-snug">
        MÓN TỐI YÊU THÍCH KHIẾN BẠN THÊM MÃI KHÔNG THÔI
      </h3>
      <p className="text-base md:text-lg mb-8">
        Khám phá 88 công thức món tối thơm ngon, dễ làm, đậm đà hương vị và được
        cả gia đình yêu thích.
      </p>
      <button className="bg-white text-[#C06526] font-semibold px-8 py-3 rounded-full hover:bg-orange-100 transition duration-300 shadow-lg">
        Xem công thức ngay
      </button>
    </div>

    {/* Decorative Circles */}
    <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full border-[10px] border-[#FFECEC] overflow-hidden z-10">
      <Image
        src="https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&auto=format&fit=crop&q=60"
        alt="Left circle"
        fill
        className="object-cover"
      />
    </div>
    <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border-[10px] border-[#FFECEC] overflow-hidden z-10">
      <Image
        src="https://plus.unsplash.com/premium_photo-1675453377179-22d446fe10ad?w=600&auto=format&fit=crop&q=60"
        alt="Right circle"
        fill
        className="object-cover"
      />
    </div>
  </motion.div>
);

export default function FavoriteSushiSection() {
  return (
    <section className="bg-[#ffffff] py-[60px] px-4 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <SectionTitle />

        {/* Responsive columns with CSS trick */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 mb-20">
          {sushiList.map((sushi, index) => (
            <SushiCard
              key={index}
              src={sushi.src}
              title={sushi.title}
              index={index}
            />
          ))}
        </div>

        <CallToAction />
      </div>
    </section>
  );
}
