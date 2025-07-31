"use client"
import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { FaPlus, FaPenFancy, FaEyeSlash, FaEye, FaSort, FaSortUp, FaSortDown } from "react-icons/fa"
import { Card, CardHeader, CardContent } from "../../../../../components/ui/Card"
import { Button } from "../../../../../components/ui/button"
import { useFetch } from "../../../../../hooks/useFetch"
import usePagination from "@/src/app/hooks/usePagination"
import Pagination from "../../../../../components/ui/Panigation"
import Image from "next/image"
import SearchInput from "../../../../../components/ui/SearchInput"
import type { FoodAdd, Food } from "@/src/app/types"
import Popup from "@/src/app/components/ui/Popup"
import PopupNotification from "@/src/app/components/ui/PopupNotification"
import InputField from "@/src/app/components/ui/InputField"
import { addFood } from "@/src/app/hooks/useAdd"
import { useSearchFilter } from "@/src/app/hooks/useSearchFilter"
import axios from "axios"

type SortField = "id" | "price" | "status" | null
type SortDirection = "asc" | "desc" | null

export default function FoodComponent({
  foodRef,
}: {
  foodRef: React.RefObject<HTMLDivElement | null>
}) {
  const [searchText, setSearchText] = useState("")
  const { foods, setFoods, categories, foodGroups } = useFetch()
  const filteredFoods = useSearchFilter(foods, searchText, ["name", "jpName"])

  // Sort states
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Image states
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null)

  // Apply sorting to filtered data
  const sortedAndFilteredFoods = useMemo(() => {
    if (!sortField || !sortDirection) return filteredFoods
    return [...filteredFoods].sort((a, b) => {
      let aValue: number
      let bValue: number
      switch (sortField) {
        case "id":
          aValue = a.id
          bValue = b.id
          break
        case "price":
          aValue = Number(a.price)
          bValue = Number(b.price)
          break
        case "status":
          aValue = a.status ? 1 : 0
          bValue = b.status ? 1 : 0
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
  }, [filteredFoods, sortField, sortDirection])

  const {
    currentPage,
    setCurrentPage,
    currentData: currentFood,
    totalItems,
    itemsPerPage,
  } = usePagination(sortedAndFilteredFoods, 10)

  // Popup states
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)
  const [editingFood, setEditingFood] = useState<Food | null>(null)
  const [loading, setLoading] = useState(false)
  const [newFood, setNewFood] = useState<FoodAdd>({
    name: "",
    name_en: "",
    category_id: 0,
    group_id: undefined,
    jpName: "",
    description: "",
    description_en: "",
    price: 0,
    image: undefined,
  })
  const [filteredGroups, setFilteredGroups] = useState<typeof foodGroups>([])

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

  // Handle edit food
  const handleEditFood = (food: Food) => {
    setEditingFood(food)
    setNewFood({
      name: food.name,
      name_en: food.name_en || "", // Correctly initializes name_en
      category_id: food.category_id,
      group_id: food.group?.id,
      jpName: food.jpName || "",
      description: food.description || "",
      description_en: food.description_en || "", // Correctly initializes description_en
      price: food.price,
      image: undefined,
    })
    setEditPreviewUrl(null)
    // Đảm bảo filter groups được cập nhật
    const related = foodGroups.filter((group) => group.category?.id === food.category_id)
    setFilteredGroups(related)
    setIsEditPopupOpen(true)
  }

  // Handle toggle status
  const handleToggleStatus = async (food: Food) => {
    const newStatus = !food.status
    try {
      setLoading(true)
      await axios.put(`http://127.0.0.1:8000/api/food/update-status/${food.id}`, {
        status: newStatus,
      })
      setFoods((prev) => prev.map((f) => (f.id === food.id ? { ...f, status: newStatus } : f)))
      const statusText = newStatus ? "bán" : "ngưng bán"
      showNotification(`Đã ${statusText} món "${food.name}" thành công!`, "success")
    } catch (error: any) {
      console.error("Error toggling food status:", error)
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật trạng thái"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  // Handle update food - SỬA LẠI ĐỂ CẬP NHẬT ĐÚNG DỮ LIỆU
  const handleUpdateFood = async () => {
    if (!editingFood) return
    const formData = new FormData()
    formData.append("name", newFood.name)
    formData.append("category_id", newFood.category_id.toString())
    if (newFood.group_id) formData.append("group_id", newFood.group_id.toString())
    if (newFood.name_en) formData.append("name_en", newFood.name_en)
    if (newFood.jpName) formData.append("jpName", newFood.jpName)
    if (newFood.description) formData.append("description", newFood.description)
    if (newFood.description_en) formData.append("description_en", newFood.description_en)
    formData.append("price", newFood.price.toString())
    if (newFood.image) formData.append("image", newFood.image)

    try {
      setLoading(true)
      const response = await axios.post(`http://127.0.0.1:8000/api/food-update/${editingFood.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        // Laravel PUT/PATCH with FormData requires _method field
        params: { _method: "PUT" },
      })
      // Cập nhật dữ liệu với thông tin đầy đủ từ response
      const updatedFood = response.data.data
      setFoods((prev) =>
        prev.map((f) =>
          f.id === editingFood.id
            ? updatedFood // Sử dụng trực tiếp updatedFood vì backend đã trả về đầy đủ category và group
            : f,
        ),
      )
      showNotification("Cập nhật món ăn thành công!", "success")
      setIsEditPopupOpen(false)
      resetForm()
    } catch (error: any) {
      console.error("Error updating food:", error)
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật món ăn"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  // Image handling functions
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent, isEdit = false) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0], isEdit)
    }
  }

  const handleFileSelect = (file: File, isEdit = false) => {
    if (file.type.startsWith("image/")) {
      setNewFood({ ...newFood, image: file })
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        if (isEdit) {
          setEditPreviewUrl(e.target?.result as string)
        } else {
          setPreviewUrl(e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    } else {
      showNotification("Vui lòng chọn file ảnh (JPG, PNG, GIF)", "error")
    }
  }

  const removeImage = (isEdit = false) => {
    setNewFood({ ...newFood, image: undefined })
    if (isEdit) {
      setEditPreviewUrl(null)
    } else {
      setPreviewUrl(null)
    }
  }

  // Handle add food
  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await addFood(newFood)
      // Thêm món ăn mới vào danh sách thay vì reload
      setFoods((prev) => [...prev, response.data.data]) // Access response.data.data as per Laravel's store method
      showNotification("Thêm món ăn thành công!", "success")
      setIsPopupOpen(false)
      resetForm()
    } catch (err) {
      console.error("Thêm món ăn lỗi:", err)
      showNotification("Lỗi khi thêm món ăn", "error")
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setNewFood({
      name: "",
      category_id: 0,
      group_id: undefined,
      name_en: "",
      jpName: "",
      description: "",
      description_en: "",
      price: 0,
      image: undefined,
    })
    setEditingFood(null)
    setPreviewUrl(null)
    setEditPreviewUrl(null)
  }

  useEffect(() => {
    if (!newFood.category_id || !foodGroups) {
      setFilteredGroups([])
      return
    }
    const related = foodGroups.filter((group) => group.category?.id === newFood.category_id)
    setFilteredGroups(related)
    // Chỉ reset group_id khi không phải đang edit
    if (!editingFood) {
      setNewFood((prev) => ({ ...prev, group_id: undefined }))
    }
  }, [newFood.category_id, foodGroups, editingFood])

  return (
    <div className="col-span-12" ref={foodRef}>
      <PopupNotification
        isOpen={notif.open}
        onClose={() => setNotif((prev) => ({ ...prev, open: false }))}
        title={notif.type === "success" ? "Thành công" : notif.type === "error" ? "Lỗi" : "Thông báo"}
        type={notif.type}
      >
        <p>{notif.message}</p>
      </PopupNotification>

      <Card>
        <CardHeader header="Danh sách món ăn" className="flex justify-between items-center">
          <div className="flex gap-2 w-full max-w-md">
            <SearchInput value={searchText} onChange={setSearchText} />
          </div>
          <Button
            className="bg-[#9c6b66] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-base cursor-pointer hover:bg-[#8a5a55] transition-colors shadow-md"
            onClick={() => setIsPopupOpen(true)}
            disabled={loading}
          >
            <FaPlus className="w-4 h-4" />
            Thêm món ăn
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                <tr>
                  <th
                    className="px-3 py-2 cursor-pointer hover:bg-[#fff0e6] transition-colors select-none"
                    onClick={() => handleSort("id")}
                    title="Nhấn để sắp xếp theo ID"
                  >
                    <div className="flex items-center gap-2">
                      <span>STT</span>
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th className="px-3 py-2">Hình ảnh</th>
                  <th className="px-3 py-2">Tên</th>
                  <th className="px-3 py-2">Tên Nhật</th>
                  <th className="px-3 py-2">Tên Anh</th>
                  <th className="px-3 py-2">Loại danh mục</th>
                  <th className="px-3 py-2">Danh mục</th>
                  <th
                    className="px-3 py-2 cursor-pointer hover:bg-[#fff0e6] transition-colors select-none"
                    onClick={() => handleSort("price")}
                    title="Nhấn để sắp xếp theo giá"
                  >
                    <div className="flex items-center gap-2">
                      <span>Giá</span>
                      {getSortIcon("price")}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 cursor-pointer hover:bg-[#fff0e6] transition-colors select-none"
                    onClick={() => handleSort("status")}
                    title="Nhấn để sắp xếp theo trạng thái"
                  >
                    <div className="flex items-center gap-2">
                      <span>Trạng thái</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th className="px-3 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentFood.length > 0 ? (
                  currentFood.map((food, index) => (
                    <tr key={food.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                      <td className="px-3 py-2 font-medium">{food.id}</td>
                      <td className="px-3 py-2">
                        {food.image && (
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden shadow-sm">
                            <Image
                              src={
                                food.image.startsWith("http")
                                  ? food.image
                                  : `http://127.0.0.1:8000/storage/${food.image}`
                              }
                              alt={food.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 font-medium">{food.name}</td>
                      <td className="px-3 py-2 text-gray-600">{food.jpName || "Không có tên Nhật"}</td>
                      <td className="px-3 py-2 text-gray-600">{food.name_en || "Không có tên Anh"}</td>
                      <td className="px-3 py-2 text-gray-600">{food.group?.name ?? "Không có"}</td>
                      <td className="px-3 py-2 text-gray-600">{food.category?.name ?? "Không có"}</td>
                      <td className="px-3 py-2 font-semibold text-green-600">
                        {Number(food.price).toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${food.status ? "bg-green-500" : "bg-red-500"}`}></div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${food.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {food.status ? "Đang bán" : "Ngưng bán"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditFood(food)}
                            className="px-3 py-2 text-blue-700 border border-blue-700 rounded-lg flex items-center gap-1 hover:bg-blue-50 transition-colors"
                            disabled={loading}
                          >
                            <FaPenFancy className="w-3 h-3" />
                            {/* <span className="text-blue-700 font-medium">Sửa</span> */}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(food)}
                            className={`px-3 py-2 border rounded-lg flex items-center gap-1 transition-colors ${food.status ? "text-red-700 border-red-700 hover:bg-red-50" : "text-green-700 border-green-700 hover:bg-green-50"}`}
                            disabled={loading}
                          >
                            {food.status ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
                            {/* <span className="font-medium">{food.status ? "Ẩn" : "Hiện"}</span> */}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      {searchText ? "Không tìm thấy món ăn nào phù hợp" : "Chưa có món ăn nào"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Sort info */}
          {sortField && sortDirection && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <span>Đang sắp xếp theo:</span>
              <span className="font-medium">
                {sortField === "id" ? "ID" : sortField === "price" ? "Giá" : "Trạng thái"} (
                {sortDirection === "asc" ? "Tăng dần" : "Giảm dần"})
              </span>
              <button
                onClick={() => {
                  setSortField(null)
                  setSortDirection(null)
                }}
                className="text-blue-600 hover:text-blue-800 underline ml-2"
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

      {/* Form Thêm món ăn */}
      <Popup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false)
          resetForm()
        }}
        title="Thêm món ăn mới"
      >
        <form onSubmit={handleAddFood} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="Tên món (*)"
              name="name"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              required
            />
            <InputField
              label="Tên Anh"
              name="name_en"
              value={newFood.name_en || ""} // FIX: Changed from newFood.name to newFood.name_en
              onChange={(e) => setNewFood({ ...newFood, name_en: e.target.value })}
              // removed required as it's nullable in backend
            />
            <InputField
              label="Tên Nhật"
              name="jpName"
              value={newFood.jpName || ""}
              onChange={(e) => setNewFood({ ...newFood, jpName: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              value={newFood.description || ""}
              onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c6b66] focus:border-transparent"
              rows={2}
              placeholder="Nhập mô tả món ăn..."
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả tiếng Anh</label>
            <textarea
              value={newFood.description_en || ""}
              onChange={(e) => setNewFood({ ...newFood, description_en: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c6b66] focus:border-transparent"
              rows={2}
              placeholder="Nhập mô tả món ăn..."
            />
          </div>
          <InputField
            label="Giá (VNĐ) (*)"
            name="price"
            type="number"
            value={String(newFood.price)}
            onChange={(e) => setNewFood({ ...newFood, price: Number.parseFloat(e.target.value) || 0 })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục (*)</label>
              <select
                value={newFood.category_id}
                onChange={(e) => setNewFood({ ...newFood, category_id: Number(e.target.value) })}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c6b66] focus:border-transparent"
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại danh mục</label>
              <select
                value={newFood.group_id ?? ""}
                onChange={(e) => setNewFood({ ...newFood, group_id: Number(e.target.value) || undefined })}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c6b66] focus:border-transparent disabled:bg-gray-100"
                disabled={!filteredGroups.length}
              >
                <option value="">-- Chọn loại danh mục --</option>
                {filteredGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Hình ảnh sản phẩm</label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, false)}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], false)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 text-gray-400">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#9c6b66] hover:bg-[#8a5a55] transition-colors"
                  >
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Chọn ảnh
                  </button>
                </div>
                <p className="text-sm text-gray-500">Hoặc kéo thả ảnh vào đây</p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF tối đa 2MB</p>
              </div>
            </div>
            {/* Image Preview */}
            {previewUrl && (
              <div className="relative">
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(false)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Xóa ảnh"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <div className="mt-2 text-sm text-gray-600">Ảnh mới: {newFood.image?.name}</div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              onClick={() => {
                setIsPopupOpen(false)
                resetForm()
              }}
              type="button"
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              Huỷ
            </Button>
            <Button
              type="submit"
              className="bg-[#9c6b66] text-white px-6 py-2 rounded-lg hover:bg-[#7e544f] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Đang thêm..." : "Thêm món ăn"}
            </Button>
          </div>
        </form>
      </Popup>

      {/* Form Sửa món ăn */}
      <Popup
        isOpen={isEditPopupOpen}
        onClose={() => {
          setIsEditPopupOpen(false)
          resetForm()
        }}
        title="Chỉnh sửa món ăn"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="Tên món (*)"
              name="name"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              required
            />
            <InputField
              label="Tên Anh" // FIX: Changed label from "Tên món" to "Tên Anh"
              name="name_en"
              value={newFood.name_en || ""}
              onChange={(e) => setNewFood({ ...newFood, name_en: e.target.value })}
              // removed required as it's nullable in backend
            />
            <InputField
              label="Tên Nhật"
              name="jpName"
              value={newFood.jpName || ""}
              onChange={(e) => setNewFood({ ...newFood, jpName: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              value={newFood.description || ""}
              onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c6b66] focus:border-transparent" // FIX: Consistent ring color
              rows={2}
              placeholder="Nhập mô tả món ăn..."
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả tiếng Anh</label>
            <textarea
              value={newFood.description_en || ""}
              onChange={(e) => setNewFood({ ...newFood, description_en: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c6b66] focus:border-transparent" // FIX: Consistent ring color
              rows={2}
              placeholder="Nhập mô tả món ăn..."
            />
          </div>
          <InputField
            label="Giá (VNĐ) (*)"
            name="price"
            type="number"
            value={String(newFood.price)}
            onChange={(e) => setNewFood({ ...newFood, price: Number.parseFloat(e.target.value) || 0 })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục (*)</label>
              <select
                value={newFood.category_id}
                onChange={(e) => setNewFood({ ...newFood, category_id: Number(e.target.value) })}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c6b66] focus:border-transparent" // FIX: Consistent ring color
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại danh mục</label>
              <select
                value={newFood.group_id ?? ""}
                onChange={(e) => setNewFood({ ...newFood, group_id: Number(e.target.value) || undefined })}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c6b66] focus:border-transparent disabled:bg-gray-100" // FIX: Consistent ring color
                disabled={!filteredGroups.length}
              >
                <option value="">-- Chọn loại danh mục --</option>
                {filteredGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Image Upload Section for Edit */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Hình ảnh sản phẩm</label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, true)}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], true)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 text-gray-400">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#9c6b66] hover:bg-[#8a5a55] transition-colors" // FIX: Consistent button color
                  >
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Chọn ảnh mới
                  </button>
                </div>
                <p className="text-sm text-gray-500">Hoặc kéo thả ảnh vào đây</p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF tối đa 2MB</p>
              </div>
            </div>
            {/* Current Image or New Preview */}
            {(editPreviewUrl || editingFood?.image) && (
              <div className="relative">
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={
                      editPreviewUrl ||
                      (editingFood?.image?.startsWith("http")
                        ? editingFood.image
                        : `http://127.0.0.1:8000/storage/${editingFood.image}`) ||
                      "/placeholder.svg"
                    }
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(true)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Xóa ảnh"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <div className="mt-2 text-sm text-gray-600">
                  {editPreviewUrl ? `Ảnh mới: ${newFood.image?.name}` : "Ảnh hiện tại"}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              onClick={() => {
                setIsEditPopupOpen(false)
                resetForm()
              }}
              type="button"
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              Huỷ
            </Button>
            <Button
              onClick={handleUpdateFood}
              className="bg-[#9c6b66] text-white px-6 py-2 rounded-lg hover:bg-[#7e544f] transition-colors disabled:opacity-50" // FIX: Consistent button color
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  )
}
