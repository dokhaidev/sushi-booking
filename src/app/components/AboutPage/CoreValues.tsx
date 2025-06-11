"use client";

export default function CoreValues() {
  const values = [
    {
      title: "Chất lượng",
      desc: "Nguyên liệu tươi sống và kỹ thuật chế biến chuẩn Nhật.",
      detail:
        "Chúng tôi cam kết sử dụng nguyên liệu tươi ngon, được chọn lọc kỹ càng từ các nhà cung cấp uy tín, kết hợp cùng kỹ thuật chế biến truyền thống Nhật Bản để mang đến trải nghiệm ẩm thực đỉnh cao.",
      icon: (
        <svg
          className="w-16 h-16 mx-auto mb-6 text-[#A68345]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M12 1v22M5 7l7-6 7 6M5 17l7 6 7-6" />
        </svg>
      ),
    },
    {
      title: "Tôn trọng",
      desc: "Đối xử với khách hàng như thượng khách trong văn hóa Nhật.",
      detail:
        "Chúng tôi luôn đặt khách hàng lên hàng đầu, mang đến sự tận tâm, lịch thiệp và không gian phục vụ đúng chuẩn tinh thần hiếu khách Nhật Bản.",
      icon: (
        <svg
          className="w-16 h-16 mx-auto mb-6 text-[#A68345]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      title: "Sáng tạo",
      desc: "Luôn đổi mới thực đơn nhưng vẫn giữ hồn sushi truyền thống.",
      detail:
        "Chúng tôi không ngừng sáng tạo để làm mới thực đơn, kết hợp các nguyên liệu độc đáo, mang đến trải nghiệm ẩm thực đa dạng nhưng vẫn giữ vững giá trị truyền thống.",
      icon: (
        <svg
          className="w-16 h-16 mx-auto mb-6 text-[#A68345]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#fff] py-[60px] sm:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto text-center mb-14 px-4">
        <h3 className="text-4xl font-bold tracking-tight text-[#A68345] mb-3">
          Giá Trị Cốt Lõi
        </h3>
        <p className="text-lg text-[#666666] max-w-3xl mx-auto">
          Ba giá trị then chốt tạo nên bản sắc và trải nghiệm đậm chất Nhật Bản
          trong từng món ăn và dịch vụ của chúng tôi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-4">
        {values.map(({ title, desc, detail, icon }, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl duration-300"
          >
            {icon}
            <h4 className="text-2xl font-semibold text-[#333333] mb-3">
              {title}
            </h4>
            <p className="text-[#A68345] font-semibold mb-4">{desc}</p>
            <p className="text-[#666666] mb-6">{detail}</p>
            <button
              type="button"
              className="rounded-full px-7 py-2 bg-[#A68345] text-white font-medium text-sm shadow-md hover:bg-[#B5413D] transition-colors"
            >
              Xem thêm
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
