"use client";

import { useState } from "react";
import { MessageCircle, X, ChevronDown, ChevronUp } from "lucide-react";

const questions = [
  {
    q: "Giờ làm việc của shop là gì?",
    a: "Chúng tôi mở cửa từ 8h - 22h mỗi ngày.",
  },
  {
    q: "Làm sao để đặt hàng?",
    a: "Bạn có thể đặt hàng trực tiếp trên website hoặc gọi hotline: 0123 456 789.",
  },
  {
    q: "Có hỗ trợ giao hàng toàn quốc không?",
    a: "Có, chúng tôi giao hàng toàn quốc với nhiều đối tác vận chuyển uy tín.",
  },
  {
    q: "Tôi có thể huỷ đơn hàng sau khi đặt không?",
    a: "Bạn có thể huỷ trong vòng 30 phút sau khi đặt hàng.",
  },
];

export default function MiniChat() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      {/* Button mở chat */}
      <div className="fixed bottom-20 right-6 z-50">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="bg-gradient-to-br from-[#00AEEF] to-[#007bbd] text-white p-4 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105 relative"
          >
            <MessageCircle className="w-6 h-6" />
            {isHovering && (
              <div className="absolute -top-10 -left-6 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Bạn cần hỗ trợ?
              </div>
            )}
          </button>
        ) : (
          <div className="bg-white w-96 max-w-[90vw] rounded-lg shadow-2xl overflow-hidden animate-fade-in flex flex-col h-[500px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00AEEF] to-[#007bbd] text-white flex justify-between items-center p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold text-lg">Hỗ trợ khách hàng</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Welcome message */}
            <div className="bg-blue-50 p-4 border-b">
              <p className="font-medium text-blue-800">Xin chào! 👋</p>
              <p className="text-sm text-gray-600 mt-1">
                Chúng tôi có thể giúp gì cho bạn? Vui lòng chọn câu hỏi bên dưới
                hoặc liên hệ hotline.
              </p>
            </div>

            {/* Chat content */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {questions.map((item, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setSelected(selected === index ? null : index)
                    }
                    className="flex justify-between items-center w-full p-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-left"
                  >
                    <span className="font-medium text-gray-800">{item.q}</span>
                    {selected === index ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {selected === index && (
                    <div className="bg-white p-3 border-l-4 border-blue-500 text-gray-700 animate-fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact option */}
            <div className="border-t p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">
                Không tìm thấy câu trả lời? Hãy liên hệ với chúng tôi:
              </p>
              <button className="w-full bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>Gọi hỗ trợ: 0367 438 455</span>
              </button>
            </div>

            {/* Footer */}
            <div className="text-xs text-center text-gray-500 p-2 bg-gray-100">
              Chat tự động – Phục vụ 24/7
            </div>
          </div>
        )}
      </div>
    </>
  );
}
