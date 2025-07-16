"use client"
import type React from "react"
import { useState, useMemo } from "react"
import { FaReply, FaSort, FaSortUp, FaSortDown, FaStar, FaEye } from "react-icons/fa"
import { Card, CardHeader, CardContent } from "../../../../components/ui/Card"
import { Button } from "../../../../components/ui/button"
import { useFetch } from "../../../../hooks/useFetch"
import usePagination from "@/src/app/hooks/usePagination"
import Pagination from "../../../../components/ui/Panigation"
import Popup from "../../../../components/ui/Popup"
import PopupNotification from "../../../../components/ui/PopupNotification"
import SearchInput from "../../../../components/ui/SearchInput"
import InputField from "../../../../components/ui/InputField"
import { useSearchFilter } from "@/src/app/hooks/useSearchFilter"
import type { Feedback } from "@/src/app/types/feedback"
import axios from "axios"

type SortField = "id" | "rating" | "status" | null
type SortDirection = "asc" | "desc" | null

export default function FeedbackComponent({
  feedbackRef,
}: {
  feedbackRef: React.RefObject<HTMLDivElement | null>
}) {
  const [searchText, setSearchText] = useState("")
  const { feedbacks, setFeedbacks, customers, orders } = useFetch()

  // Enhance feedbacks with customer and order names for display
  const enhancedFeedbacks = useMemo(() => {
    return feedbacks.map((feedback) => {
      const customer = customers.find((c) => c.id === feedback.customer_id)
      const order = orders.find((o) => o.id === feedback.order_id)
      return {
        ...feedback,
        customer_name: customer?.name || `ID: ${feedback.customer_id}`,
        order_display_id: order?.id || `ID: ${feedback.order_id}`,
        is_replied: feedback["admin-reply"] !== null && feedback["admin-reply"].trim() !== "",
      }
    })
  }, [feedbacks, customers, orders])

  const filteredFeedbacks = useSearchFilter(enhancedFeedbacks, searchText, [
    "customer_name",
    "comment",
    "order_display_id",
  ])

  // Sort states
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Apply sorting to filtered data
  const sortedAndFilteredFeedbacks = useMemo(() => {
    if (!sortField || !sortDirection) return filteredFeedbacks

    return [...filteredFeedbacks].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "id":
          aValue = a.id
          bValue = b.id
          break
        case "rating":
          aValue = a.rating
          bValue = b.rating
          break
        case "status":
          aValue = a.is_replied ? 1 : 0
          bValue = b.is_replied ? 1 : 0
          break
        default:
          return 0
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })
  }, [filteredFeedbacks, sortField, sortDirection])

  const {
    currentPage,
    setCurrentPage,
    currentData: currentFeedbacks,
    totalItems,
    itemsPerPage,
  } = usePagination(sortedAndFilteredFeedbacks, 10)

  // Popup states
  const [isReplyPopupOpen, setIsReplyPopupOpen] = useState(false)
  const [isViewDetailsPopupOpen, setIsViewDetailsPopupOpen] = useState(false) // New state for view details popup
  const [replyFormData, setReplyFormData] = useState({ reply: "" })
  const [selectedFeedback, setSelectedFeedback] = useState<
    (Feedback & { customer_name?: string; order_display_id?: string; is_replied?: boolean }) | null
  >(null)
  const [loading, setLoading] = useState(false)

  // Notification state
  const [notif, setNotif] = useState({
    open: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  })

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
    setCurrentPage(1)
  }

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="w-3 h-3" />
    if (sortDirection === "asc") return <FaSortUp className="w-3 h-3" />
    if (sortDirection === "desc") return <FaSortDown className="w-3 h-3" />
    return <FaSort className="w-3 h-3" />
  }

  // Show notification
  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotif({ open: true, message, type })
  }

  // Handle open reply popup
  const handleOpenReplyPopup = (
    feedback: Feedback & { customer_name?: string; order_display_id?: string; is_replied?: boolean },
  ) => {
    setSelectedFeedback(feedback)
    setReplyFormData({ reply: feedback["admin-reply"] || "" })
    setIsReplyPopupOpen(true)
  }

  // Handle close reply popup
  const handleCloseReplyPopup = () => {
    setReplyFormData({ reply: "" })
    setSelectedFeedback(null)
    setIsReplyPopupOpen(false)
  }

  // Handle open view details popup
  const handleOpenViewDetailsPopup = (
    feedback: Feedback & { customer_name?: string; order_display_id?: string; is_replied?: boolean },
  ) => {
    setSelectedFeedback(feedback)
    setReplyFormData({ reply: feedback["admin-reply"] || "" }) // Populate with existing reply
    setIsViewDetailsPopupOpen(true)
  }

  // Handle close view details popup
  const handleCloseViewDetailsPopup = () => {
    setReplyFormData({ reply: "" })
    setSelectedFeedback(null)
    setIsViewDetailsPopupOpen(false)
  }

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyFormData((prev) => ({ ...prev, reply: e.target.value }))
  }

  // Submit admin reply
  const handleSubmitReply = async () => {
    if (!replyFormData.reply.trim()) {
      showNotification("Nội dung trả lời là bắt buộc", "error")
      return
    }

    if (!selectedFeedback) return

    try {
      setLoading(true)
      const response = await axios.put(`http://127.0.0.1:8000/api/feedbacks/reply/${selectedFeedback.id}`, {
        admin_reply: replyFormData.reply,
      })

      // Update feedback in the list
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === selectedFeedback.id ? { ...f, "admin-reply": response.data.data["admin-reply"] } : f,
        ),
      )

      showNotification("Trả lời feedback thành công!", "success")
      handleCloseReplyPopup()
    } catch (error: any) {
      console.error("Error replying to feedback:", error)
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi trả lời feedback"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="col-span-12" ref={feedbackRef}>
      {/* Notification Popup */}
      <PopupNotification
        isOpen={notif.open}
        onClose={() => setNotif((prev) => ({ ...prev, open: false }))}
        title={notif.type === "success" ? "Thành công" : notif.type === "error" ? "Lỗi" : "Thông báo"}
        type={notif.type}
      >
        <p>{notif.message}</p>
      </PopupNotification>

      <Card>
        <CardHeader header="Danh sách Feedback" className="flex justify-between items-center">
          <div className="flex gap-2 w-full max-w-md">
            <SearchInput
              value={searchText}
              onChange={setSearchText}
              placeholder="Tìm kiếm theo khách hàng, đơn hàng, bình luận..."
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                <tr>
                  <th
                    className="px-4 py-2 cursor-pointer hover:bg-[#fff0e6] transition-colors select-none"
                    onClick={() => handleSort("id")}
                    title="Nhấn để sắp xếp theo ID"
                  >
                    <div className="flex items-center gap-2">
                      <span>ID</span>
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th className="px-4 py-2">Khách hàng</th>
                  <th className="px-4 py-2">Mã đơn hàng</th>
                  <th
                    className="px-4 py-2 cursor-pointer hover:bg-[#fff0e6] transition-colors select-none"
                    onClick={() => handleSort("rating")}
                    title="Nhấn để sắp xếp theo đánh giá"
                  >
                    <div className="flex items-center gap-2">
                      <span>Đánh giá</span>
                      {getSortIcon("rating")}
                    </div>
                  </th>
                  <th className="px-4 py-2">Bình luận</th>
                  <th className="px-4 py-2">Trả lời Admin</th>
                  <th
                    className="px-4 py-2 cursor-pointer hover:bg-[#fff0e6] transition-colors select-none"
                    onClick={() => handleSort("status")}
                    title="Nhấn để sắp xếp theo trạng thái trả lời"
                  >
                    <div className="flex items-center gap-2">
                      <span>Trạng thái</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th className="px-4 py-2">Ngày gửi</th>
                  <th className="px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentFeedbacks.length > 0 ? (
                  currentFeedbacks.map((feedback, index) => (
                    <tr key={feedback.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                      <td className="px-4 py-2 font-medium">{feedback.id}</td>
                      <td className="px-4 py-2">{feedback.customer_name}</td>
                      <td className="px-4 py-2">{feedback.order_display_id}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                          {Array.from({ length: feedback.rating }).map((_, i) => (
                            <FaStar key={i} className="w-4 h-4" />
                          ))}
                          {/* <span className="ml-1 text-gray-600">({feedback.rating}/5)</span> */}
                        </div>
                      </td>
                      <td
                        className="px-4 py-2 text-gray-600 max-w-[200px] truncate"
                        title={feedback.comment || "Không có bình luận"}
                      >
                        {feedback.comment || "Không có bình luận"}
                      </td>
                      <td
                        className="px-4 py-2 text-gray-700 max-w-[200px] truncate"
                        title={feedback["admin-reply"] || "Chưa có trả lời"}
                      >
                        {feedback["admin-reply"] || "Chưa có trả lời"}
                      </td>
                      <td className={`px-4 py-2 font-bold ${feedback.is_replied ? "text-green-600" : "text-red-600"}`}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${feedback.is_replied ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          {feedback.is_replied ? "Đã trả lời" : "Chưa trả lời"}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {new Date(feedback.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => handleOpenViewDetailsPopup(feedback)}
                                className="px-2 py-1 text-gray-700 border border-gray-700 rounded flex items-center gap-1 hover:bg-gray-100 transition-colors"
                                disabled={loading}
                            >
                                <FaEye />
                            </Button>
                            {!feedback.is_replied && (
                            <Button
                                onClick={() => handleOpenReplyPopup(feedback)}
                                className="px-2 py-1 text-blue-700 border border-blue-700 rounded flex items-center gap-1 hover:bg-blue-100 transition-colors"
                                disabled={loading}
                                >
                                <FaReply />
                            </Button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      {searchText ? "Không tìm thấy feedback nào phù hợp" : "Chưa có feedback nào"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sort info */}
          {sortField && sortDirection && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <span>Đang sắp xếp theo:</span>
              <span className="font-medium">
                {sortField === "id" ? "ID" : sortField === "rating" ? "Đánh giá" : "Trạng thái"} (
                {sortDirection === "asc" ? "Tăng dần" : "Giảm dần"})
              </span>
              <button
                onClick={() => {
                  setSortField(null)
                  setSortDirection(null)
                }}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Bỏ sắp xếp
              </button>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Reply Feedback Popup (for new replies) */}
      <Popup isOpen={isReplyPopupOpen} onClose={handleCloseReplyPopup} title="Trả lời Feedback">
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm font-medium text-gray-700">
              <span className="font-semibold">Khách hàng:</span> {selectedFeedback?.customer_name}
            </p>
            <p className="text-sm font-medium text-gray-700">
              <span className="font-semibold">Đơn hàng:</span> {selectedFeedback?.order_display_id}
            </p>
            <p className="text-sm font-medium text-gray-700">
              <span className="font-semibold">Đánh giá:</span> {selectedFeedback?.rating}{" "}
              <FaStar className="inline-block text-yellow-500" />
            </p>
            <p className="text-sm text-gray-800 mt-2">
              <span className="font-semibold">Bình luận:</span> {selectedFeedback?.comment || "Không có bình luận"}
            </p>
          </div>
          <InputField
            label="Nội dung trả lời *"
            name="reply"
            value={replyFormData.reply}
            onChange={handleReplyChange}
            placeholder="Nhập nội dung trả lời của admin"
            required
            // This popup is only for replying, so it's always editable
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={handleCloseReplyPopup}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitReply}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              disabled={loading || !replyFormData.reply.trim()}
            >
              {loading ? "Đang gửi..." : "Gửi trả lời"}
            </Button>
          </div>
        </div>
      </Popup>

      {/* View Details Feedback Popup (for viewing existing replies) */}
      <Popup isOpen={isViewDetailsPopupOpen} onClose={handleCloseViewDetailsPopup} title="Chi tiết Feedback">
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm font-medium text-gray-700">
              <span className="font-semibold">Khách hàng:</span> {selectedFeedback?.customer_name}
            </p>
            <p className="text-sm font-medium text-gray-700">
              <span className="font-semibold">Đơn hàng:</span> {selectedFeedback?.order_display_id}
            </p>
            <p className="text-sm font-medium text-gray-700">
              <span className="font-semibold">Đánh giá:</span> {selectedFeedback?.rating}{" "}
              <FaStar className="inline-block text-yellow-500" />
            </p>
            <p className="text-sm text-gray-800 mt-2">
              <span className="font-semibold">Bình luận:</span> {selectedFeedback?.comment || "Không có bình luận"}
            </p>
          </div>
          <InputField
            label="Nội dung trả lời của Admin"
            name="reply"
            value={replyFormData.reply}
            readOnly // Always read-only for this popup
            disabled // Always disabled for this popup
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={handleCloseViewDetailsPopup}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Đóng
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  )
}
