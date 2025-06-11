"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Nguyễn Thị Mai",
    rating: 5,
    comment:
      "Sushi cực ngon, không gian sang trọng và nhân viên rất nhiệt tình. Chắc chắn sẽ quay lại!",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
  {
    name: "Trần Văn Hưng",
    rating: 4,
    comment:
      "Giá cả hợp lý, món ăn chuẩn vị Nhật. Thích nhất là món sashimi siêu tươi!",
    avatar: "https://i.pravatar.cc/100?img=15",
  },
  {
    name: "Lê Thanh Hòa",
    rating: 5,
    comment: "Dịch vụ nhanh chóng, món ăn đẹp mắt và ngon miệng. Rất ấn tượng!",
    avatar: "https://i.pravatar.cc/100?img=23",
  },
  {
    name: "Hoàng Minh",
    rating: 4,
    comment:
      "Không gian yên tĩnh, phù hợp đi cùng gia đình hoặc bạn bè. Highly recommended.",
    avatar: "https://i.pravatar.cc/100?img=11",
  },
];

export default function UserReviews() {
  return (
    <section className="bg-[#FFFAF4] py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#594545] mb-6">
          Khách hàng nói gì về chúng tôi
        </h2>
        <p className="text-[#7B5E5E] mb-10">
          Lắng nghe cảm nhận thực tế từ những thực khách đã trải nghiệm tại
          Sushi Takumi.
        </p>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white h-[200px] rounded-2xl p-6 flex flex-col justify-between  border border-[#FFE9C2]">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#F59E0B]"
                    />
                    <div>
                      <h4 className="text-base font-semibold text-[#594545]">
                        {review.name}
                      </h4>
                      <div className="flex text-[#F59E0B]">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill="#F59E0B"
                            stroke="#F59E0B"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[#7B5E5E] italic">“{review.comment}”</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
