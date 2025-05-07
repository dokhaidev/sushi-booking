import ContactInfo from "../HomePage/Contact";
import OpeningHours from "../HomePage/OpeningHour";
import SocialMedia from "../HomePage/SocialMedia";

export default function Footer() {
  return (
    <footer className="bg-[#1F150F] text-[#F5F3EF] pt-20 pb-12 mt-16 border-t border-[#3F3127]">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo + Mô tả */}
          <div>
            <h3 className="text-4xl font-bold mb-5 tracking-widest text-[#F4A261]">
              Sushi <span className="text-[#E76F51]">Takumi</span>
            </h3>
            <p className="text-sm leading-relaxed text-[#D9CFC5]">
              Trải nghiệm sushi truyền thống kết hợp tinh hoa hiện đại, mang đến
              hương vị đậm đà và tinh tế trong từng miếng sushi.
            </p>
          </div>

          {/* Thông tin liên hệ */}
          <ContactInfo />

          {/* Giờ mở cửa */}
          <OpeningHours />
        </div>

        {/* Phần dưới: Mạng xã hội + Bản quyền */}
        <div className="mt-14 pt-8 border-t border-[#3F3127]">
          <SocialMedia />
          <p className="text-center text-xs mt-6 text-[#A68A75]">
            &copy; {new Date().getFullYear()} Sushi Takumi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
