"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { FaPlus, FaEye, FaEyeSlash, FaGift, FaCheckCircle, FaTimesCircle, FaFilter, FaTimes } from "react-icons/fa"
import TitleDesc from "@/src/app/components/ui/titleDesc"
import { Button } from "@/src/app/components/ui/button"
import { Card, CardContent, CardHeader } from "@/src/app/components/ui/Card"
import Pagination from "@/src/app/components/ui/Panigation"
import Popup from "@/src/app/components/ui/Popup"
import InputField from "@/src/app/components/ui/InputField"
import SearchInput from "@/src/app/components/ui/SearchInput"
import PopupNotification from "@/src/app/components/ui/PopupNotification"
import { useFetch } from "@/src/app/hooks/useFetch"
import type { Voucher, VoucherAdd } from "@/src/app/types/voucher"
import { addVoucher } from "@/src/app/hooks/useAdd"

export default function QuanLyKhuyenMai() {
  const { vouchers, setVouchers } = useFetch()
  const [searchText, setSearchText] = useState("")
  const [voucherPage, setVoucherPage] = useState(1)
  const [openAddPopup, setOpenAddPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    discountRange: "",
  })

  const itemsPerPage = 10

  const [newVoucher, setNewVoucher] = useState<VoucherAdd>({
    code: "",
    discount_value: 0,
    start_date: "",
    end_date: "",
    status: "active",
    usage_limit: 1,
  })

  // Form validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!newVoucher.code.trim()) {
      newErrors.code = "Mã khuyến mãi không được để trống"
    } else if (newVoucher.code.length < 3) {
      newErrors.code = "Mã khuyến mãi phải có ít nhất 3 ký tự"
    }

    if (!newVoucher.discount_value || newVoucher.discount_value <= 0) {
      newErrors.discount_value = "Giá trị khuyến mãi phải lớn hơn 0"
    }

    if (!newVoucher.start_date) {
      newErrors.start_date = "Ngày bắt đầu không được để trống"
    }

    if (!newVoucher.end_date) {
      newErrors.end_date = "Ngày kết thúc không được để trống"
    }

    if (newVoucher.start_date && newVoucher.end_date) {
      const startDate = new Date(newVoucher.start_date)
      const endDate = new Date(newVoucher.end_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (startDate < today) {
        newErrors.start_date = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại"
      }

      if (endDate <= startDate) {
        newErrors.end_date = "Ngày kết thúc phải sau ngày bắt đầu"
      }
    }

    if (!newVoucher.usage_limit || newVoucher.usage_limit <= 0) {
      newErrors.usage_limit = "Số lượng sử dụng phải lớn hơn 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Search and filter function
  const searchAndFilterVouchers = (
    vouchers: Voucher[],
    searchText: string,
    filters: { status: string; timeRange: string; discountRange: string },
  ) => {
    return vouchers.filter((voucher) => {
      // Search filter
      if (searchText) {
        const searchLower = searchText.toLowerCase()
        const matchesCode = voucher.code?.toLowerCase().includes(searchLower) || false
        const matchesId = voucher.id.toString().includes(searchLower)
        const matchesValue = voucher.discount_value.toString().includes(searchLower)

        if (!matchesCode && !matchesId && !matchesValue) {
          return false
        }
      }

      // Status filter
      if (filters.status && filters.status !== "all") {
        if (voucher.status !== filters.status) {
          return false
        }
      }

      // Time range filter
      if (filters.timeRange && filters.timeRange !== "all") {
        const voucherDate = new Date(voucher.start_date)
        const today = new Date()

        switch (filters.timeRange) {
          case "today":
            const todayStr = new Date().toISOString().slice(0, 10)
            if (voucher.start_date?.slice(0, 10) !== todayStr) return false
            break
          case "week":
            const startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - today.getDay())
            startOfWeek.setHours(0, 0, 0, 0)
            if (voucherDate < startOfWeek) return false
            break
          case "month":
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            if (voucherDate < startOfMonth) return false
            break
        }
      }

      // Discount range filter
      if (filters.discountRange && filters.discountRange !== "all") {
        const discountValue = voucher.discount_value
        switch (filters.discountRange) {
          case "under100":
            if (discountValue >= 100000) return false
            break
          case "100to500":
            if (discountValue < 100000 || discountValue > 500000) return false
            break
          case "over500":
            if (discountValue <= 500000) return false
            break
        }
      }

      return true
    })
  }

  // Combined filtering with useMemo for performance
  const filteredVouchers = useMemo(() => {
    return searchAndFilterVouchers(vouchers, searchText, filters)
  }, [vouchers, searchText, filters])

  const paginate = <T,>(data: T[], page: number) => data.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const currentVouchers = paginate(filteredVouchers, voucherPage)

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
    setVoucherPage(1)
  }

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      status: "",
      timeRange: "",
      discountRange: "",
    })
    setSearchText("")
    setVoucherPage(1)
  }

  // Reset form
  const resetForm = () => {
    setNewVoucher({
      code: "",
      discount_value: 0,
      start_date: "",
      end_date: "",
      status: "active",
      usage_limit: 1,
    })
    setErrors({})
  }

  const handleAddVoucher = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const added = await addVoucher(newVoucher)
      setVouchers((prev) => [...prev, added])
      setOpenAddPopup(false)
      resetForm()

      setPopupContent({
        title: "Thành công",
        message: "Thêm voucher mới thành công!",
        type: "success",
      })
      setPopupOpen(true)
    } catch (error: any) {
      console.error("Thêm voucher thất bại:", error)

      let errorMessage = "Có lỗi xảy ra khi thêm voucher"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message  
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
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

  // Statistics based on filtered data
  const activeVouchers = filteredVouchers.filter((v) => v.status === "active")
  const inactiveVouchers = filteredVouchers.filter((v) => v.status === "inactive")
  const expiredVouchers = filteredVouchers.filter((v) => {
    const endDate = new Date(v.end_date)
    return endDate < new Date()
  })

  const statisticsData = [
    {
      label: "Tổng khuyến mãi",
      value: filteredVouchers.length,
      icon: <FaGift className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Đang hoạt động",
      value: activeVouchers.length,
      icon: <FaCheckCircle className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Không hoạt động",
      value: inactiveVouchers.length,
      icon: <FaTimesCircle className="w-6 h-6" />,
      color: "from-red-500 to-red-600",
    },
    {
      label: "Đã hết hạn",
      value: expiredVouchers.length,
      icon: <FaEyeSlash className="w-6 h-6" />,
      color: "from-gray-500 to-gray-600",
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
      <TitleDesc
        title="Quản lý khuyến mãi"
        description="Xem và quản lý tất cả khuyến mãi trong hệ thống."
        className="col-span-12"
      />

      {/* Filters */}
      <div className="col-span-12">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Trạng thái</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="">Tất cả</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Thời gian</label>
                <select
                  value={filters.timeRange}
                  onChange={(e) => handleFilterChange("timeRange", e.target.value)}
                  className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="">Tất cả</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Giá trị khuyến mãi</label>
                <select
                  value={filters.discountRange}
                  onChange={(e) => handleFilterChange("discountRange", e.target.value)}
                  className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="">Tất cả</option>
                  <option value="under100">Dưới 100k</option>
                  <option value="100to500">100k - 500k</option>
                  <option value="over500">Trên 500k</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setVoucherPage(1)}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FaFilter className="w-4 h-4" />
                  Lọc khuyến mãi
                </button>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleClearFilters}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FaTimes className="w-4 h-4" />
                  Xóa bộ lọc
                </button>
              </div>
            </div>

            {/* Filter Summary */}
            {(filters.status || filters.timeRange || filters.discountRange || searchText) && (
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
                      Trạng thái: {filters.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                    </span>
                  )}
                  {filters.timeRange && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Ngày bắt đầu:{" "}
                      {filters.timeRange === "today"
                        ? "Hôm nay"
                        : filters.timeRange === "week"
                          ? "Tuần này"
                          : "Tháng này"}
                    </span>
                  )}
                  {filters.discountRange && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Giá trị:{" "}
                      {filters.discountRange === "under100"
                        ? "Dưới 100k"
                        : filters.discountRange === "100to500"
                          ? "100k-500k"
                          : "Trên 500k"}
                    </span>
                  )}
                  <span className="text-sm text-orange-700">({filteredVouchers.length} kết quả)</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics - Desktop & Tablet Only */}
      <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statisticsData.map((item) => (
          <Card
            key={item.label}
            className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2 leading-tight">{item.label}</p>
                  <p className="text-3xl font-bold text-gray-900 leading-none">{item.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color} text-white ml-4`}>{item.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <div className="col-span-12">
        <Card>
          <CardHeader header="Danh sách khuyến mãi" className="flex justify-between items-center">
            <div className="flex gap-2">
              <SearchInput value={searchText} onChange={setSearchText} placeholder="Tìm kiếm theo mã, ID, giá trị..." />
            </div>
            <Button
              onClick={() => setOpenAddPopup(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Thêm voucher
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                  <tr>
                    <th className="px-4 py-2">Id</th>
                    <th className="px-4 py-2">Mã khuyến mãi</th>
                    <th className="px-4 py-2">Giá trị</th>
                    <th className="px-4 py-2">Ngày bắt đầu</th>
                    <th className="px-4 py-2">Ngày hết hạn</th>
                    <th className="px-4 py-2">Trạng thái</th>
                    <th className="px-4 py-2">Số lượng</th>
                    <th className="px-4 py-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVouchers.length > 0 ? (
                    currentVouchers.map((voucher, index) => (
                      <tr key={voucher.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                        <td className="px-4 py-2">{voucher.id}</td>
                        <td className="px-4 py-2 font-medium">{voucher.code}</td>
                        <td className="px-4 py-2 font-semibold text-green-600">
                          {voucher.discount_value.toLocaleString()} ₫
                        </td>
                        <td className="px-4 py-2">{new Date(voucher.start_date).toLocaleDateString("vi-VN")}</td>
                        <td className="px-4 py-2">{new Date(voucher.end_date).toLocaleDateString("vi-VN")}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${
                              voucher.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {voucher.status === "active" ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </td>
                        <td className="px-4 py-2">{voucher.usage_limit}</td>
                        <td className="px-4 py-2">
                          <button className="px-2 py-1 flex items-center gap-1 text-red-700 border border-red-700 rounded hover:bg-red-100 transition-colors">
                            {voucher.status === "active" ? <FaEyeSlash /> : <FaEye />}
                            <span className="text-xs font-semibold">
                              {voucher.status === "active" ? "Khóa" : "Mở khóa"}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        {searchText || filters.status || filters.timeRange || filters.discountRange
                          ? "Không tìm thấy khuyến mãi nào phù hợp với bộ lọc"
                          : "Chưa có khuyến mãi nào"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Pagination
                currentPage={voucherPage}
                totalItems={filteredVouchers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setVoucherPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Voucher Popup */}
      <Popup
        isOpen={openAddPopup}
        onClose={() => {
          setOpenAddPopup(false)
          resetForm()
        }}
        title="Thêm Voucher Mới"
        width="w-full md:w-[600px] lg:w-[700px]"
      >
        <form onSubmit={handleAddVoucher} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputField
                label="Mã khuyến mãi *"
                name="code"
                value={newVoucher.code}
                onChange={(e) => {
                  setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })
                  if (errors.code) setErrors({ ...errors, code: "" })
                }}
                placeholder="VD: SUMMER2024"
                required
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
            </div>

            <div>
              <InputField
                label="Giá trị khuyến mãi (VNĐ) *"
                name="discount_value"
                type="number"
                value={String(newVoucher.discount_value)}
                onChange={(e) => {
                  setNewVoucher({ ...newVoucher, discount_value: Number.parseFloat(e.target.value) || 0 })
                  if (errors.discount_value) setErrors({ ...errors, discount_value: "" })
                }}
                placeholder="50000"
                min="1"
                required
              />
              {errors.discount_value && <p className="text-red-500 text-xs mt-1">{errors.discount_value}</p>}
            </div>

            <div>
              <InputField
                label="Số lượng sử dụng *"
                name="usage_limit"
                type="number"
                value={String(newVoucher.usage_limit)}
                onChange={(e) => {
                  setNewVoucher({ ...newVoucher, usage_limit: Number.parseInt(e.target.value) || 1 })
                  if (errors.usage_limit) setErrors({ ...errors, usage_limit: "" })
                }}
                min="1"
                required
              />
              {errors.usage_limit && <p className="text-red-500 text-xs mt-1">{errors.usage_limit}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                value={newVoucher.status}
                onChange={(e) =>
                  setNewVoucher({
                    ...newVoucher,
                    status: e.target.value as "active" | "expired" | "disable",
                  })
                }
              >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>

            <div>
              <InputField
                label="Ngày bắt đầu *"
                name="start_date"
                type="date"
                value={newVoucher.start_date}
                onChange={(e) => {
                  setNewVoucher({ ...newVoucher, start_date: e.target.value })
                  if (errors.start_date) setErrors({ ...errors, start_date: "" })
                }}
                min={new Date().toISOString().split("T")[0]}
                required
              />
              {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
            </div>

            <div>
              <InputField
                label="Ngày kết thúc *"
                name="end_date"
                type="date"
                value={newVoucher.end_date}
                onChange={(e) => {
                  setNewVoucher({ ...newVoucher, end_date: e.target.value })
                  if (errors.end_date) setErrors({ ...errors, end_date: "" })
                }}
                min={newVoucher.start_date || new Date().toISOString().split("T")[0]}
                required
              />
              {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={() => {
                setOpenAddPopup(false)
                resetForm()
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang thêm..." : "Thêm voucher"}
            </Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}
