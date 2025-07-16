"use client";
import { Award, Heart, Lightbulb, Star } from "lucide-react";

export default function CoreValues() {
  const values = [
    {
      title: "Chất lượng",
      desc: "Nguyên liệu tươi sống và kỹ thuật chế biến chuẩn Nhật.",
      detail:
        "Chúng tôi cam kết sử dụng nguyên liệu tươi ngon, được chọn lọc kỹ càng từ các nhà cung cấp uy tín, kết hợp cùng kỹ thuật chế biến truyền thống Nhật Bản để mang đến trải nghiệm ẩm thực đỉnh cao.",
      icon: <Award className="w-8 h-8 text-[#AF763E]" />,
      stats: "100%",
      statsLabel: "Tươi ngon",
    },
    {
      title: "Tôn trọng",
      desc: "Đối xử với khách hàng như thượng khách trong văn hóa Nhật.",
      detail:
        "Chúng tôi luôn đặt khách hàng lên hàng đầu, mang đến sự tận tâm, lịch thiệp và không gian phục vụ đúng chuẩn tinh thần hiếu khách Nhật Bản.",
      icon: <Heart className="w-8 h-8 text-[#AF763E]" />,
      stats: "4.9★",
      statsLabel: "Đánh giá",
    },
    {
      title: "Sáng tạo",
      desc: "Luôn đổi mới thực đơn nhưng vẫn giữ hồn sushi truyền thống.",
      detail:
        "Chúng tôi không ngừng sáng tạo để làm mới thực đơn, kết hợp các nguyên liệu độc đáo, mang đến trải nghiệm ẩm thực đa dạng nhưng vẫn giữ vững giá trị truyền thống.",
      icon: <Lightbulb className="w-8 h-8 text-[#AF763E]" />,
      stats: "50+",
      statsLabel: "Món đặc sắc",
    },
  ];

  return (
    <section className="bg-white py-[60px] px-[90px]">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide mb-6 bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent">
          Giá Trị Cốt Lõi
        </h3>
        <p className="text-[#AF763E]/90 text-xl font-light leading-relaxed max-w-5xl mx-auto">
          Ba giá trị then chốt tạo nên bản sắc và trải nghiệm đậm chất Nhật Bản
          trong từng món ăn và dịch vụ của chúng tôi.
        </p>
        <p className="text-[#AF763E]/70 text-lg max-w-3xl mx-auto mt-2">
          Những nguyên tắc này định hướng mọi hoạt động và cam kết của Sushi
          Takumi.
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
          {[
            {
              icon: <Award className="w-5 h-5 text-[#AF763E]" />,
              number: "3",
              text: "Giá trị cốt lõi",
            },
            {
              icon: <Star className="w-5 h-5 text-[#AF763E]" />,
              number: "15+",
              text: "Năm kinh nghiệm",
            },
            {
              icon: <Heart className="w-5 h-5 text-[#AF763E]" />,
              number: "100%",
              text: "Cam kết chất lượng",
            },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-[#AF763E]/10 rounded-lg">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-[#AF763E]">
                {stat.number}
              </div>
              <div className="text-sm text-[#AF763E]/70">{stat.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {values.map((value, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#AF763E]/10 rounded-3xl p-8 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-center mb-4">{value.icon}</div>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-[#AF763E] mb-2">
                {value.title}
              </h4>
              <p className="text-[#AF763E]/80 font-medium mb-2">{value.desc}</p>
              <p className="text-[#AF763E]/70 leading-relaxed text-sm mb-4">
                {value.detail}
              </p>
              <div className="inline-block bg-[#AF763E]/10 text-[#AF763E] text-sm px-4 py-1 rounded-full">
                {value.stats} — {value.statsLabel}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-16 text-center">
        <div className="bg-[#AF763E]/5 rounded-2xl p-8 border border-[#AF763E]/10">
          <blockquote className="text-xl italic text-[#AF763E]/80 leading-relaxed mb-4">
            &quot;Ba giá trị cốt lõi này không chỉ là kim chỉ nam cho hoạt động
            kinh doanh, mà còn là cam kết của chúng tôi với mỗi thực
            khách.&quot;
          </blockquote>
          <cite className="text-sm font-semibold text-[#AF763E] not-italic">
            — Sushi Takumi Team
          </cite>
        </div>
      </div>
    </section>
  );
}
