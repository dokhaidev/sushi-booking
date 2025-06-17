"use client";
import { motion } from "framer-motion";
import { FiHome, FiClock, FiChevronRight, FiImage } from "react-icons/fi";
import type {
  Table,
  SelectedFoodItem,
  BookingFormData,
} from "../../types/booking";

interface OrderSummaryProps {
  selectedTable: Table | null;
  selectedDate: string;
  selectedTime: string;
  foods: SelectedFoodItem[];
  formData: BookingFormData;
  depositAmount: number;
  onAddFood: () => void;
  onSubmitOrder: () => void;
  isLoading: boolean;
  getPaymentAmount: () => number; // Thêm prop này
}

export default function OrderSummary({
  selectedTable,
  selectedDate,
  selectedTime,
  foods,
  formData,
  depositAmount,
  onAddFood,
  onSubmitOrder,
  isLoading,
  getPaymentAmount, // Thêm prop này
}: OrderSummaryProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Tóm tắt đơn đặt
      </h2>

      {selectedTable ? (
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <div className="bg-gray-100 p-2 rounded-lg mr-3">
              <FiHome className="text-[#AF763E]" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Thông tin bàn</h3>
              <p className="text-sm text-gray-600">
                Bàn {selectedTable.table_number} • {selectedTable.max_guests}{" "}
                khách
              </p>
              <p className="text-sm text-gray-600">
                {selectedDate} • {selectedTime}
              </p>
              {selectedTable.location && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="bg-gray-50 text-[#AF763E] px-2 py-1 rounded">
                    {selectedTable.location}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-6">
          <p className="text-[#AF763E] text-sm flex items-center">
            <FiClock className="mr-2" />
            Vui lòng chọn ngày, giờ và số lượng khách để xem bàn trống
          </p>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-800">Món ăn đã chọn</h3>
          <button
            onClick={onAddFood}
            className="text-[#AF763E] hover:text-blue-800 text-sm flex items-center"
          >
            {foods.length > 0 ? "Chỉnh sửa" : "Thêm món"}{" "}
            <FiChevronRight className="ml-1" />
          </button>
        </div>

        {foods.length > 0 ? (
          <div className="space-y-3 mb-4">
            {foods.map((food) => (
              <div
                key={food.food_id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center">
                  {food.image ? (
                    <img
                      src={food.image || "/placeholder.svg"}
                      alt={food.name}
                      className="w-10 h-10 rounded-md object-cover mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                      <FiImage className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {food.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {food.price.toLocaleString()} VNĐ × {food.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium">
                  {(food.price * food.quantity).toLocaleString()} VNĐ
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
            <p className="text-gray-500 text-sm">Chưa có món nào được chọn</p>
            <button
              onClick={onAddFood}
              className="mt-2 text-[#AF763E] text-sm font-medium"
            >
              + Thêm món ăn
            </button>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Tạm tính món ăn:</span>
            <span className="font-medium">
              {formData.total_price.toLocaleString()} VNĐ
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Phí dịch vụ:</span>
            <span className="font-medium">0 VNĐ</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Tiền cọc:</span>
            <span className="font-medium text-orange-600">
              {depositAmount.toLocaleString()} VNĐ
            </span>
          </div>

          {/* Hiển thị thông tin thanh toán dựa trên phương thức */}
          {formData.payment_method === "cash" ? (
            <div className="bg-blue-50 rounded-lg p-3 mt-3 mb-3">
              <p className="text-sm text-blue-700 font-medium">
                💰 Thanh toán tiền mặt
              </p>
              <p className="text-xs text-blue-600">
                Thanh toán cọc trước, phần còn lại thanh toán khi đến nhà hàng
              </p>
            </div>
          ) : (
            <div className="bg-green-50 rounded-lg p-3 mt-3 mb-3">
              <p className="text-sm text-green-700 font-medium">
                📱{" "}
                {formData.payment_method === "momo"
                  ? "Thanh toán Momo"
                  : "Chuyển khoản"}
              </p>
              <p className="text-xs text-green-600">
                Thanh toán toàn bộ qua ứng dụng
              </p>
            </div>
          )}

          <div className="flex justify-between mt-3 pt-2 border-t border-gray-200">
            <span className="font-semibold">
              {formData.payment_method === "cash"
                ? "Cần thanh toán ngay:"
                : "Tổng thanh toán:"}
            </span>
            <span className="font-bold text-lg text-[#AF763E]">
              {getPaymentAmount().toLocaleString()} VNĐ
            </span>
          </div>

          {formData.payment_method === "cash" && formData.total_price > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Còn lại {formData.total_price.toLocaleString()} VNĐ thanh toán khi
              đến nhà hàng
            </p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onSubmitOrder}
          disabled={!selectedTable || isLoading}
          className={`w-full py-3 rounded-lg text-white mt-6 ${
            !selectedTable || isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#AF763E]"
          } transition-all shadow-md`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">↻</span>
              Đang xử lý...
            </span>
          ) : (
            "Xác nhận đặt bàn"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
