"use client"

import type React from "react"
import { useState } from "react"
import TitleDesc from "../../../../components/ui/titleDesc"
import { FaPlus } from "react-icons/fa"
import { Button } from "@/src/app/components/ui/button"
import { Card, CardHeader, CardContent } from "../../../../components/ui/Card"
import Pagination from "../../../../components/ui/Panigation"
import { useFetch } from "@/src/app/hooks/useFetch"
import type { Table } from "@/src/app/types"
import Popup from "@/src/app/components/ui/Popup"
import InputField from "@/src/app/components/ui/InputField"
import PopupNotification from "@/src/app/components/ui/PopupNotification"
import { addTable } from "@/src/app/hooks/useAdd"

export default function QuanLyBan() {
  const { tables } = useFetch()
  const [currentPage, setCurrentPage] = useState(1)
  const [openPopup, setOpenPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Notification states
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupContent, setPopupContent] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "error",
  })

  const [formData, setFormData] = useState({
    table_number: "",
    max_guests: "",
    status: "available",
  })

  // Form validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const itemsPerPage = 6
  const paginatedData = tables.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-600"
      case "occupied":
        return "bg-red-100 text-red-600"
      case "reserved":
        return "bg-yellow-100 text-yellow-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Còn trống"
      case "occupied":
        return "Đang sử dụng"
      case "reserved":
        return "Đã đặt"
      default:
        return status
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.table_number.trim()) {
      newErrors.table_number = "Số bàn không được để trống"
    } else {
      // Kiểm tra trùng số bàn
      const existingTable = tables.find(
        (table) => table.table_number.toLowerCase() === formData.table_number.toLowerCase(),
      )
      if (existingTable) {
        newErrors.table_number = "Số bàn đã tồn tại trong hệ thống"
      }
    }

    // Kiểm tra số lượng khách tối đa
    if (!formData.max_guests.trim()) {
      newErrors.max_guests = "Số lượng khách tối đa không được để trống"
    } else {
      const maxGuests = Number.parseInt(formData.max_guests)

      if (isNaN(maxGuests)) {
        newErrors.max_guests = "Số lượng khách tối đa phải là số hợp lệ"
      } else if (maxGuests < 2) {
        newErrors.max_guests = "Số lượng khách tối đa phải từ 2 người trở lên"
      } else if (maxGuests > 20) {
        newErrors.max_guests = "Số lượng khách tối đa không được vượt quá 20 người"
      } else if (maxGuests % 2 !== 0) {
        newErrors.max_guests = "Số lượng khách tối đa phải là số chẵn (2, 4, 6, 8...)"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }

    // Kiểm tra trùng số bàn real-time
    if (name === "table_number" && value.trim().length > 0) {
      const existingTable = tables.find((table) => table.table_number.toLowerCase() === value.toLowerCase())
      if (existingTable) {
        setErrors({ ...errors, table_number: "Số bàn đã tồn tại trong hệ thống" })
      }
    }

    // Kiểm tra số lượng khách real-time
    if (name === "max_guests" && value.trim().length > 0) {
      const maxGuests = Number.parseInt(value)
      let guestError = ""

      if (isNaN(maxGuests)) {
        guestError = "Số lượng khách tối đa phải là số hợp lệ"
      } else if (maxGuests < 2) {
        guestError = "Số lượng khách tối đa phải từ 2 người trở lên"
      } else if (maxGuests > 20) {
        guestError = "Số lượng khách tối đa không được vượt quá 20 người"
      } else if (maxGuests % 2 !== 0) {
        guestError = "Số lượng khách tối đa phải là số chẵn (2, 4, 6, 8...)"
      }

      if (guestError) {
        setErrors({ ...errors, max_guests: guestError })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      table_number: "",
      max_guests: "",
      status: "available",
    })
    setErrors({})
  }

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const tableData = {
        table_number: formData.table_number.trim(),
        max_guests: Number.parseInt(formData.max_guests),
        status: formData.status as "available" | "reserved" | "occupied",
      }

      await addTable(tableData)
      setOpenPopup(false)
      resetForm()

      setPopupContent({
        title: "Thành công",
        message: "Thêm bàn mới thành công! Trang sẽ được tải lại để cập nhật dữ liệu.",
        type: "success",
      })
      setPopupOpen(true)

      // Tải lại trang sau khi hiển thị thông báo thành công
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      console.error("Lỗi khi thêm bàn:", error)

      let errorMessage = "Có lỗi xảy ra khi thêm bàn"

      // Xử lý các loại lỗi khác nhau
      if (error.response?.status === 422) {
        // Lỗi validation từ server
        const validationErrors = error.response.data.errors
        if (validationErrors?.table_number) {
          errorMessage = "Số bàn đã tồn tại trong hệ thống"
        } else {
          errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin."
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      setPopupContent({
        title: "Lỗi",
        message: errorMessage,
        type: "error",
      })
      setPopupOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-4">
      <PopupNotification
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={popupContent.title}
        type={popupContent.type}
      >
        <p>{popupContent.message}</p>
      </PopupNotification>

      <TitleDesc title="Quản lý bàn" description="Xem và quản lý tất cả bàn trong hệ thống" className="mb-6" />

      <div className="col-span-12 mb-6">
        <Card>
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">Trạng thái</label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md">
                <option>Tất cả</option>
                <option>Còn trống</option>
                <option>Đã đặt</option>
                <option>Đang sử dụng</option>
              </select>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">Thời gian</label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md">
                <option>Tất cả</option>
                <option>Hôm nay</option>
                <option>Tuần này</option>
                <option>Tháng này</option>
              </select>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">Số lượng khách</label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md">
                <option>Tất cả</option>
                <option>2 khách</option>
                <option>4 khách</option>
                <option>6 khách</option>
                <option>8 khách</option>
                <option>10 khách</option>
                <option>12 khách</option>
              </select>
            </div>
            <div className="col-span-12 md:col-span-3 flex justify-end">
              <Button className="w-full bg-[#9c6b66] text-white px-6 py-2 rounded-xl">Lọc</Button>
            </div>
          </div>
          <div className="mt-6">
            <Button
              className="bg-[#f3eae4] text-[#9c6b66] px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer hover:bg-[#e8d5c4] transition-colors"
              onClick={() => setOpenPopup(true)}
            >
              <FaPlus /> Thêm bàn
            </Button>
          </div>
        </Card>
      </div>

      <Popup
        isOpen={openPopup}
        onClose={() => {
          setOpenPopup(false)
          resetForm()
        }}
        title="Thêm bàn mới"
        width="w-full md:w-[500px]"
      >
        <form onSubmit={handleAddTable} className="space-y-4">
          <div>
            <InputField
              label="Số bàn *"
              name="table_number"
              value={formData.table_number}
              onChange={handleChange}
              placeholder="VD: B01, Bàn 1, A-01..."
              required
            />
            {errors.table_number && <p className="text-red-500 text-xs mt-1">{errors.table_number}</p>}
          </div>

          <div>
            <InputField
              label="Số khách tối đa *"
              name="max_guests"
              type="number"
              value={formData.max_guests}
              onChange={handleChange}
              placeholder="VD: 2, 4, 6, 8..."
              min="2"
              max="20"
              step="2"
              required
            />
            {errors.max_guests && <p className="text-red-500 text-xs mt-1">{errors.max_guests}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Chỉ nhập số chẵn từ 2 đến 20 (VD: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c6b66] focus:border-[#9c6b66] transition-colors"
              required
            >
              <option value="available">Còn trống</option>
              <option value="occupied">Đang sử dụng</option>
              <option value="reserved">Đã đặt</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
              onClick={() => {
                setOpenPopup(false)
                resetForm()
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-[#9c6b66] hover:bg-[#8a5a54] text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang thêm..." : "Thêm bàn"}
            </Button>
          </div>
        </form>
      </Popup>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.map((table: Table, idx: number) => (
          <Card key={table.id || idx}>
            <CardHeader header={`Bàn số ${table.table_number}`} />
            <CardContent>
              <div className="text-sm mb-2">
                <strong>Khách tối đa:</strong> {table.max_guests} người
              </div>
              <div className="mb-2">
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}
                >
                  {getStatusText(table.status)}
                </span>
              </div>
              {/* Hiển thị khung giờ mẫu */}
              <div className="mt-2">
                <strong>Khung giờ:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["10:00", "12:15", "14:30", "16:45", "18:00", "20:15"].map((time, idx) => (
                    <span key={idx} className="px-2 py-1 bg-[#ffeeda] text-[#5c4033] rounded text-xs">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <button className="text-blue-600 hover:underline text-sm">Chi tiết</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tables.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Chưa có bàn nào trong hệ thống</p>
        </div>
      ) : (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalItems={tables.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
