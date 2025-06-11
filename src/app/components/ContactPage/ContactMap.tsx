"use client";
import { MapPin, Clock, Bus } from "lucide-react";

export default function ContactMap() {
  return (
    <section className="bg-[#FDF7EF] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-4xl font-bold text-center text-[#594545] mb-3">
          Tìm chúng tôi trên bản đồ
        </h3>
        <p className="text-center text-[#7B5E5E] text-lg mb-10">
          Dễ dàng đến với Sushi Takumi bằng nhiều phương tiện. Chúng tôi luôn
          chào đón bạn!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Bản đồ */}
          <div className="rounded-2xl overflow-hidden shadow-xl border border-[#FFE9C2]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d125402.99854153027!2d106.6795008!3d10.8232704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1747056252176!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Thông tin mô tả */}
          <div className="space-y-6 text-[#594545] text-base">
            <div className="flex items-start gap-4">
              <MapPin className="text-[#D97706] mt-1" />
              <div>
                <p className="font-semibold">Địa chỉ nhà hàng:</p>
                <p>123 Đường Nhật Bản, Phường Bến Nghé, Quận 1, TP.HCM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="text-[#D97706] mt-1" />
              <div>
                <p className="font-semibold">Giờ mở cửa:</p>
                <p>Thứ 2 – Chủ Nhật: 10:00 – 22:00</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Bus className="text-[#D97706] mt-1" />
              <div>
                <p className="font-semibold">Phương tiện đến:</p>
                <p>
                  Gần trạm xe buýt số 03, 36 <br />
                  Cách ga tàu Bến Thành 1km
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-[#7B5E5E] italic">
                “Đến với Sushi Takumi, bạn không chỉ tìm thấy món ăn ngon mà còn
                là trải nghiệm tinh tế của văn hóa Nhật.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
