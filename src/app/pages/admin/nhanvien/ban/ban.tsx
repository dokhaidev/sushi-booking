"use client"
import { useEffect, useState, useMemo } from "react"
import TitleDesc from "../../../../components/ui/titleDesc"
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card"
import SearchInput from "../../../../components/ui/SearchInput"
import { useFetch } from "../../../../hooks/useFetch"
import axios from "axios"
import { useSearchFilter } from "../../../../hooks/useSearchFilter"
import {
  type OrderItem,
  OrderItemStatus,
  ORDER_ITEM_STATUS_LABELS,
  ORDER_ITEM_STATUS_COLORS,
} from "../../../../types/order"
import PopupNotification from "../../../../components/ui/PopupNotification"

export default function NhanVienBan() {
  const { orderItems, fetchOrderItemsByRole, loading, setLoading } = useFetch()
  const [searchText, setSearchText] = useState("")
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

  // Advanced filtering function for Staff
  const applyFilters = (data: OrderItem[], filters: { status: string; timeRange: string }) => {
    return data.filter((item) => {
      // Staff only sees SERVED items by default
      if (item.status !== OrderItemStatus.SERVED) {
        return false
      }

      // Status filter (if user applies additional filter)
      if (filters.status && filters.status !== "all") {
        if (item.status !== filters.status) {
          return false
        }
      }

      // Time range filter
      if (filters.timeRange && filters.timeRange !== "all") {
        const itemDate = new Date(item.order_info?.order_date || "")
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        switch (filters.timeRange) {
          case "today":
            if (itemDate < startOfDay) return false
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
    const authAxiosInstance = axios.create({
      baseURL: "http://127.0.0.1:8000/api",
    })
    if (token) {
      authAxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete authAxiosInstance.defaults.headers.common["Authorization"]
    }
    authAxiosInstance.defaults.headers.common["Content-Type"] = "application/json"
    return authAxiosInstance
  }

  // Load dữ liệu khi component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchOrderItemsByRole("staff") // Fetch for staff role
      setLoading(false)
    }
    loadData()
  }, [fetchOrderItemsByRole, setLoading])

  // Cập nhật status của order item
  const updateOrderItemStatus = async (itemId: number, status: string) => {
    try {
      const authAxios = createAuthAxios()
      const response = await authAxios.put(`/orderitems/update-status/${itemId}`, {
        status: status,
      })
      await fetchOrderItemsByRole("staff") // Re-fetch data after update
      return {
        success: true,
        message: response.data.message || "Cập nhật trạng thái thành công",
        data: response.data,
      }
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật status:", error)
      let errorMessage = "Có lỗi xảy ra khi cập nhật trạng thái"
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response?.status === 403) {
          errorMessage = "Lỗi 403: Bạn không có quyền cập nhật trạng thái món ăn."
        } else if (error.response?.status === 401) {
          errorMessage = "Lỗi 401: Vui lòng đăng nhập lại."
        }
      }
      return {
        success: false,
        message: errorMessage,
        error: axios.isAxiosError(error) ? error.response?.data || error.message : "Unknown error",
      }
    }
  }

  const handleUpdateStatus = async (itemId: number, currentStatus: string) => {
    let nextStatus = ""
    switch (currentStatus) {
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
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          onClick={() => handleUpdateStatus(item.id, item.status)}
          disabled={isUpdating}
        >
          {isUpdating ? "Đang cập nhật..." : "Đánh dấu hoàn thành"}
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

  // Xử lý làm mới dữ liệu
  const handleRefresh = async () => {
    setLoading(true)
    await fetchOrderItemsByRole("staff")
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-4">
        <TitleDesc
          title="Phục vụ bàn"
          description="Xem các món ăn đã sẵn sàng và cập nhật trạng thái sau khi phục vụ"
          className="col-span-12"
        />
        <div className="col-span-12 flex justify-center items-center h-64">
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-4 bg-[#f0fbff]">
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
      <TitleDesc
        title="Phục vụ bàn"
        description="Xem các món ăn đã sẵn sàng và cập nhật trạng thái sau khi phục vụ"
        className="col-span-12"
      />
      <div className="col-span-12">
        <Card>
          <CardHeader header="Danh sách món ăn đã phục vụ" className="flex justify-between items-center">
            <div className="flex gap-2 w-full max-w-md">
              <SearchInput
                value={searchText}
                onChange={setSearchText}
                placeholder="Tìm kiếm theo tên món, khách hàng, bàn..."
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
            <div className="flex items-end">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="hidden sm:inline">{loading ? "Đang tải..." : "Làm mới"}</span>
                <span className="sm:hidden">{loading ? "Tải..." : "Mới"}</span>
              </button>
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
                  "Không có món ăn nào đã phục vụ"
                )}
              </div>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-[#fff8f1] text-[#5c4033] font-medium text-sm">
                    <tr>
                      <th className="px-4 py-2">Mã đơn</th>
                      <th className="px-4 py-2">Tên món</th>
                      <th className="px-4 py-2">Số lượng</th>
                      <th className="px-4 py-2">Giá</th> {/* Added column */}
                      <th className="px-4 py-2">Bàn</th>
                      <th className="px-4 py-2">Ngày đặt</th> {/* Added column */}
                      <th className="px-4 py-2">Giờ đặt</th>
                      <th className="px-4 py-2">Trạng thái</th>
                      <th className="px-4 py-2">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                        <td className="px-4 py-2">#{item.order_id}</td>
                        <td className="px-4 py-2">
                          <div className="font-medium">{item.food?.name || item.combo?.name || "N/A"}</div>
                          {item.combo && <div className="text-xs text-gray-500">Combo</div>}
                        </td>
                        <td className="px-4 py-2 text-center font-semibold">{item.quantity}</td>
                        <td className="px-4 py-2">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.price)}
                        </td>
                        <td className="px-4 py-2">{item.order_info?.table_numbers || "N/A"}</td>
                        <td className="px-4 py-2">
                          {item.order_info?.reservation_date
                            ? new Date(item.order_info.reservation_date).toLocaleDateString("vi-VN")
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          {item.order_info?.reservation_time
                            ? new Date(`2000-01-01T${item.order_info.reservation_time}`).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ORDER_ITEM_STATUS_COLORS[item.status as OrderItemStatus] || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {ORDER_ITEM_STATUS_LABELS[item.status as OrderItemStatus] || item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{renderActionButton(item)}</td>
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
