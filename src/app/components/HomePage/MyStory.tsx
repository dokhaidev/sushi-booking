"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import {
  ChevronRight,
  Leaf,
  Fish,
  Wheat,
  ChevronsDown,
  Star,
  CalendarDays,
  LucideProps,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

// Define types for our random elements
type RandomElement = {
  id: number;
  width: string;
  height: string;
  left: string;
  top: string;
  y: number[];
  x: number[];
  opacity: number[];
  duration: number;
  delay: number;
};

type FloatingIcon = {
  id: number;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  size: string;
  left: string;
  top: string;
  rotate: number;
  y: number[];
  x: number[];
  rotateAnim: number[];
  duration: number;
  delay: number;
};

export default function MyStory() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // State for random elements with proper typing
  const [randomElements, setRandomElements] = useState<RandomElement[]>([]);
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    // Generate random elements on client side only
    setRandomElements(
      [...Array(15)].map((_, i) => ({
        id: i,
        width: Math.random() * 5 + 1 + "px",
        height: Math.random() * 5 + 1 + "px",
        left: Math.random() * 100 + "%",
        top: Math.random() * 100 + "%",
        y: [0, (Math.random() - 0.5) * 100],
        x: [0, (Math.random() - 0.5) * 50],
        opacity: [0.2, 0.8, 0.2],
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      }))
    );

    setFloatingIcons(
      [Leaf, Fish, Wheat].map((Icon, i) => ({
        id: i,
        Icon,
        size: `${Math.random() * 40 + 40}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        rotate: Math.random() * 360,
        y: [0, (Math.random() - 0.5) * 100],
        x: [0, (Math.random() - 0.5) * 50],
        rotateAnim: [0, Math.random() * 60 - 30],
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  // Rest of the component remains the same...
  return (
    <section
      ref={ref}
      id="about"
      className="relative py-10 px-6 md:px-12 lg:px-24 overflow-hidden min-h-screen flex items-center"
    >
      {/* Background with animation */}
      <motion.div
        style={{ y: yBg, opacity: opacityBg }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/8b/75/2e/8b752e905ac4b1d315b5c57b2b1e2a0f.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9F0]/80 via-[#FAF4EC]/50 to-[#F5EDE3]/90" />
        {randomElements.map((el) => (
          <motion.div
            key={el.id}
            className="absolute bg-[#A68345] rounded-full"
            style={{
              width: el.width,
              height: el.height,
              left: el.left,
              top: el.top,
            }}
            animate={{
              y: el.y,
              x: el.x,
              opacity: el.opacity,
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: el.delay,
            }}
          />
        ))}
      </motion.div>

      {/* Floating icons and circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingIcons.map(
          ({
            id,
            Icon,
            size,
            left,
            top,
            rotate,
            y,
            x,
            rotateAnim,
            duration,
            delay,
          }) => (
            <motion.div
              key={id}
              className="absolute text-[#A68345]/10"
              style={{
                fontSize: size,
                left: left,
                top: top,
                rotate: rotate,
              }}
              animate={{
                y: y,
                x: x,
                rotate: rotateAnim,
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: delay,
              }}
            >
              <Icon size="1em" />
            </motion.div>
          )
        )}

        <motion.div
          className="absolute top-1/4 -left-40 w-80 h-80 rounded-full border border-[#A68345]/20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 -right-40 w-96 h-96 rounded-full border border-[#A68345]/15"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-150px" }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 bg-[#A68345]/5 border border-[#A68345]/20 rounded-full px-6 py-3 mb-10 backdrop-blur-sm"
            >
              <div className="w-2 h-2 bg-[#A68345] rounded-full animate-pulse" />
              <span className="text-[#A68345] text-sm font-medium tracking-widest">
                TINH HOA ẨM THỰC NHẬT BẢN
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight"
            >
              <span className="block text-[#333333] mb-2">Hành trình</span>
              <span className="block relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68345] via-[#BD944A] to-[#D4B04F]">
                  Sushi Takumi
                </span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -right-6 top-0 text-[#A68345]"
                >
                  ✨
                </motion.span>
              </span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{
                delay: 0.6,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true }}
              className="w-32 h-0.5 bg-gradient-to-r from-[#A68345] to-[#BD944A] mb-10 mx-auto lg:mx-0"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, staggerChildren: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6 mb-12"
            >
              <motion.p className="text-[#555555] text-lg leading-relaxed">
                <span className="text-[#A68345] font-semibold">
                  Sushi Takumi
                </span>{" "}
                bắt nguồn từ một tiệm sushi nhỏ ở Tokyo năm 1985, nơi ông nội
                của chúng tôi - bậc thầy sushi Jiro Tanaka - đã dành cả đời để
                hoàn thiện nghệ thuật ẩm thực Nhật Bản.
              </motion.p>
              <motion.p className="text-[#555555] text-lg leading-relaxed">
                Ngày nay, chúng tôi kế thừa di sản đó với sự tôn trọng tuyệt đối
                dành cho nguyên liệu{" "}
                <span className="text-[#A68345] font-semibold">
                  tươi ngon nhất
                </span>
                , kỹ thuật{" "}
                <span className="text-[#A68345] font-semibold">
                  truyền thống
                </span>
                , và sự sáng tạo không ngừng.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    value: "35+",
                    label: "Năm kinh nghiệm",
                    icon: CalendarDays,
                  },
                  { value: "5", label: "Chi nhánh", icon: Star },
                  { value: "100%", label: "Nguyên liệu Nhật", icon: Leaf },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#A68345]/20 hover:shadow-[#A68345]/20 hover:border-[#A68345]/40 transition-all"
                  >
                    <div className="flex flex-col items-center text-[#A68345]">
                      <div className="p-3 mb-3 rounded-full bg-[#A68345]/10">
                        <item.icon size={28} className="text-[#A68345]" />
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {item.value}
                      </div>
                      <div className="text-sm text-[#555] font-medium text-center">
                        {item.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-150px" }}
            className="lg:w-1/2"
          >
            <img
              src="https://i.pinimg.com/736x/5d/80/54/5d80548dfc4bee7bb966b83c568a514b.jpg"
              alt="Sushi Takumi"
              className="rounded-3xl shadow-xl w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
