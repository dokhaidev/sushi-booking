"use client"
import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { FaPlus, FaPen, FaEyeSlash, FaEye, FaSort, FaSortUp, FaSortDown } from "react-icons/fa"
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

  // Apply sorting to filtered data
  const sortedAndFilteredFoods = useMemo(() => {
    if (!sortField || !sortDirection) return filteredFoods

    return [...filteredFoods].sort((a, b) => {
      let aValue: any
      let bValue: any

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
    category_id: 0,
    group_id: undefined,
    jpName: "",
    description: "",
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

  // Reset form
  const resetForm = () => {
    setNewFood({
      name: "",
      category_id: 0,
      group_id: undefined,
      jpName: "",
      description: "",
      price: 0,
      image: undefined,
    })
    setEditingFood(null)
  }

  // Handle edit food
  const handleEditFood = (food: Food) => {
    setEditingFood(food)
    setNewFood({
      name: food.name,
      category_id: food.category_id,
      group_id: food.group?.id,
      jpName: food.jpName || "",
      description: food.description || "",
      price: food.price,
      image: undefined,
    })
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

  // Handle update food
  const handleUpdateFood = async () => {
    if (!editingFood) return

    const formData = new FormData()
    formData.append("name", newFood.name)
    formData.append("category_id", newFood.category_id.toString())
    if (newFood.group_id) formData.append("group_id", newFood.group_id.toString())
    if (newFood.jpName) formData.append("jpName", newFood.jpName)
    if (newFood.description) formData.append("description", newFood.description)
    formData.append("price", newFood.price.toString())
    if (newFood.image) formData.append("image", newFood.image)

    try {
      setLoading(true)
      const response = await axios.put(`http://127.0.0.1:8000/api/food-update/${editingFood.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setFoods((prev) => prev.map((f) => (f.id === editingFood.id ? response.data.data : f)))

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

  useEffect(() => {
    if (!newFood.category_id || !foodGroups) {
      setFilteredGroups([])
      return
    }
    const related = foodGroups.filter((group) => group.category?.id === newFood.category_id)
    setFilteredGroups(related)
    setNewFood((prev) => ({ ...prev, group_id: undefined }))
  }, [newFood.category_id, foodGroups])

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
            className="bg-[#9c6b66] text-white px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer hover:bg-[#8a5a55] transition-colors"
            onClick={() => setIsPopupOpen(true)}
            disabled={loading}
          >
            <FaPlus /> Thêm món ăn
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
                      <span>STT</span>
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th className="px-4 py-2">Hình ảnh</th>
                  <th className="px-4 py-2">Tên</th>
                  <th className="px-4 py-2">Tên Nhật</th>
                  <th className="px-4 py-2">Loại danh mục</th>
                  <th className="px-4 py-2">Danh mục</th>
                  <th
                    className="px-4 py-2 cursor-pointer hover:bg-[#fff0e6] transition-colors select-none"
                    onClick={() => handleSort("price")}
                    title="Nhấn để sắp xếp theo giá"
                  >
                    <div className="flex items-center gap-2">
                      <span>Giá</span>
                      {getSortIcon("price")}
                    </div>
                  </th>
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
                {currentFood.length > 0 ? (
                  currentFood.map((food, index) => (
                    <tr key={food.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                      <td className="px-4 py-2 font-medium">{food.id}</td>
                      <td className="px-4 py-2">
                        {food.image && (
                          <Image
                            src={`http://127.0.0.1:8000/storage/${food.image}`}
                            alt={food.name}
                            width={200}
                            height={200}
                            className="w-[50px] h-[50px] object-cover mx-auto rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 font-medium">{food.name}</td>
                      <td className="px-4 py-2 text-gray-600">{food.jpName || "Không có tên nhật"}</td>
                      <td className="px-4 py-2 text-gray-600">{food.group?.name ?? "Không có"}</td>
                      <td className="px-4 py-2 text-gray-600">{food.category?.name ?? "Không có"}</td>
                      <td className="px-4 py-2 font-semibold text-green-600">
                        {Number(food.price).toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${food.status ? "bg-green-500" : "bg-red-500"}`}></div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              food.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {food.status ? "Đang bán" : "Ngưng bán"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditFood(food)}
                            className="px-2 py-1 text-blue-700 border border-blue-700 rounded flex items-center gap-1 hover:bg-blue-100 transition-colors"
                            disabled={loading}
                          >
                            <FaPen />
                            <span className="text-blue-700 font-semibold">Sửa</span>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(food)}
                            className={`px-2 py-1 border rounded flex items-center gap-1 transition-colors ${
                              food.status
                                ? "text-red-700 border-red-700 hover:bg-red-100"
                                : "text-green-700 border-green-700 hover:bg-green-100"
                            }`}
                            disabled={loading}
                          >
                            {food.status ? <FaEyeSlash /> : <FaEye />}
                            <span className="font-semibold">{food.status ? "Ẩn" : "Hiện"}</span>
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
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
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

      {/* Form Thêm món ăn */}
      <Popup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false)
          resetForm()
        }}
        title="Thêm món ăn"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              setLoading(true)
              await addFood(newFood)
              showNotification("Thêm món ăn thành công!", "success")
              setIsPopupOpen(false)
              resetForm()
              window.location.reload()
            } catch (err) {
              console.error("Thêm món ăn lỗi:", err)
              showNotification("Lỗi khi thêm món ăn", "error")
            } finally {
              setLoading(false)
            }
          }}
          className="grid grid-cols-2 gap-4"
        >
          <InputField
            label="Tên món"
            name="name"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
          />
          <InputField
            label="Tên Nhật"
            name="jpName"
            value={newFood.jpName || ""}
            onChange={(e) => setNewFood({ ...newFood, jpName: e.target.value })}
          />
          <InputField
            label="Mô tả"
            name="description"
            value={newFood.description || ""}
            onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
          />
          <InputField
            label="Giá"
            name="price"
            type="number"
            value={String(newFood.price)}
            onChange={(e) => setNewFood({ ...newFood, price: Number.parseFloat(e.target.value) })}
          />

          <select
            value={newFood.category_id}
            onChange={(e) => setNewFood({ ...newFood, category_id: Number(e.target.value) })}
            className="col-span-2 border px-3 py-2 rounded"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={newFood.group_id ?? ""}
            onChange={(e) => setNewFood({ ...newFood, group_id: Number(e.target.value) })}
            className="col-span-2 border px-3 py-2 rounded"
            disabled={!filteredGroups.length}
          >
            <option value="">-- Chọn loại danh mục --</option>
            {filteredGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setNewFood({ ...newFood, image: e.target.files?.[0] })}
            className="col-span-2"
          />

          <div className="col-span-2 flex justify-end gap-2">
            <Button
              onClick={() => {
                setIsPopupOpen(false)
                resetForm()
              }}
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Huỷ
            </Button>
            <Button
              type="submit"
              className="bg-[#9c6b66] text-white px-4 py-2 rounded hover:bg-[#7e544f]"
              disabled={loading}
            >
              {loading ? "Đang thêm..." : "Thêm"}
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
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Tên món"
            name="name"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
          />
          <InputField
            label="Tên Nhật"
            name="jpName"
            value={newFood.jpName || ""}
            onChange={(e) => setNewFood({ ...newFood, jpName: e.target.value })}
          />
          <InputField
            label="Mô tả"
            name="description"
            value={newFood.description || ""}
            onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
          />
          <InputField
            label="Giá"
            name="price"
            type="number"
            value={String(newFood.price)}
            onChange={(e) => setNewFood({ ...newFood, price: Number.parseFloat(e.target.value) })}
          />

          <select
            value={newFood.category_id}
            onChange={(e) => setNewFood({ ...newFood, category_id: Number(e.target.value) })}
            className="col-span-2 border px-3 py-2 rounded"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={newFood.group_id ?? ""}
            onChange={(e) => setNewFood({ ...newFood, group_id: Number(e.target.value) })}
            className="col-span-2 border px-3 py-2 rounded"
            disabled={!filteredGroups.length}
          >
            <option value="">-- Chọn loại danh mục --</option>
            {filteredGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setNewFood({ ...newFood, image: e.target.files?.[0] })}
            className="col-span-2"
          />

          <div className="col-span-2 flex justify-end gap-2">
            <Button
              onClick={() => {
                setIsEditPopupOpen(false)
                resetForm()
              }}
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Huỷ
            </Button>
            <Button
              onClick={handleUpdateFood}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
