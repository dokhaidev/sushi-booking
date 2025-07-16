"use client"
import { FaPlus, FaPen, FaEyeSlash, FaEye, FaSort, FaSortUp, FaSortDown } from "react-icons/fa"
import { Card, CardHeader, CardContent } from "../../../../../components/ui/Card"
import { Button } from "../../../../../components/ui/button"
import { useFetch } from "../../../../../hooks/useFetch"
import usePagination from "@/src/app/hooks/usePagination"
import Pagination from "../../../../../components/ui/Panigation"
import SearchInput from "../../../../../components/ui/SearchInput"
import type React from "react"
import { useState, useMemo } from "react"
import Popup from "../../../../../components/ui/Popup"
import PopupNotification from "../../../../../components/ui/PopupNotification"
import InputField from "../../../../../components/ui/InputField"
import { addFoodGroup } from "../../../../../hooks/useAdd"
import type { FoodGroupAdd } from "../../../../../types/foodgroup"
import type { Category } from "../../../../../types/category"
import { useSearchFilter } from "@/src/app/hooks/useSearchFilter"
import axios from "axios"

type SortField = "id" | "status" | null
type SortDirection = "asc" | "desc" | null

export default function GroupFoodComponent({
  groupRef,
}: {
  groupRef: React.RefObject<HTMLDivElement | null>
}) {
  const [searchText, setSearchText] = useState("")
  const { foodGroups, setFoodGroups, categories } = useFetch()
  const filteredFoodGroups = useSearchFilter(foodGroups, searchText, ["name"])

  // Sort states
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Apply sorting to filtered data
  const sortedAndFilteredFoodGroups = useMemo(() => {
    if (!sortField || !sortDirection) return filteredFoodGroups

    return [...filteredFoodGroups].sort((a, b) => {
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
  }, [filteredFoodGroups, sortField, sortDirection])

  const {
    currentPage,
    setCurrentPage,
    currentData: currentFoodGroups,
    totalItems,
    itemsPerPage,
  } = usePagination(sortedAndFilteredFoodGroups, 10)

  // Popup states
  const [isOpen, setIsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<FoodGroupAdd>({
    name: "",
    category_id: 0,
  })

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

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", category_id: 0 })
    setEditingGroup(null)
  }

  const handleOpenPopup = () => setIsOpen(true)

  const handleClosePopup = () => {
    setIsOpen(false)
    resetForm()
  }

  // Handle edit popup
  const handleOpenEditPopup = (group: any) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      category_id: group.category?.id || 0,
    })
    setIsEditOpen(true)
  }

  const handleCloseEditPopup = () => {
    setIsEditOpen(false)
    resetForm()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "category_id" ? Number.parseInt(value) : value,
    }))
  }

  // Add new food group
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showNotification("Tên loại danh mục là bắt buộc", "error")
      return
    }

    if (!formData.category_id) {
      showNotification("Vui lòng chọn danh mục", "error")
      return
    }

    try {
      setLoading(true)
      await addFoodGroup(formData)
      showNotification("Thêm loại danh mục thành công!", "success")
      handleClosePopup()
      window.location.reload()
    } catch (error: any) {
      console.error("Lỗi khi thêm loại danh mục:", error)
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi thêm loại danh mục"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  // Update food group
  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      showNotification("Tên loại danh mục là bắt buộc", "error")
      return
    }

    if (!formData.category_id) {
      showNotification("Vui lòng chọn danh mục", "error")
      return
    }

    if (!editingGroup) return

    try {
      setLoading(true)
      const response = await axios.put(
        `http://127.0.0.1:8000/api/foodgroup/update-foodgroup/${editingGroup.id}`,
        formData,
      )

      // Update food group in the list
      setFoodGroups((prev) => prev.map((group) => (group.id === editingGroup.id ? response.data : group)))

      showNotification("Cập nhật loại danh mục thành công!", "success")
      handleCloseEditPopup()
    } catch (error: any) {
      console.error("Error updating food group:", error)
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật loại danh mục"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  // Toggle food group status (show/hide)
  const handleToggleStatus = async (group: any) => {
    const newStatus = group.status === 1 ? 0 : 1

    try {
      setLoading(true)
      const response = await axios.put(`http://127.0.0.1:8000/api/foodgroup/update-status/${group.id}`, {
        status: newStatus,
      })

      // Update food group status in the list
      setFoodGroups((prev) => prev.map((g) => (g.id === group.id ? { ...g, status: newStatus } : g)))

      const statusText = newStatus === 1 ? "hiển thị" : "ẩn"
      showNotification(`Đã ${statusText} loại danh mục "${group.name}" thành công!`, "success")
    } catch (error: any) {
      console.error("Error toggling food group status:", error)
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật trạng thái"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="col-span-12" ref={groupRef}>
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
        <CardHeader header="Danh sách loại danh mục" className="flex justify-between items-center">
          <div className="flex gap-2 w-full max-w-md">
            <SearchInput value={searchText} onChange={setSearchText} />
          </div>
          <Button
            onClick={handleOpenPopup}
            className="bg-[#f3eae4] text-[#9c6b66] px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer hover:bg-[#e8d5c4] transition-colors"
            disabled={loading}
          >
            <FaPlus /> Thêm loại danh mục
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
                  <th className="px-4 py-2">Tên loại danh mục</th>
                  <th className="px-4 py-2">Danh mục</th>
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
                {currentFoodGroups.length > 0 ? (
                  currentFoodGroups.map((group, index) => (
                    <tr key={group.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                      <td className="px-4 py-2 font-medium">{group.id}</td>
                      <td className="px-4 py-2 font-medium">{group.name}</td>
                      <td className="px-4 py-2 text-gray-600">{group.category?.name || "Không có danh mục"}</td>
                      <td className={`px-4 py-2 font-bold ${group.status === 1 ? "text-green-600" : "text-red-600"}`}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${group.status === 1 ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          {group.status === 1 ? "Đang hiển thị" : "Đang ẩn"}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditPopup(group)}
                            className="px-2 py-1 text-blue-700 cursor-pointer border border-blue-700 rounded flex items-center gap-1 hover:bg-blue-100 transition-colors"
                            disabled={loading}
                          >
                            <FaPen />
                            <span className="text-blue-700 font-semibold">Sửa</span>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(group)}
                            className={`px-2 py-1 cursor-pointer border rounded flex items-center gap-1 transition-colors ${
                              group.status === 1
                                ? "text-red-700 border-red-700 hover:bg-red-100"
                                : "text-green-700 border-green-700 hover:bg-green-100"
                            }`}
                            disabled={loading}
                          >
                            {group.status === 1 ? <FaEyeSlash /> : <FaEye />}
                            <span className="font-semibold">{group.status === 0 ? "Hiện" : "Ẩn"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      {searchText ? "Không tìm thấy loại danh mục nào phù hợp" : "Chưa có loại danh mục nào"}
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

      {/* Add Food Group Popup */}
      <Popup isOpen={isOpen} onClose={handleClosePopup} title="Thêm loại danh mục">
        <div className="space-y-4">
          <InputField
            label="Tên loại danh mục *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên loại danh mục"
            required
          />
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục cha *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0} disabled>
                -- Chọn danh mục --
              </option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              onClick={handleClosePopup}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-[#9c6b66] text-white px-4 py-2 rounded hover:bg-[#8a5a55] transition-colors"
              onClick={handleSubmit}
              disabled={loading || !formData.name.trim() || !formData.category_id}
            >
              {loading ? "Đang thêm..." : "Thêm"}
            </Button>
          </div>
        </div>
      </Popup>

      {/* Edit Food Group Popup */}
      <Popup isOpen={isEditOpen} onClose={handleCloseEditPopup} title="Chỉnh sửa loại danh mục">
        <div className="space-y-4">
          <InputField
            label="Tên loại danh mục *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên loại danh mục"
            required
          />
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục cha *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0} disabled>
                -- Chọn danh mục --
              </option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              onClick={handleCloseEditPopup}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              onClick={handleUpdate}
              disabled={loading || !formData.name.trim() || !formData.category_id}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  )
}
