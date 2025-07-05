"use client";
import { useEffect, useState, useRef } from "react";
import { X, CheckCircle } from "lucide-react";
import axios from "axios";
import confetti from "canvas-confetti";
import Confetti from "react-confetti";
import { useAuth } from "../../context/authContext";

interface Voucher {
  id: number;
  code: string;
  discount_value: number;
  status: string;
}

export default function LuckyWheel() {
  const { user } = useAuth();
  const [rotation, setRotation] = useState(0);
  const [open, setOpen] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [displayVouchers, setDisplayVouchers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [savedResults, setSavedResults] = useState<
    { label: string; saved: boolean }[]
  >([]);

  const wheelRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const SPIN_CONFIG = {
    duration: 3000,
    easing: "cubic-bezier(0.17, 0.67, 0.12, 0.99)",
    spinCount: 5,
  };

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
        setVouchers(activeVouchers);

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
  }, []);

  useEffect(() => {
    if (user?.point_available) {
      setSpinCount(Math.floor(user.point_available / 50));
    }
  }, [user]);

  const isVoucher = (text: string) =>
    !text.includes("may mắn") && !text.includes("Thử lại");

  const handleSaveVoucher = async (voucherText: string, index: number) => {
    const matchedVoucher = vouchers.find((v) => voucherText.includes(v.code));
    if (matchedVoucher && user) {
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/themVoucherWheel",
          {
            customer_id: user.id,
            voucher_id: matchedVoucher.id,
          }
        );
        alert(res.data.message || "🎉 Voucher đã được lưu!");
        setSavedResults((prev) => {
          const updated = [...prev];
          updated[index].saved = true;
          return updated;
        });
      } catch (err: any) {
        alert(
          err?.response?.data?.message ||
            "❌ Đã xảy ra lỗi khi lưu voucher. Vui lòng thử lại."
        );
      }
    }
  };

  const spinWheel = async () => {
    if (spinning || displayVouchers.length === 0 || spinCount <= 0) return;

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
      setSpinCount((prev) => prev - 1);

      if (isVoucher(selectedReward)) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setSavedResults((prev) => [
          { label: selectedReward, saved: false },
          ...prev,
        ]);
      }
    }, SPIN_CONFIG.duration);
  };

  return (
    <>
      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-br from-amber-800 to-amber-600 text-white p-5 rounded-full shadow-xl hover:scale-105 transition-transform"
        >
          🎯 Quay
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div
            ref={popupRef}
            className="relative bg-white rounded-3xl p-6 max-w-md w-full text-center shadow-2xl border"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 bg-red-100 p-2 rounded-full"
            >
              <X className="text-red-500" />
            </button>

            <h2 className="text-2xl font-bold mb-2 text-amber-700">
              Vòng quay may mắn
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Bạn còn <strong>{spinCount}</strong> lượt quay
            </p>

            <div className="w-64 h-64 mx-auto mb-6">
              <div
                ref={wheelRef}
                className="rounded-full w-full h-full bg-gray-100 border-4 border-amber-300 flex items-center justify-center transition-transform"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {displayVouchers.map((_, index) => {
                    const angle = 360 / displayVouchers.length;
                    const startAngle = angle * index - 90;
                    const endAngle = startAngle + angle;
                    const colorIndex = index % wheelColors.length;
                    const centerX = 100;
                    const centerY = 100;
                    const radius = 90;

                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const x1 = centerX + radius * Math.cos(startRad);
                    const y1 = centerY + radius * Math.sin(startRad);
                    const x2 = centerX + radius * Math.cos(endRad);
                    const y2 = centerY + radius * Math.sin(endRad);

                    const largeArc = angle > 180 ? 1 : 0;
                    const pathData = [
                      `M ${centerX} ${centerY}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                      "Z",
                    ].join(" ");

                    return (
                      <path
                        key={index}
                        d={pathData}
                        fill={wheelColors[colorIndex]}
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            <button
              onClick={spinWheel}
              disabled={spinning || spinCount <= 0}
              className={`w-full py-3 font-semibold rounded-lg text-white ${
                spinning || spinCount <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {spinning ? "Đang quay..." : "Quay ngay"}
            </button>

            {result && !spinning && (
              <div className="mt-4 p-4 rounded-xl bg-white border-2 shadow">
                <h3 className="font-bold text-lg mb-1">
                  {isVoucher(result)
                    ? "🎉 Chúc mừng bạn!"
                    : "Chúc bạn may mắn lần sau!"}
                </h3>
                <p>{result}</p>

                {isVoucher(result) && (
                  <Confetti width={300} height={150} recycle={false} />
                )}
              </div>
            )}

            {/* Danh sách voucher đã trúng */}
            {savedResults.length > 0 && (
              <div className="mt-6 text-left">
                <h4 className="font-bold mb-2 text-amber-700">
                  🎁 Voucher bạn đã trúng:
                </h4>
                <ul className="space-y-2 max-h-40 overflow-auto pr-1">
                  {savedResults.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-yellow-50 p-3 rounded-md border"
                    >
                      <span className="text-sm">{item.label}</span>
                      {item.saved ? (
                        <span className="text-green-600 text-xs font-semibold flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Đã lưu
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSaveVoucher(item.label, index)}
                          className="text-white text-xs bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded-md"
                        >
                          Lưu voucher
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
