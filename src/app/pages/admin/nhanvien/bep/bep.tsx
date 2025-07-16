"use client"
import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import TitleDesc from "../../../../components/ui/titleDesc"
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card"
import SearchInput from "../../../../components/ui/SearchInput"
import { useFetch } from "../../../../hooks/useFetch"
import { useSearchFilter } from "../../../../hooks/useSearchFilter"
import {
  type OrderItem,
  OrderItemStatus,
  ORDER_ITEM_STATUS_LABELS,
  ORDER_ITEM_STATUS_COLORS,
} from "../../../../types/order"
import { FaTimes, FaUtensils, FaClock, FaCheckCircle } from "react-icons/fa"
import PopupNotification from "../../../../components/ui/PopupNotification"

export default function NhanVienBep() {
  const { orderItems, fetchAllOrderItems } = useFetch()
  const [searchText, setSearchText] = useState("")
  const [loading, setLoading] = useState(true)
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set())

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    timeRange: "",
  })

  // Notification states
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupContent, setPopupContent] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "error",
  })

  // Confirmation popup states
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [confirmMessage, setConfirmMessage] = useState("")

  // Helper function to show popup
  const showPopup = (title: string, message: string, type: "info" | "success" | "error" = "info") => {
    setPopupContent({ title, message, type })
    setPopupOpen(true)
  }

  // Helper function to show confirmation
  const showConfirmation = (message: string, onConfirm: () => void) => {
    setConfirmMessage(message)
    setConfirmAction(() => onConfirm)
    setShowConfirmPopup(true)
  }

  // Search filtering với useSearchFilter
  const searchFiltered = useSearchFilter(orderItems, searchText, [
    "food.name",
    "combo.name",
    "order_info.customer_name",
    "order_info.table_numbers",
  ])

  // Advanced filtering function
  const applyFilters = (data: OrderItem[], filters: { status: string; timeRange: string }) => {
    return data.filter((item) => {
      // Status filter
      if (filters.status && filters.status !== "all") {
        if (item.status !== filters.status) {
          return false
        }
      }

      // Time range filter
      if (filters.timeRange && filters.timeRange !== "all") {
        const itemDate = new Date(item.created_at || "")
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

        switch (filters.timeRange) {
          case "today":
            if (itemDate < startOfDay) return false
            break
          case "pending_preparing":
            if (item.status !== OrderItemStatus.PENDING && item.status !== OrderItemStatus.PREPARING) return false
            break
        }
      }

      return true
    })
  }

  // Tìm kiếm thêm cho trạng thái tiếng Việt
  const statusFiltered = useMemo(() => {
    if (!searchText.trim()) return searchFiltered

    const normalizedSearch = searchText
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")

    return searchFiltered.filter((item: OrderItem) => {
      const statusLabel = ORDER_ITEM_STATUS_LABELS[item.status as OrderItemStatus] || ""
      const normalizedStatusLabel = statusLabel
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")

      return normalizedStatusLabel.includes(normalizedSearch)
    })
  }, [searchFiltered, searchText])

  // Combined filtering
  const filteredItems = useMemo(() => {
    const combined = [...new Set([...searchFiltered, ...statusFiltered])]
    return applyFilters(combined, filters)
  }, [searchFiltered, statusFiltered, filters])

  // Statistics calculations
  const statistics = useMemo(() => {
    const pendingItems = filteredItems.filter((item) => item.status === OrderItemStatus.PENDING)
    const preparingItems = filteredItems.filter((item) => item.status === OrderItemStatus.PREPARING)
    const servedItems = filteredItems.filter((item) => item.status === OrderItemStatus.SERVED)
    const doneItems = filteredItems.filter((item) => item.status === OrderItemStatus.DONE)

    return {
      total: filteredItems.length,
      pending: pendingItems.length,
      preparing: preparingItems.length,
      served: servedItems.length,
      done: doneItems.length,
    }
  }, [filteredItems])

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      status: "",
      timeRange: "",
    })
    setSearchText("")
  }

  // Lấy token từ cookie
  const getAuthToken = () => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";")
      const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("access_token="))
      return tokenCookie ? tokenCookie.split("=")[1] : null
    }
    return null
  }

  // Tạo axios instance với auth header
  const createAuthAxios = () => {
    const token = getAuthToken()
    console.log("Token dùng để gọi API:", token)
    return axios.create({
      baseURL: "http://127.0.0.1:8000/api",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    })
  }

  // Load dữ liệu khi component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchAllOrderItems()
      setLoading(false)
    }
    loadData()
  }, [])

  // Cập nhật status của order item
  const updateOrderItemStatus = async (itemId: number, status: string) => {
    try {
      const authAxios = createAuthAxios()
      const response = await authAxios.put(`/orderitems/update-status/${itemId}`, {
        status: status,
      })
      console.log("Cập nhật status thành công:", response.data)
      await fetchAllOrderItems()
      return {
        success: true,
        message: response.data.message || "Cập nhật trạng thái thành công",
        data: response.data,
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật status:", error)
      let errorMessage = "Có lỗi xảy ra khi cập nhật trạng thái"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 403) {
        errorMessage = "Bạn không có quyền cập nhật trạng thái món ăn"
      } else if (error.response?.status === 401) {
        errorMessage = "Vui lòng đăng nhập lại"
      }
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
      }
    }
  }

  const handleUpdateStatus = async (itemId: number, currentStatus: string) => {
    let nextStatus = ""
    switch (currentStatus) {
      case OrderItemStatus.PENDING:
        nextStatus = OrderItemStatus.PREPARING
        break
      case OrderItemStatus.PREPARING:
        nextStatus = OrderItemStatus.SERVED
        break
      case OrderItemStatus.SERVED:
        nextStatus = OrderItemStatus.DONE
        break
      default:
        return
    }

    setUpdatingItems((prev) => new Set(prev).add(itemId))
    try {
      const result = await updateOrderItemStatus(itemId, nextStatus)
      if (result.success) {
        showPopup("Thành công", result.message, "success")
      } else {
        showPopup("Lỗi", result.message, "error")
      }
    } catch (error) {
      console.error("Lỗi không mong muốn:", error)
      showPopup("Lỗi", "Có lỗi không mong muốn xảy ra", "error")
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleCancelItem = async (itemId: number) => {
    showConfirmation("Bạn có chắc chắn muốn hủy món này?", async () => {
      setUpdatingItems((prev) => new Set(prev).add(itemId))
      try {
        const result = await updateOrderItemStatus(itemId, OrderItemStatus.CANCELLED)
        if (result.success) {
          showPopup("Thành công", "Hủy món thành công", "success")
        } else {
          showPopup("Lỗi", result.message, "error")
        }
      } catch (error) {
        console.error("Lỗi khi hủy món:", error)
        showPopup("Lỗi", "Có lỗi xảy ra khi hủy món", "error")
      } finally {
        setUpdatingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }
    })
  }

  // Render nút action dựa trên status
  const renderActionButton = (item: OrderItem) => {
    const isUpdating = updatingItems.has(item.id)
    if (item.status === OrderItemStatus.DONE || item.status === OrderItemStatus.CANCELLED) {
      return <span className="text-gray-500">Hoàn thành</span>
    }

    return (
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          onClick={() => handleUpdateStatus(item.id, item.status)}
          disabled={isUpdating}
        >
          {isUpdating ? "Đang cập nhật..." : getNextStatusLabel(item.status)}
        </button>
        {item.status !== OrderItemStatus.CANCELLED && (
          <button
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            onClick={() => handleCancelItem(item.id)}
            disabled={isUpdating}
          >
            Hủy
          </button>
        )}
      </div>
    )
  }

  // Lấy label cho status tiếp theo
  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case OrderItemStatus.PENDING:
        return "Bắt đầu chuẩn bị"
      case OrderItemStatus.PREPARING:
        return "Hoàn thành chuẩn bị"
      case OrderItemStatus.SERVED:
        return "Đánh dấu hoàn thành"
      default:
        return "Cập nhật"
    }
  }

  // Xử lý làm mới dữ liệu
  const handleRefresh = async () => {
    setLoading(true)
    await fetchAllOrderItems()
    setLoading(false)
  }

  // Statistics data
  const statisticsData = [
    {
      label: "Tổng món",
      value: statistics.total,
      icon: <FaUtensils className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Chờ chuẩn bị",
      value: statistics.pending,
      icon: <FaClock className="w-5 h-5" />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      label: "Đang chuẩn bị",
      value: statistics.preparing,
      icon: <FaUtensils className="w-5 h-5" />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      label: "Hoàn thành",
      value: statistics.done,
      icon: <FaCheckCircle className="w-5 h-5" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-4 bg-[#fff8f0]">
        <TitleDesc
          title="Quản lý bếp"
          description="Xem và quản lý tất cả món ăn cần chuẩn bị"
          className="col-span-12"
        />
        <div className="col-span-12 flex justify-center items-center h-64">
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Popup Notifications */}
      <PopupNotification
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={popupContent.title}
        type={popupContent.type}
        duration={4000}
      >
        <p>{popupContent.message}</p>
      </PopupNotification>

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận</h3>
            <p className="text-gray-600 mb-6">{confirmMessage}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirmPopup(false)
                  setConfirmAction(null)
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (confirmAction) {
                    confirmAction()
                  }
                  setShowConfirmPopup(false)
                  setConfirmAction(null)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Title */}
      <TitleDesc title="Quản lý bếp" description="Xem và quản lý tất cả món ăn cần chuẩn bị" className="col-span-12" />

      {/* Filters */}
      <div className="col-span-12">
        <Card className="bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Trạng thái</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full bg-white border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value={OrderItemStatus.PENDING}>Chờ chuẩn bị</option>
                  <option value={OrderItemStatus.PREPARING}>Đang chuẩn bị</option>
                  <option value={OrderItemStatus.SERVED}>Đã phục vụ</option>
                  <option value={OrderItemStatus.DONE}>Hoàn thành</option>
                  <option value={OrderItemStatus.CANCELLED}>Đã hủy</option>
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
                  <option value="pending_preparing">Cần xử lý</option>
                </select>
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

              <div className="flex items-end">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {/* <FaRefresh className="w-4 h-4" /> */}
                  <span className="hidden sm:inline">{loading ? "Đang tải..." : "Làm mới"}</span>
                  <span className="sm:hidden">{loading ? "Tải..." : "Mới"}</span>
                </button>
              </div>
            </div>

            {/* Filter Summary */}
            {(filters.status || filters.timeRange || searchText) && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-orange-800">Bộ lọc đang áp dụng:</span>
                  {searchText && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Tìm kiếm: "{searchText}"
                    </span>
                  )}
                  {filters.status && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Trạng thái: {ORDER_ITEM_STATUS_LABELS[filters.status as OrderItemStatus]}
                    </span>
                  )}
                  {filters.timeRange && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Thời gian: {filters.timeRange === "today" ? "Hôm nay" : "Cần xử lý"}
                    </span>
                  )}
                  <span className="text-sm text-orange-700">({filteredItems.length} kết quả)</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="col-span-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-none">{item.value}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${item.color} text-white ml-2 sm:ml-4`}>
                    {item.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="col-span-12">
        <Card>
          <CardHeader header="Danh sách món ăn cần chuẩn bị" className="flex justify-between items-center">
            <div className="flex gap-2 w-full max-w-md">
              <SearchInput
                value={searchText}
                onChange={setSearchText}
                placeholder="Tìm kiếm theo tên món, khách hàng, bàn, trạng thái..."
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                  title="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600">
                Hiển thị: {filteredItems.length}/{orderItems.length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchText || filters.status || filters.timeRange ? (
                  <div>
                    <p>Không tìm thấy món ăn nào phù hợp với bộ lọc</p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  "Không có món ăn nào cần chuẩn bị"
                )}
              </div>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-[#fff8f1] text-[#5c4033] font-medium text-sm">
                    <tr>
                      <th className="px-4 py-3">Mã đơn</th>
                      <th className="px-4 py-3">Tên món</th>
                      <th className="px-4 py-3">Số lượng</th>
                      <th className="px-4 py-3">Giá</th>
                      <th className="px-4 py-3">Khách hàng</th>
                      <th className="px-4 py-3">Bàn</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">#{item.order_id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{item.food?.name || item.combo?.name || "N/A"}</div>
                          {item.combo && <div className="text-xs text-gray-500">Combo</div>}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold">{item.quantity}</td>
                        <td className="px-4 py-3">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.price)}
                        </td>
                        <td className="px-4 py-3">{item.order_info?.customer_name || "N/A"}</td>
                        <td className="px-4 py-3 font-medium">{item.order_info?.table_numbers || "N/A"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ORDER_ITEM_STATUS_COLORS[item.status as OrderItemStatus] || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {ORDER_ITEM_STATUS_LABELS[item.status as OrderItemStatus] || item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{renderActionButton(item)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
