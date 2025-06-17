"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiClock } from "react-icons/fi";
import { useEffect, useState } from "react";

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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");

  // Simulate bank payment verification
  const verifyPaymentWithBank = async () => {
    setIsVerifying(true);
    try {
      // In a real app, you would call your backend API here
      // which would then verify with the bank's API
      const response = await simulateBankVerification(orderId);

      if (response.success) {
        setVerificationStatus("success");
        onPaymentComplete();
      } else {
        setVerificationStatus("failed");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationStatus("failed");
    } finally {
      setIsVerifying(false);
    }
  };

  // Simulate bank API response (replace with real API call)
  const simulateBankVerification = async (orderId: number | null) => {
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        // Randomly succeed 80% of the time for demo
        resolve({ success: Math.random() > 0.2 });
      }, 2000);
    });
  };

  // Reset verification status when modal closes
  useEffect(() => {
    if (!isOpen) {
      setVerificationStatus("pending");
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-xl p-5 w-full max-w-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {paymentMethod === "cash" ? "Đặt cọc" : "Thanh toán"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                disabled={paymentCompleted}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {!paymentCompleted ? (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between font-medium">
                    <span>
                      {paymentMethod === "cash" ? "Tiền cọc:" : "Tổng tiền:"}
                    </span>
                    <span className="text-[#AF763E]">
                      {totalAmount.toLocaleString()}₫
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  {paymentQRCode ? (
                    <img
                      src={paymentQRCode}
                      alt="QR Thanh toán"
                      className="w-40 h-40 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500 text-sm">Đang tải mã QR...</p>
                    </div>
                  )}
                  <div className="mt-3 text-center text-xs">
                    <p>MB Bank: 0367438455</p>
                    <p>HUYNH PHAN DO KHAI</p>
                    <p className="mt-1 font-medium">
                      Nội dung: {paymentMethod === "cash" ? "COC" : "FULL"}{" "}
                      {orderId}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <h3 className="font-medium">Hướng dẫn:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600">
                    <li>Mở app ngân hàng</li>
                    <li>Quét mã QR hoặc chuyển khoản</li>
                    <li>Nhập nội dung chuyển tiền</li>
                  </ol>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={verifyPaymentWithBank}
                    disabled={isVerifying}
                    className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${
                      isVerifying
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {isVerifying ? (
                      <>
                        <FiClock className="animate-spin" />
                        Đang xác minh...
                      </>
                    ) : (
                      <>
                        <FiCheck />
                        Tôi đã chuyển tiền
                      </>
                    )}
                  </button>

                  {verificationStatus === "failed" && (
                    <p className="mt-2 text-red-500 text-sm text-center">
                      Chưa nhận được thanh toán. Vui lòng thử lại sau 1 phút.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiCheck className="text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-1">Thanh toán thành công!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {paymentMethod === "cash"
                    ? "Vui lòng thanh toán phần còn lại khi đến nhà hàng."
                    : "Cảm ơn bạn đã thanh toán!"}
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-[#AF763E] text-white rounded-lg text-sm"
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
