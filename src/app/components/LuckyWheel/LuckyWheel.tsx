"use client";
import { useEffect, useState, useRef } from "react";
import { RotateCw, Zap, X } from "lucide-react";
import axios from "axios";
import confetti from "canvas-confetti";
import Confetti from "react-confetti";

interface Voucher {
  id: number;
  code: string;
  discount_value: number;
  status: string;
}

export default function SushiWheelButton() {
  const [rotation, setRotation] = useState(0);
  const [open, setOpen] = useState(false);
  const [displayVouchers, setDisplayVouchers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Cấu hình quay ổn định
  const SPIN_CONFIG = {
    duration: 3000,
    easing: "cubic-bezier(0.17, 0.67, 0.12, 0.99)",
    spinCount: 5,
  };

  // Màu sắc và icon sushi
  const wheelColors = [
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F43F5E",
  ];
  const sushiIcons = ["🍣", "🍤", "🍱", "🍙", "🍘", "🍥", "🍢", "🍡"];

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/voucher");
        const activeVouchers = res.data.filter(
          (v: Voucher) => v.status === "active"
        );
        const formatted: string[] = activeVouchers.map(
          (v: Voucher) =>
            `Giảm ${v.discount_value.toLocaleString("vi-VN")}đ | ${v.code}`
        );
        setDisplayVouchers([
          ...formatted,
          "Chúc bạn may mắn lần sau",
          "Thử lại lần sau",
        ]);
      } catch (err) {
        console.error("Lỗi API:", err);
        setDisplayVouchers(["Chúc bạn may mắn lần sau", "Thử lại lần sau"]);
      }
    };
    fetchVouchers();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const spinWheel = () => {
    if (spinning || displayVouchers.length === 0) return;

    setSpinning(true);
    setResult(null);

    const rewardCount = displayVouchers.length;
    const randomIndex = Math.floor(Math.random() * rewardCount);
    const degreePerItem = 360 / rewardCount;
    const rotation =
      360 * SPIN_CONFIG.spinCount + (rewardCount - randomIndex) * degreePerItem;

    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform ${SPIN_CONFIG.duration}ms ${SPIN_CONFIG.easing}`;
      wheelRef.current.style.transform = `rotate(${rotation}deg)`;
    }

    setTimeout(() => {
      const selectedReward = displayVouchers[randomIndex];
      setResult(selectedReward);
      setSpinning(false);

      if (
        !selectedReward.includes("may mắn") &&
        !selectedReward.includes("Thử lại")
      ) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }, SPIN_CONFIG.duration);
  };

  return (
    <>
      {/* Nút sushi cố định */}
      <div className="fixed bottom-37 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="relative group bg-gradient-to-br from-amber-900 to-amber-700 text-white p-5 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 border-2 border-amber-300/30 hover:border-amber-200/50"
          style={{
            boxShadow: "0 10px 30px rgba(180, 83, 9, 0.6)",
            background: "linear-gradient(135deg, #92400e 0%, #b45309 100%)",
          }}
        >
          <div className="absolute inset-0 rounded-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
          <div className="absolute inset-0 rounded-full bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-amber-300 animate-float"
            >
              <path
                d="M11.6469 3.39253C11.8785 2.86916 12.5247 2.86916 12.7563 3.39253L14.7646 7.85815C14.8548 8.06048 15.0246 8.2126 15.2289 8.27438L19.6644 9.57724C20.1877 9.73626 20.1877 10.2637 19.6644 10.4228L15.2289 11.7256C15.0246 11.7874 14.8548 11.9395 14.7646 12.1419L12.7563 16.6075C12.5247 17.1308 11.8785 17.1308 11.6469 16.6075L9.63859 12.1419C9.54839 11.9395 9.37861 11.7874 9.17432 11.7256L4.73881 10.4228C4.21544 10.2637 4.21544 9.73626 4.73881 9.57724L9.17432 8.27438C9.37861 8.2126 9.54839 8.06048 9.63859 7.85815L11.6469 3.39253Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="relative">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-100 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:text-white"
            >
              <path d="M8 21L12 17L16 21" stroke="currentColor" />
              <path d="M12 17V3" stroke="currentColor" />
              <path
                d="M20 7C20 7 19 5 16 5C13 5 12 7 12 7C12 7 11 5 8 5C5 5 4 7 4 7"
                stroke="currentColor"
              />
            </svg>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-12 bg-amber-800 text-amber-100 text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg border border-amber-600/30 tracking-wider">
            Săn Voucher ngay!
          </span>

          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-amber-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-amber-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"></div>
        </button>
      </div>

      {/* la roi */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(10deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Popup vòng quay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            ref={popupRef}
            className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 w-full max-w-md text-center relative overflow-hidden shadow-2xl border-4 border-amber-200"
          >
            {/* Hoa văn Nhật Bản */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/japanese-pattern.png')]"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/japanese-pattern.png')]"></div>
            </div>

            {/* Nút đóng */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-200/50 hover:bg-amber-300 transition-colors"
            >
              <X className="w-5 h-5 text-amber-800" />
            </button>

            <div className="mb-6 relative z-10">
              <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-800 to-amber-600 font-japanese">
                SUSHI TAKUMI
              </h2>
              <p className="text-amber-700 font-medium">
                Quay để nhận ưu đãi đặc biệt!
              </p>
            </div>

            {/* Vòng quay */}
            <div className="relative mx-auto w-80 h-80 mb-8">
              {/* Khung gỗ Nhật Bản */}
              <div className="absolute inset-0 rounded-full border-8 border-amber-800/20 shadow-xl"></div>
              <div className="absolute inset-4 rounded-full border-4 border-amber-300/50"></div>

              {/* Đũa tre chỉ điểm */}
              <div className="absolute top-0 left-1/2 z-20 w-10 h-16 transform -translate-x-1/2 -translate-y-1/3 rotate-6">
                <div className="relative w-full h-full">
                  <div className="absolute left-0 top-0 w-3 h-full bg-gradient-to-b from-amber-700 to-amber-900 rounded-sm transform skew-x-6 shadow-md"></div>
                  <div className="absolute right-0 top-0 w-3 h-full bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm transform -skew-x-6 shadow-md"></div>
                </div>
              </div>

              {/* Bánh xe chính */}
              <div
                ref={wheelRef}
                className="w-full h-full rounded-full overflow-hidden relative shadow-2xl bg-white border-8 border-amber-100 transition-transform duration-6000 ease-[cubic-bezier(0.1,0.8,0.3,1)]"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {displayVouchers.map((_, index) => {
                    const angle = 360 / displayVouchers.length;
                    const startAngle = angle * index - 90;
                    const endAngle = startAngle + angle;
                    const colorIndex = index % wheelColors.length;
                    const iconIndex = index % sushiIcons.length;

                    const centerX = 100;
                    const centerY = 100;
                    const radius = 90;

                    const startAngleRad = (startAngle * Math.PI) / 180;
                    const endAngleRad = (endAngle * Math.PI) / 180;

                    const x1 = centerX + radius * Math.cos(startAngleRad);
                    const y1 = centerY + radius * Math.sin(startAngleRad);
                    const x2 = centerX + radius * Math.cos(endAngleRad);
                    const y2 = centerY + radius * Math.sin(endAngleRad);

                    const largeArcFlag = angle > 180 ? 1 : 0;

                    const pathData = [
                      `M ${centerX} ${centerY}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      "Z",
                    ].join(" ");

                    const textAngle = (startAngle + endAngle) / 2;
                    const textRadius = radius * 0.6;
                    const textAngleRad = (textAngle * Math.PI) / 180;
                    const textX = centerX + textRadius * Math.cos(textAngleRad);
                    const textY = centerY + textRadius * Math.sin(textAngleRad);

                    return (
                      <g key={index}>
                        <path
                          d={pathData}
                          fill={wheelColors[colorIndex]}
                          stroke="#ffffff"
                          strokeWidth="3"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill="white"
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                          className="drop-shadow-md"
                        >
                          {sushiIcons[iconIndex]}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Trung tâm - chén nước tương */}
                <div className="absolute top-1/2 left-1/2 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-full h-full bg-gradient-to-br from-amber-900 to-amber-700 rounded-full shadow-lg border-4 border-amber-200 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-800 to-amber-600 rounded-full flex items-center justify-center shadow-inner">
                      {spinning ? (
                        <RotateCw
                          size={20}
                          className="text-amber-100 animate-spin"
                        />
                      ) : (
                        <span className="text-amber-100 font-bold text-sm tracking-wider">
                          回す
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nút quay */}
            <div className="mb-6 relative z-10">
              <button
                onClick={spinWheel}
                disabled={spinning}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                  spinning
                    ? "bg-amber-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700"
                } relative overflow-hidden`}
              >
                {/* Hiệu ứng ánh sáng */}
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>

                {spinning ? (
                  <span className="flex items-center justify-center">
                    <RotateCw className="animate-spin mr-2" size={18} />
                    Đang quay...
                  </span>
                ) : (
                  <span className="flex items-center justify-center text-lg">
                    <Zap className="mr-2" size={18} />
                    QUAY NGAY
                  </span>
                )}
              </button>
            </div>

            {/* Hiển thị kết quả */}
            {result && !spinning && (
              <div
                className={`p-5 rounded-xl mb-4 border-2 ${
                  result.includes("may mắn") || result.includes("Thử lại")
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-green-50 text-green-800 border-green-200"
                } relative overflow-hidden`}
              >
                {/* Hoa văn nền */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/japanese-pattern.png')]"></div>

                <div className="text-4xl mb-3">
                  {result.includes("may mắn") || result.includes("Thử lại")
                    ? "🍘"
                    : "🎌"}
                </div>
                <p className="font-bold text-xl mb-1">
                  {result.includes("may mắn") || result.includes("Thử lại")
                    ? "Chúc bạn may mắn lần sau!"
                    : "Chúc mừng bạn!"}
                </p>
                <p className="text-lg">{result}</p>

                {/* Hiệu ứng confetti khi trúng */}
                {!result.includes("may mắn") && !result.includes("Thử lại") && (
                  <Confetti
                    width={400}
                    height={200}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.2}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
