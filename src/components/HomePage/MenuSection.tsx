import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MenuSection() {
  const seasonalItems = [
    {
      name: "Sushi cá hồi mùa thu",
      description:
        "Cá hồi tươi ngon từ Hokkaido với lớp mỡ vừa phải, thái lát mỏng đặt trên nắm cơm sushi truyền thống",
      price: "120,000 VND",
      image:
        "https://file.hstatic.net/200000391061/article/sushi-mon-an-quoc-dan-cua-nguoi-nhat-2_c940b210a8094194b29216c31a3620d0_1024x1024.jpg",
      season: "Thu",
    },
    {
      name: "Tôm biển mùa hè",
      description:
        "Tôm tươi đánh bắt từ vùng biển Kyushu, được chế biến tinh tế giữ nguyên độ ngọt tự nhiên",
      price: "150,000 VND",
      image:
        "https://sushiworld.com.vn/wp-content/uploads/2024/05/Sushi-va-Sashimi-1.jpg",
      season: "Hè",
    },
    {
      name: "Cá ngừ vây xanh",
      description:
        "Cá ngừ chất lượng cao từ vùng biển Aomori, thịt đỏ tươi với vị béo đặc trưng",
      price: "180,000 VND",
      image:
        "https://cdn.tgdd.vn/2020/10/CookProduct/Sushi-la-gi-co-tot-khong-nhung-loai-sushi-tot-va-khong-tot-cho-suc-khoe-1-1200x676.jpg",
      season: "Đông",
    },
    {
      name: "Sashimi lươn biển",
      description:
        "Lươn biển mềm ngọt từ vùng biển Okinawa, thái lát mỏng ăn kèm nước tương đặc biệt",
      price: "200,000 VND",
      image: "https://ussinavietnam.vn/wp-content/uploads/2025/01/c3-1.jpg",
      season: "Xuân",
    },
    {
      name: "Sushi cua tuyết",
      description:
        "Cua tuyết ngọt đậm từ vùng biển lạnh Hokkaido, thịt trắng mịn và thơm ngon",
      price: "220,000 VND",
      image:
        "https://satovietnhat.com.vn/Upload/images/sushi-mon-an-quoc-dan-cua-nguoi-nhat-1.jpg",
      season: "Đông",
    },
    {
      name: "Nigiri sò điệp",
      description:
        "Sò điệp tươi sống từ vùng biển Tohoku, có vị ngọt thanh và kết cấu mềm",
      price: "140,000 VND",
      image: "https://sushiworld.com.vn/wp-content/uploads/2023/11/c.jpg",
      season: "Hè",
    },
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.2,
        ease: [0.16, 0.77, 0.47, 0.97],
      },
    }),
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 0.77, 0.47, 0.97],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 0.77, 0.47, 0.97],
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(217, 79, 79, 0.3)",
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.98,
    },
  };

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, centerPadding: "0px" },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, centerPadding: "0px" },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, centerPadding: "0px" },
      },
    ],
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case "Xuân":
        return "bg-green-100 text-green-800";
      case "Hè":
        return "bg-blue-100 text-blue-800";
      case "Thu":
        return "bg-orange-100 text-orange-800";
      case "Đông":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#FFF9F5] to-[#FFFDFA]">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={textVariants}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D94F4F] to-[#E76B6B]">
              Món ngon theo mùa
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D94F4F] to-[#E76B6B] mx-auto mb-6 rounded-full" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Khám phá các món sushi đặc biệt chế biến từ nguyên liệu tươi ngon
            theo mùa, được tuyển chọn kỹ lưỡng bởi các đầu bếp hàng đầu của
            chúng tôi.
          </p>
        </motion.div>

        {seasonalItems.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Hiện không có món ăn nào
          </p>
        ) : (
          <div className="max-w-full overflow-hidden px-8">
            <Slider {...settings} className="px-2">
              {seasonalItems.map((item, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={cardVariants}
                  whileHover="hover"
                  className="px-3 py-4 h-full"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    {/* Image section - fixed height */}
                    <div className="relative h-64 w-full rounded-t-2xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover hover:scale-110 transition duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeasonColor(
                            item.season
                          )}`}
                        >
                          {item.season}
                        </span>
                      </div>
                    </div>

                    {/* Content section - fixed height container */}
                    <div className="p-5 flex flex-col min-h-[200px]">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-4 mb-4">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <p className="text-[#D94F4F] font-bold text-xl">
                          {item.price}
                        </p>
                        <button className="text-[#D94F4F] hover:text-white hover:bg-[#D94F4F] border border-[#D94F4F] rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-300">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Slider>
          </div>
        )}

        <motion.div
          className="text-center mt-20 max-w-max mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link
            href="/menu"
            className="inline-block bg-gradient-to-r from-[#D94F4F] to-[#E76B6B] text-white px-8 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Xem toàn bộ thực đơn</span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#E76B6B] to-[#D94F4F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        </motion.div>
      </div>

      {/* Inline CSS for Slider */}
      <style jsx global>{`
        .slick-slide > div {
          height: 100%;
        }
        .slick-track {
          display: flex;
          align-items: stretch;
        }
        .slick-prev,
        .slick-next {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          z-index: 10;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .slick-prev:hover,
        .slick-next:hover {
          background: #f8f8f8;
          transform: scale(1.1);
        }
        .slick-prev {
          left: -20px;
        }
        .slick-next {
          right: -20px;
        }
        .slick-prev:before,
        .slick-next:before {
          color: #d94f4f;
          font-size: 18px;
          opacity: 1;
          font-family: "slick";
        }
        .slick-dots {
          bottom: -40px;
        }
        .slick-dots li button:before {
          color: #d94f4f;
          font-size: 10px;
          opacity: 0.5;
        }
        .slick-dots li.slick-active button:before {
          color: #e76b6b;
          opacity: 1;
        }
        .slick-slide {
          padding: 10px 0;
        }
        .slick-center {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }
      `}</style>
    </section>
  );
}
