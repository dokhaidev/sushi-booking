"use client"
import { FaPlus, FaPen, FaEyeSlash, FaEye, FaSort, FaSortUp, FaSortDown } from "react-icons/fa"
import { Card, CardHeader, CardContent } from "../../../../../components/ui/Card"
import { Button } from "../../../../../components/ui/button"
import { useFetch } from "../../../../../hooks/useFetch"
import usePagination from "@/src/app/hooks/usePagination"
import Pagination from "../../../../../components/ui/Panigation"
import Popup from "@/src/app/components/ui/Popup"
import PopupNotification from "@/src/app/components/ui/PopupNotification"
import SearchInput from "../../../../../components/ui/SearchInput"
import type React from "react"
import { useState, useMemo } from "react"
import InputField from "@/src/app/components/ui/InputField"
import { useSearchFilter } from "@/src/app/hooks/useSearchFilter"
import type { Category } from "@/src/app/types/category"
import axios from "axios"

type SortField = "id" | "status" | null
type SortDirection = "asc" | "desc" | null

export default function CategoryComponent({
  categoryRef,
}: {
  categoryRef: React.RefObject<HTMLDivElement | null>
}) {
  const [searchText, setSearchText] = useState("")
  const { categories, setCategories } = useFetch()
  const filteredCategories = useSearchFilter(categories, searchText, ["name"])

  // Sort states
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Apply sorting to filtered data
  const sortedAndFilteredCategories = useMemo(() => {
    if (!sortField || !sortDirection) return filteredCategories

    return [...filteredCategories].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "id":
          aValue = a.id
          bValue = b.id
          break
        case "status":
          aValue = a.status || 0
          bValue = b.status || 0
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
  }, [filteredCategories, sortField, sortDirection])

  const {
    currentPage,
    setCurrentPage,
    currentData: currentCategories,
    totalItems,
    itemsPerPage,
  } = usePagination(sortedAndFilteredCategories, 10)

  // Popup states
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
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

  // Handle add category popup
  const handleOpenPopup = () => setIsPopupOpen(true)

  const handleClosePopup = () => {
    setFormData({ name: "", description: "" })
    setIsPopupOpen(false)
  }

  // Handle edit category popup
  const handleOpenEditPopup = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setIsEditPopupOpen(true)
  }

  const handleCloseEditPopup = () => {
    setFormData({ name: "", description: "" })
    setEditingCategory(null)
    setIsEditPopupOpen(false)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add new category
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showNotification("Tên danh mục là bắt buộc", "error")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post("http://127.0.0.1:8000/api/insert-category", formData)

      // Add new category to the list
      setCategories((prev) => [...prev, response.data.data])

      showNotification("Thêm danh mục thành công!", "success")
      handleClosePopup()
    } catch (error: any) {
      console.error("Error adding category:", error)
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi thêm danh mục"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  // Update category
  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      showNotification("Tên danh mục là bắt buộc", "error")
      return
    }

    if (!editingCategory) return

    try {
      setLoading(true)
      const response = await axios.put(`http://127.0.0.1:8000/api/category-update/${editingCategory.id}`, formData)

      // Update category in the list
      setCategories((prev) => prev.map((cat) => (cat.id === editingCategory.id ? response.data.data : cat)))

      showNotification("Cập nhật danh mục thành công!", "success")
      handleCloseEditPopup()
    } catch (error: any) {
      console.error("Error updating category:", error)
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật danh mục"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  // Toggle category status (show/hide)
  const handleToggleStatus = async (category: Category) => {
    const newStatus = category.status === 1 ? 0 : 1

    try {
      setLoading(true)
      const response = await axios.put(`http://127.0.0.1:8000/api/category/update-status/${category.id}`, {
        status: newStatus,
      })

      // Update category status in the list
      setCategories((prev) => prev.map((cat) => (cat.id === category.id ? { ...cat, status: newStatus } : cat)))

      const statusText = newStatus === 1 ? "hiển thị" : "ẩn"
      showNotification(`Đã ${statusText} danh mục "${category.name}" thành công!`, "success")
    } catch (error: any) {
      console.error("Error toggling category status:", error)
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật trạng thái"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="col-span-12" ref={categoryRef}>
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
        <CardHeader header="Danh sách danh mục" className="flex justify-between items-center">
          <div className="flex gap-2 w-full max-w-md">
            <SearchInput value={searchText} onChange={setSearchText} />
          </div>
          <Button
            onClick={handleOpenPopup}
            className="bg-[#9c6b66] text-white px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer hover:bg-[#8a5a55] transition-colors"
            disabled={loading}
          >
            <FaPlus /> Thêm danh mục
          </Button>
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
                      <span>Id</span>
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th className="px-4 py-2">Tên danh mục</th>
                  <th className="px-4 py-2">Mô tả</th>
                  <th
                    className="px-4 py-2 cursor-pointer hover:bg-[#fff0e6] transition-colors select-none"
                    onClick={() => handleSort("status")}
                    title="Nhấn để sắp xếp theo trạng thái"
                  >
                    <div className="flex items-center gap-2">
                      <span>Trạng thái</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th className="px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.length > 0 ? (
                  currentCategories.map((cate, index) => (
                    <tr key={cate.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                      <td className="px-4 py-2 font-medium">{cate.id}</td>
                      <td className="px-4 py-2 font-medium">{cate.name}</td>
                      <td className="px-4 py-2 text-gray-600">{cate.description || "Không có mô tả"}</td>
                      <td className={`px-4 py-2 font-bold ${cate.status === 1 ? "text-green-600" : "text-red-600"}`}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${cate.status === 1 ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          {cate.status === 1 ? "Đang hiển thị" : "Đang ẩn"}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditPopup(cate)}
                            className="px-2 py-1 text-blue-700 cursor-pointer border border-blue-700 rounded flex items-center gap-1 hover:bg-blue-100 transition-colors"
                            disabled={loading}
                          >
                            <FaPen />
                            <span className="text-blue-700 font-semibold">Sửa</span>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(cate)}
                            className={`px-2 py-1 cursor-pointer border rounded flex items-center gap-1 transition-colors ${
                              cate.status === 1
                                ? "text-red-700 border-red-700 hover:bg-red-100"
                                : "text-green-700 border-green-700 hover:bg-green-100"
                            }`}
                            disabled={loading}
                          >
                            {cate.status === 1 ? <FaEyeSlash /> : <FaEye />}
                            <span className="font-semibold">{cate.status === 0 ? "Hiện" : "Ẩn"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      {searchText ? "Không tìm thấy danh mục nào phù hợp" : "Chưa có danh mục nào"}
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
                {sortField === "id" ? "ID" : "Trạng thái"} ({sortDirection === "asc" ? "Tăng dần" : "Giảm dần"})
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

      {/* Add Category Popup */}
      <Popup isOpen={isPopupOpen} onClose={handleClosePopup} title="Thêm danh mục mới">
        <div className="space-y-4">
          <InputField
            label="Tên danh mục *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập tên danh mục"
          />
          <InputField
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả danh mục (tùy chọn)"
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={handleClosePopup}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#9c6b66] text-white px-4 py-2 rounded hover:bg-[#8a5a55] transition-colors"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? "Đang thêm..." : "Thêm danh mục"}
            </Button>
          </div>
        </div>
      </Popup>

      {/* Edit Category Popup */}
      <Popup isOpen={isEditPopupOpen} onClose={handleCloseEditPopup} title="Chỉnh sửa danh mục">
        <div className="space-y-4">
          <InputField
            label="Tên danh mục *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập tên danh mục"
          />
          <InputField
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả danh mục (tùy chọn)"
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={handleCloseEditPopup}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  )
}
