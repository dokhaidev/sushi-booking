"use client";

export default function OrderSummary() {
  return (
    <div className="border p-4 rounded-xl shadow-md bg-white sticky top-20">
      <h2 className="text-xl font-bold mb-4">Món đã chọn</h2>
      <ul className="space-y-2">
        {/* Lặp món ăn đã chọn */}
        <li className="flex justify-between">
          <span>Sushi cá hồi</span>
          <span>120.000 đ</span>
        </li>
      </ul>
      <hr className="my-4" />
      <p className="text-lg font-semibold text-right">Tổng: 120.000 đ</p>
      <button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2">
        Xác nhận đặt món
      </button>
    </div>
  );
}
