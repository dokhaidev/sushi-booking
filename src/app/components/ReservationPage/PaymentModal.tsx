"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck } from "react-icons/fi";
import { useEffect } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentQRCode: string;
  depositAmount: number;
  orderId: number | null;
  paymentCompleted: boolean;
  onPaymentComplete: () => void;
  paymentMethod: string;
  totalAmount: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  paymentQRCode,
  depositAmount,
  orderId,
  paymentCompleted,
  onPaymentComplete,
  paymentMethod,
  totalAmount,
}: PaymentModalProps) {
  // Debug log khi component mount và khi các prop quan trọng thay đổi
  useEffect(() => {
    if (isOpen) {
      console.log("PaymentModal opened");
      console.log("Payment QR Code:", paymentQRCode);
      console.log("Order ID:", orderId);
      console.log("Payment Method:", paymentMethod);
      console.log("Total Amount:", totalAmount);
    }
  }, [isOpen, paymentQRCode, orderId, paymentMethod, totalAmount]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {paymentMethod === "cash"
                  ? "Thanh toán đặt cọc"
                  : "Thanh toán đơn hàng"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                disabled={paymentCompleted}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {!paymentCompleted ? (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {paymentMethod === "cash"
                        ? "Số tiền cọc:"
                        : "Tổng số tiền:"}
                    </span>
                    <span className="font-bold text-[#AF763E]">
                      {totalAmount.toLocaleString()} VNĐ
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {paymentMethod === "cash"
                      ? "Quét mã QR để thanh toán cọc, phần còn lại thanh toán khi đến nhà hàng"
                      : "Quét mã QR để thanh toán toàn bộ đơn hàng"}
                  </p>
                </div>

                <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
                  {paymentQRCode ? (
                    <img
                      src={paymentQRCode || "/placeholder.svg"}
                      alt="QR Thanh toán"
                      className="w-52 h-52 object-contain"
                      onError={(e) => {
                        console.error("QR Code image failed to load:", e);
                        e.currentTarget.src =
                          "/placeholder.svg?height=200&width=200";
                        e.currentTarget.onerror = null; // Prevent infinite loop
                      }}
                    />
                  ) : (
                    <div className="w-52 h-52 bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500 text-center">
                        Đang tải mã QR...
                      </p>
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium mb-1">
                      Ngân hàng: MB Bank
                    </p>
                    <p className="text-sm">Số tài khoản: 0367438455</p>
                    <p className="text-sm">Chủ tài khoản: HUYNH PHAN DO KHAI</p>
                    <p className="text-sm mt-2">
                      Nội dung: {paymentMethod === "cash" ? "COC" : "FULL"}{" "}
                      {orderId}
                    </p>
                  </div>
                </div>

                {/* Phần hướng dẫn giữ nguyên */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Hướng dẫn thanh toán:</h3>
                  <ol className="list-decimal list-inside text-sm space-y-1 text-gray-700">
                    <li>Mở ứng dụng ngân hàng trên điện thoại</li>
                    <li>Chọn tính năng quét mã QR hoặc chuyển khoản</li>
                    <li>Quét mã QR hoặc nhập thông tin thủ công</li>
                    <li>Kiểm tra và xác nhận thanh toán</li>
                  </ol>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Mã đơn hàng: <span className="font-medium">{orderId}</span>
                  </p>
                  <button
                    onClick={onPaymentComplete}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <FiCheck /> Tôi đã thanh toán
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Thanh toán thành công!
                </h3>
                <p className="text-gray-600 mb-6">
                  {paymentMethod === "cash"
                    ? "Bạn đã thanh toán cọc thành công. Vui lòng thanh toán phần còn lại khi đến nhà hàng."
                    : "Bạn đã thanh toán toàn bộ đơn hàng thành công!"}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-[#AF763E] text-white rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
