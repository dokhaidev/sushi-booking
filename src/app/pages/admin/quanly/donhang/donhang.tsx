/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import axios from "axios"
import TitleDesc from "../../../../components/ui/titleDesc"
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card"
import Pagination from "../../../../components/ui/Panigation"
import SearchInput from "../../../../components/ui/SearchInput"
import { useFetch } from "@/src/app/hooks/useFetch"
import { useSearchFilter } from "@/src/app/hooks/useSearchFilter"
import Popup from "@/src/app/components/ui/Popup"
import PopupNotification from "@/src/app/components/ui/PopupNotification"
import { Button } from "@/src/app/components/ui/button"
import { FaShoppingCart, FaClock, FaCheckCircle, FaMoneyBillWave, FaFilter, FaTimes, FaEdit, FaInfo } from "react-icons/fa"
import type { Order } from "@/src/app/types/order"

export default function QuanLyDonHang() {
  const { orders, fetchOrderDetail, orderDetail } = useFetch()
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  // Status update states
  const [showStatusPopup, setShowStatusPopup] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Notification states
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupContent, setPopupContent] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "error",
  })

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    timeRange: "",
    paymentMethod: "",
  })

  const itemsPerPage = 5

  // Search filtering
  const searchFiltered = useSearchFilter(orders, searchText, ["id", "customer.name", "customer.phone"])

  // Advanced filtering function
  const applyFilters = (data: any[], filters: { status: string; timeRange: string; paymentMethod: string }) => {
    return data.filter((order) => {
      // Status filter
      if (filters.status && filters.status !== "all") {
        if (order.status !== filters.status) {
          return false
        }
      }

      // Time range filter
      if (filters.timeRange && filters.timeRange !== "all") {
        const orderDate = new Date(order.created_at)
        const today = new Date()
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        switch (filters.timeRange) {
          case "today":
            const todayStr = new Date().toISOString().slice(0, 10)
            if (order.created_at?.slice(0, 10) !== todayStr) return false
            break
          case "week":
            if (orderDate < startOfWeek) return false
            break
          case "month":
            if (orderDate < startOfMonth) return false
            break
        }
      }

      // Payment method filter
      if (filters.paymentMethod && filters.paymentMethod !== "all") {
        if (order.payment_method !== filters.paymentMethod) {
          return false
        }
      }

      return true
    })
  }

  // Combined filtering
  const filteredOrders = useMemo(() => {
    return applyFilters(searchFiltered, filters)
  }, [searchFiltered, filters])

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Statistics calculations based on filtered data
  const ordersToday = filteredOrders.filter((order) => {
    const today = new Date().toISOString().slice(0, 10)
    return order.created_at?.slice(0, 10) === today
  })

  const totalToday = ordersToday.length
  const pendingOrders = filteredOrders.filter((order) => order.status === "pending")
  const confirmedOrders = filteredOrders.filter((order) => order.status === "success")
  const totalRevenue = confirmedOrders.reduce((sum, order) => sum + Number(order.total_price || 0), 0)

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
    setCurrentPage(1)
  }

  // Apply filters
  const handleApplyFilters = () => {
    setCurrentPage(1)
  }

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      status: "",
      timeRange: "",
      paymentMethod: "",
    })
    setSearchText("")
    setCurrentPage(1)
  }

  // Handle view detail
  const handleViewDetail = async (orderId: number) => {
    setSelectedOrderId(orderId)
    await fetchOrderDetail(orderId)
    setShowOrderDetail(true)
  }

  // Handle close detail
  const handleCloseDetail = () => {
    setShowOrderDetail(false)
    setSelectedOrderId(null)
  }

  // Handle status update
  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setShowStatusPopup(true)
  }

  const handleConfirmStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return

    setIsUpdatingStatus(true)

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/order/update-status/${selectedOrder.id}`, {
        status: newStatus,
      })

      // Update the order in the local state
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order,
      )

      // Since we don't have setOrders from useFetch, we'll refresh the page
      setShowStatusPopup(false)
      setSelectedOrder(null)
      setNewStatus("")

      setPopupContent({
        title: "Thành công",
        message: response.data.message || "Cập nhật trạng thái đơn hàng thành công!",
        type: "success",
      })
      setPopupOpen(true)

      // Refresh page after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      console.error("Lỗi cập nhật trạng thái:", error)

      let errorMessage = "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      setPopupContent({
        title: "Lỗi",
        message: errorMessage,
        type: "error",
      })
      setPopupOpen(true)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleCancelStatusUpdate = () => {
    setShowStatusPopup(false)
    setSelectedOrder(null)
    setNewStatus("")
  }

  // Get status display info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" }
      case "confirmed":
        return { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" }
      case "success":
        return { label: "Hoàn tất", color: "bg-green-100 text-green-800" }
      case "cancelled":
        return { label: "Đã hủy", color: "bg-red-100 text-red-800" }
      default:
        return { label: "Không rõ", color: "bg-gray-100 text-gray-600" }
    }
  }

  const statisticsData = [
    {
      label: "Đơn hôm nay",
      value: totalToday,
      icon: <FaShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Chờ xử lý",
      value: pendingOrders.length,
      icon: <FaClock className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      label: "Đã hoàn tất",
      value: confirmedOrders.length,
      icon: <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Tổng doanh thu",
      value: totalRevenue.toLocaleString() + " ₫",
      icon: <FaMoneyBillWave className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-12 gap-4">
      <PopupNotification
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={popupContent.title}
        type={popupContent.type}
      >
        <p>{popupContent.message}</p>
      </PopupNotification>

      {/* Header */}
      <TitleDesc title="Quản lý đơn hàng" description="Xem và quản lý tất cả những đơn hàng" className="col-span-12" />

      {/* Filters */}
      <div className="col-span-12">
        <Card className="bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Trạng thái</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full bg-white border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="success">Hoàn tất</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Thời gian</label>
                <select
                  value={filters.timeRange}
                  onChange={(e) => handleFilterChange("timeRange", e.target.value)}
                  className="w-full bg-white border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Thanh toán</label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                  className="w-full bg-white border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="cash">Tiền mặt</option>
                  <option value="momo">Ví Momo</option>
                  <option value="vnpay">Ví VNPay</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleApplyFilters}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                >
                  <FaFilter className="w-4 h-4" />
                  <span className="hidden sm:inline">Lọc đơn hàng</span>
                  <span className="sm:hidden">Lọc</span>
                </button>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleClearFilters}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                >
                  <FaTimes className="w-4 h-4" />
                  <span className="hidden sm:inline">Xóa bộ lọc</span>
                  <span className="sm:hidden">Xóa</span>
                </button>
              </div>
            </div>

            {/* Filter Summary */}
            {(filters.status || filters.timeRange || filters.paymentMethod || searchText) && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-orange-800">Bộ lọc đang áp dụng:</span>
                  {searchText && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Tìm kiếm: &quot;{searchText}&quot;
                    </span>
                  )}
                  {filters.status && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Trạng thái: {getStatusInfo(filters.status).label}
                    </span>
                  )}
                  {filters.timeRange && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Thời gian:{" "}
                      {filters.timeRange === "today"
                        ? "Hôm nay"
                        : filters.timeRange === "week"
                          ? "Tuần này"
                          : "Tháng này"}
                    </span>
                  )}
                  {filters.paymentMethod && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Thanh toán:{" "}
                      {filters.paymentMethod === "cash"
                        ? "Tiền mặt"
                        : filters.paymentMethod === "momo"
                          ? "Ví Momo"
                          : "Ví VNPay"}
                    </span>
                  )}
                  <span className="text-sm text-orange-700">({filteredOrders.length} kết quả)</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics - Responsive */}
      <div className="col-span-12">
        {/* Desktop and Tablet Layout */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {statisticsData.map((item, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 leading-tight">
                      {item.label}
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-none">
                      {typeof item.value === "number" ? item.value : item.value}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${item.color} text-white ml-2 sm:ml-4`}>
                    {item.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden space-y-3">
          {statisticsData.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-200 border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${item.bgColor} flex-shrink-0`}>
                    <div className={item.textColor}>{item.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 truncate">{item.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {typeof item.value === "number" ? item.value : item.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Bar for Mobile */}
        <div className="sm:hidden mt-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-orange-800">Tổng đơn hàng:</span>
            <span className="font-bold text-orange-900">{filteredOrders.length} đơn</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="col-span-12">
        <Card>
          <CardHeader header="Tất cả đơn hàng" className="flex justify-between items-center">
            <div className="flex gap-2 w-full max-w-md">
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                  <tr>
                    <th className="px-2 sm:px-4 py-2">MÃ ĐƠN</th>
                    <th className="px-2 sm:px-4 py-2 hidden sm:table-cell">KHÁCH HÀNG</th>
                    <th className="px-2 sm:px-4 py-2">TỔNG TIỀN</th>
                    <th className="px-2 sm:px-4 py-2">HÌNH THỨC THANH TOÁN</th>
                    <th className="px-2 sm:px-4 py-2">TRẠNG THÁI</th>
                    <th className="px-2 sm:px-4 py-2">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((order, idx) => (
                      <tr key={order.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                        <td className="px-2 sm:px-4 py-2 font-medium">#{order.id}</td>
                        <td className="px-2 sm:px-4 py-2 hidden sm:table-cell">
                          <div className="max-w-[150px] truncate">{order.customer?.name}</div>
                        </td>
                        <td className="px-2 sm:px-4 py-2 font-semibold text-green-600">
                          {order.total_price.toLocaleString()} ₫
                        </td>
                        <td className="px-2 sm:px-4 py-2 font-medium">
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${
                              order.payment_method === "cash"
                                ? "bg-[#4CAF50] text-white"
                                : order.payment_method === "momo"
                                  ? "bg-[#D82D8B] text-white"
                                  : "bg-[#0066B2] text-white"
                            }`}
                          >
                            {order.payment_method === "cash"
                              ? "Tiền mặt"
                              : order.payment_method === "momo"
                                ? "Ví Momo"
                                : "Ví VNPay"}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-2">
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${getStatusInfo(order.status).color}`}
                          >
                            {getStatusInfo(order.status).label}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              className="p-2 flex items-center gap-1 text-sm text-blue-700 border border-blue-700 rounded hover:bg-blue-100 font-semibold cursor-pointer"
                              onClick={() => handleViewDetail(order.id)}
                            >
                              <FaInfo />
                            </button>
                            {order.status !== "success" && (
                              <button
                                className="p-2 flex items-center gap-1 text-sm text-orange-700 border border-orange-700 rounded hover:bg-orange-100 font-semibold cursor-pointer"
                                onClick={() => handleUpdateStatus(order)}
                              >
                                <FaEdit className="w-3 h-3" />
                                Sửa
                              </button>
                            )}
                            {order.status === "success" && (
                              <span className="p-2 flex items-center gap-1 text-sm text-gray-400 border border-gray-400 rounded bg-gray-100 font-medium">
                                <FaEdit className="w-3 h-3" />
                                Đã hoàn tất
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Không tìm thấy đơn hàng nào phù hợp với bộ lọc
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalItems={filteredOrders.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Update Popup */}
      <Popup
        isOpen={showStatusPopup}
        onClose={handleCancelStatusUpdate}
        title={`Cập nhật trạng thái đơn hàng #${selectedOrder?.id}`}
        width="w-full md:w-[500px]"
      >
        {selectedOrder && (
          <div className="space-y-4">
            {selectedOrder.status === "success" && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <h4 className="font-medium text-red-800">Đơn hàng đã hoàn tất</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Đơn hàng này đã được hoàn tất và không thể thay đổi trạng thái. Điểm thưởng đã được tích cho khách
                      hàng.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Thông tin đơn hàng</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Mã đơn: #{selectedOrder.id}</div>
                <div>Khách hàng: {selectedOrder.customer?.name || "Khách vãng lai"}</div>
                <div>Tổng tiền: {selectedOrder.total_price.toLocaleString()} ₫</div>
                <div>
                  Trạng thái hiện tại:{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusInfo(selectedOrder.status).color}`}
                  >
                    {getStatusInfo(selectedOrder.status).label}
                  </span>
                </div>
              </div>
            </div>

            {selectedOrder.status !== "success" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chọn trạng thái mới</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="success">Hoàn tất</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                {newStatus === "success" && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Lưu ý:</strong> Khi chuyển trạng thái thành &quot;Hoàn tất&quot;, hệ thống sẽ tự động tích điểm cho
                      khách hàng và không thể thay đổi lại.
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={handleCancelStatusUpdate}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {selectedOrder.status === "success" ? "Đóng" : "Hủy"}
              </Button>
              {selectedOrder.status !== "success" && (
                <Button
                  onClick={handleConfirmStatusUpdate}
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdatingStatus || newStatus === selectedOrder.status}
                >
                  {isUpdatingStatus ? "Đang cập nhật..." : "Cập nhật trạng thái"}
                </Button>
              )}
            </div>
          </div>
        )}
      </Popup>

      {/* Order Detail Popup */}
      <Popup
        isOpen={showOrderDetail}
        onClose={handleCloseDetail}
        title={`Chi tiết đơn hàng #${selectedOrderId}`}
        width="w-full md:w-[800px] lg:w-[900px]"
      >
        {!orderDetail ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Đang tải thông tin...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Thông tin đơn hàng</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium ml-2">#{orderDetail.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium ml-2">{new Date(orderDetail.created_at).toLocaleString("vi-VN")}</span>
                </div>
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusInfo(orderDetail.status).color}`}
                  >
                    {getStatusInfo(orderDetail.status).label}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-bold ml-2 text-green-600">
                    {Number(orderDetail.total_price).toLocaleString()} ₫
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            {orderDetail.customer && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Thông tin khách hàng</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Tên khách hàng:</span>
                    <span className="font-medium ml-2">{orderDetail.customer.name}</span>
                  </div>
                  {orderDetail.customer.phone && (
                    <div>
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="font-medium ml-2">{orderDetail.customer.phone}</span>
                    </div>
                  )}
                  {orderDetail.customer.email && (
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium ml-2">{orderDetail.customer.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Table Information */}
            {orderDetail.tables && orderDetail.tables.length > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Thông tin bàn</h3>
                <div className="space-y-2 text-sm">
                  {orderDetail.tables.map((table, idx) => (
                    <div key={table.id || idx}>
                      <span className="text-gray-600">Bàn số:</span>
                      <span className="font-medium ml-2">{table.table_number}</span>
                      {table.max_guests && (
                        <>
                          <span className="text-gray-600 ml-4">Sức chứa:</span>
                          <span className="font-medium ml-2">{table.max_guests} người</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            {orderDetail.items && orderDetail.items.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Chi tiết món ăn</h3>
                <div className="space-y-3">
                  {orderDetail.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded border gap-2 sm:gap-4"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {item.food?.name || item.combo?.name || "Món ăn"}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col text-center">
                        <div className="text-sm text-gray-600 mr-2 sm:mr-0">Số lượng:</div>
                        <div className="font-medium">{item.quantity}</div>
                      </div>
                      <div className="flex flex-row sm:flex-col text-right">
                        <div className="text-sm text-gray-600 mr-2 sm:mr-0">Đơn giá:</div>
                        <div className="font-medium">{Number(item.price).toLocaleString()} ₫</div>
                      </div>
                      <div className="flex flex-row sm:flex-col text-right">
                        <div className="text-sm text-gray-600 mr-2 sm:mr-0">Thành tiền:</div>
                        <div className="font-bold text-green-600">
                          {(Number(item.price) * item.quantity).toLocaleString()} ₫
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Popup>
    </div>
  )
}
