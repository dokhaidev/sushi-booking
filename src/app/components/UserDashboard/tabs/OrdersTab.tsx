"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/authContext";
import StatusBadge from "../ui/StatusBadge";
import { X, ChevronLeft, ChevronRight, Star } from "lucide-react";

const ORDERS_PER_PAGE = 5;

const NotificationPopup = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`px-4 py-3 rounded-lg shadow-lg ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}
      >
        <div className="flex items-center justify-between">
          <p>{message}</p>
          <button onClick={onClose} className="ml-4">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OrdersTab() {
  const { user: authUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Feedback states
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const closeNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (!authUser?.id) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch orders
        const ordersRes = await axios.get(
          `http://127.0.0.1:8000/api/orders/history/${authUser.id}`
        );
        
        // Fetch feedbacks for all orders
        const feedbacksRes = await axios.get(
          `http://localhost:8000/api/feedbacks?customer_id=${authUser.id}`
        );
        
        // Map orders with feedback status
        const ordersWithFeedback = ordersRes.data.map((order: any) => ({
          ...order,
          has_feedback: feedbacksRes.data.some(
            (feedback: any) => feedback.order_id === order.order_id
          ),
        }));
        
        setOrders(ordersWithFeedback);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authUser?.id]);

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    return orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
  }, [orders, currentPage]);

  const viewOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setShowDetail(true);
    setRating(5);
    setComment("");
  };

 const handleSubmitFeedback = async () => {
  if (!authUser || !selectedOrder) {
    setNotification({
      message: "Bạn chưa đăng nhập hoặc chưa chọn đơn hàng.",
      type: "error",
    });
    return;
  }

  if (selectedOrder.status !== "success") {
    setNotification({
      message: "Chỉ có thể đánh giá đơn hàng đã hoàn thành.",
      type: "error",
    });
    return;
  }

  if (selectedOrder.has_feedback) {
    setNotification({
      message: "Bạn đã gửi đánh giá cho đơn hàng này rồi.",
      type: "error",
    });
    return;
  }

  if (rating < 1 || rating > 5) {
    setNotification({
      message: "Vui lòng chọn đánh giá từ 1-5 sao.",
      type: "error",
    });
    return;
  }

  try {
    setIsSubmittingFeedback(true);

    const response = await axios.post("http://localhost:8000/api/feedbacks", {
      customer_id: parseInt(String(authUser.id)),
      order_id: selectedOrder.order_id, // Sửa lại thành đúng ID đơn hàng
      rating: Number(rating),
      comment: comment.trim() || "Không có nhận xét",
    });

    setNotification({
      message: response.data?.message || "Gửi đánh giá thành công",
      type: "success",
    });

    // Cập nhật trạng thái đơn hàng đã đánh giá
    setSelectedOrder((prev: any) => ({
      ...prev,
      has_feedback: true,
    }));

    setOrders((prev) =>
      prev.map((order) =>
        order.order_id === selectedOrder.order_id
          ? { ...order, has_feedback: true }
          : order
      )
    );
  } catch (err: any) {
    console.error("Lỗi khi gửi feedback:", err.response?.data || err.message);

    let errorMessage = "Gửi đánh giá thất bại";

    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.status === 422) {
      const errors = err.response.data?.errors;
      if (errors) {
        errorMessage = Object.values(errors).flat().join(", ");
      }
    }

    setNotification({
      message: errorMessage,
      type: "error",
    });
  } finally {
    setIsSubmittingFeedback(false);
  }
};



  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-[#AF763E] mb-6 border-b pb-2 border-[#AF763E]/20">
        Lịch sử đơn hàng
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AF763E]"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#AF763E] text-white rounded-lg hover:bg-[#AF763E]/90"
          >
            Thử lại
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-wooden-light rounded-lg">
          <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào.</p>
          <button
            className="px-4 py-2 bg-[#AF763E] text-white rounded-lg hover:bg-[#AF763E]/90"
            onClick={() => window.location.reload()}
          >
            Tải lại
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-auto shadow ring-1 ring-[#AF763E]/20 rounded-xl">
            <table className="min-w-full divide-y divide-[#AF763E]/10">
              <thead className="bg-[#AF763E]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Mã đơn
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Ngày đặt
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#AF763E]/10">
                {paginatedOrders.map((order, index) => (
                  <tr key={order.order_id || index} className="hover:bg-[#AF763E]/5 transition">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.order_id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {parseFloat(order.total_price).toLocaleString()}đ
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => viewOrderDetail(order)}
                        className="text-[#AF763E] hover:text-[#AF763E]/80 font-medium"
                      >
                        Xem chi tiết
                      </button>
                      {order.status === "success" && !order.has_feedback && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetail(true);
                          }}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Đánh giá
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length > ORDERS_PER_PAGE && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Hiển thị {(currentPage - 1) * ORDERS_PER_PAGE + 1}-
                {Math.min(currentPage * ORDERS_PER_PAGE, orders.length)} trên{" "}
                {orders.length} đơn hàng
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#AF763E] text-white hover:bg-[#AF763E]/90"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentPage === pageNum
                          ? "bg-[#AF763E] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#AF763E] text-white hover:bg-[#AF763E]/90"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <AnimatePresence>
            {showDetail && selectedOrder && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowDetail(false)}
              >
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-[#AF763E]">
                          Chi tiết đơn hàng #{selectedOrder.order_id}
                        </h3>
                        <p className="text-gray-500">
                          Ngày đặt:{" "}
                          {new Date(selectedOrder.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDetail(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#AF763E]/10 p-4 rounded-lg border border-[#AF763E]/20">
                        <h4 className="font-medium text-lg mb-3 text-[#AF763E]">
                          Thông tin đơn hàng
                        </h4>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Trạng thái:</span>{" "}
                            <StatusBadge status={selectedOrder.status} />
                          </p>
                          <p>
                            <span className="font-medium">Tổng tiền:</span>{" "}
                            {parseFloat(
                              selectedOrder.total_price
                            ).toLocaleString()}
                            đ
                          </p>
                        </div>
                      </div>

                      {selectedOrder.status === "success" && (
                        <div className="bg-[#AF763E]/10 p-4 rounded-lg border border-[#AF763E]/20">
                          <h4 className="font-medium text-lg mb-3 text-[#AF763E]">
                            Đánh giá đơn hàng
                          </h4>
                          {selectedOrder.has_feedback ? (
                            <p className="text-gray-700">
                              Bạn đã đánh giá đơn hàng này.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="text-2xl"
                                  >
                                    <Star
                                      className={`w-6 h-6 ${
                                        star <= rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded"
                                rows={3}
                                placeholder="Nhận xét của bạn..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              />
                              <button
                                onClick={handleSubmitFeedback}
                                disabled={isSubmittingFeedback}
                                className="px-4 py-2 bg-[#AF763E] text-white rounded hover:bg-[#AF763E]/90 disabled:opacity-50"
                              >
                                {isSubmittingFeedback
                                  ? "Đang gửi..."
                                  : "Gửi đánh giá"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-lg mb-3 text-[#AF763E]">
                        Danh sách món ăn
                      </h4>
                      <div className="border border-[#AF763E]/20 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-[#AF763E]/10">
                          <thead className="bg-[#AF763E]">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">
                                Tên món
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">
                                Số lượng
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">
                                Đơn giá
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">
                                Thành tiền
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-[#AF763E]/10">
                            {selectedOrder.items?.map(
                              (item: any, index: number) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.food_name ||
                                      item.combo_name ||
                                      "Không xác định"}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {parseFloat(item.price).toLocaleString()}đ
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {(
                                      item.quantity * parseFloat(item.price)
                                    ).toLocaleString()}
                                    đ
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>

                          <tfoot className="bg-[#AF763E]/10">
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-3 text-right text-sm font-medium text-gray-500"
                              >
                                Tổng cộng:
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-[#AF763E]">
                                {parseFloat(
                                  selectedOrder.total_price
                                ).toLocaleString()}
                                đ
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setShowDetail(false)}
                        className="px-4 py-2 bg-[#AF763E] text-white rounded-lg hover:bg-[#AF763E]/90"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}