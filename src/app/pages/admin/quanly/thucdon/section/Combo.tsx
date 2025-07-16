"use client"
import type React from "react"
import { useState, useMemo } from "react"
import {
  FaPlus,
  FaPen,
  FaEyeSlash,
  FaEye,
  FaTrash,
  FaImage,
  FaMinus,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa"
import { Card, CardHeader, CardContent } from "../../../../../components/ui/Card"
import { Button } from "../../../../../components/ui/button"
import { useFetch } from "../../../../../hooks/useFetch"
import usePagination from "@/src/app/hooks/usePagination"
import Pagination from "../../../../../components/ui/Panigation"
import Image from "next/image"
import SearchInput from "../../../../../components/ui/SearchInput"
import Popup from "../../../../../components/ui/Popup"
import PopupNotification from "../../../../../components/ui/PopupNotification"
import InputField from "../../../../../components/ui/InputField"
import type { ComboAdd, ComboItemAdd, Combo } from "@/src/app/types"
import { addCombo } from "@/src/app/hooks/useAdd"
import { useSearchFilter } from "@/src/app/hooks/useSearchFilter"
import axios from "axios"

type SortField = "id" | "price" | "status" | null
type SortDirection = "asc" | "desc" | null

export default function ComboComponent({ comboRef }: { comboRef: React.RefObject<HTMLDivElement | null> }) {
  const [searchText, setSearchText] = useState("")
  const { combos, setCombos, foods } = useFetch()
  const filteredCombos = useSearchFilter(combos, searchText, ["name"])

  // Sort states
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Apply sorting to filtered data
  const sortedAndFilteredCombos = useMemo(() => {
    if (!sortField || !sortDirection) return filteredCombos

    return [...filteredCombos].sort((a, b) => {
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
  }, [filteredCombos, sortField, sortDirection])

  const {
    currentPage,
    setCurrentPage,
    currentData: currentCombos,
    totalItems,
    itemsPerPage,
  } = usePagination(sortedAndFilteredCombos, 10)

  // Popup states
  const [showAddComboPopup, setShowAddComboPopup] = useState(false)
  const [showEditComboPopup, setShowEditComboPopup] = useState(false)
  const [openFoodPopup, setOpenFoodPopup] = useState(false)
  const [tempQuantities, setTempQuantities] = useState<Record<number, number>>({})
  const [selectedItems, setSelectedItems] = useState<ComboItemAdd[]>([])
  const [comboName, setComboName] = useState("")
  const [comboPrice, setComboPrice] = useState("")
  const [comboDesc, setComboDesc] = useState("")
  const [comboImage, setComboImage] = useState<File | null>(null)
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null)
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

  // Reset form
  const resetForm = () => {
    setComboName("")
    setComboPrice("")
    setComboDesc("")
    setComboImage(null)
    setSelectedItems([])
    setEditingCombo(null)
  }

  // Handle edit combo
  const handleEditCombo = (combo: Combo) => {
    setEditingCombo(combo)
    setComboName(combo.name)
    setComboPrice(combo.price.toString())
    setComboDesc(combo.description || "")
    setShowEditComboPopup(true)
  }

  // Handle toggle status
  const handleToggleStatus = async (combo: Combo) => {
    const newStatus = !combo.status

    try {
      setLoading(true)
      await axios.put(`http://127.0.0.1:8000/api/combo/update-status/${combo.id}`, {
        status: newStatus,
      })

      setCombos((prev) => prev.map((c) => (c.id === combo.id ? { ...c, status: newStatus } : c)))

      const statusText = newStatus ? "hiển thị" : "ẩn"
      showNotification(`Đã ${statusText} combo "${combo.name}" thành công!`, "success")
    } catch (error: any) {
      console.error("Error toggling combo status:", error)
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật trạng thái"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  // Handle update combo
  const handleUpdateCombo = async () => {
    if (!editingCombo) return

    const formData = new FormData()
    formData.append("name", comboName)
    formData.append("price", comboPrice)
    formData.append("description", comboDesc)
    formData.append("status", "true")

    if (comboImage) {
      formData.append("image", comboImage)
    }

    selectedItems.forEach((item, index) => {
      formData.append(`items[${index}][food_id]`, item.food_id.toString())
      formData.append(`items[${index}][quantity]`, item.quantity.toString())
    })

    try {
      setLoading(true)
      const response = await axios.put(`http://127.0.0.1:8000/api/combo/update-combo/${editingCombo.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setCombos((prev) => prev.map((c) => (c.id === editingCombo.id ? response.data.combo : c)))

      showNotification("Cập nhật combo thành công!", "success")
      setShowEditComboPopup(false)
      resetForm()
    } catch (error: any) {
      console.error("Error updating combo:", error)
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật combo"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAddFoodToSelected = (foodId: number) => {
    const quantity = tempQuantities[foodId] || 1
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.food_id === foodId)
      if (existing) {
        return prev.map((i) => (i.food_id === foodId ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { food_id: foodId, quantity }]
    })
  }

  const handleSubmitCombo = async () => {
    const data: ComboAdd = {
      name: comboName,
      price: Number(comboPrice),
      description: comboDesc,
      status: true,
      image: comboImage || undefined,
      items: selectedItems,
    }
    try {
      setLoading(true)
      await addCombo(data)
      showNotification("Thêm combo thành công!", "success")
      setShowAddComboPopup(false)
      resetForm()
      window.location.reload()
    } catch (error) {
      showNotification("Lỗi khi thêm combo", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = (foodId: number) => {
    setSelectedItems((prev) => prev.filter((item) => item.food_id !== foodId))
  }

  const handleUpdateQuantity = (foodId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(foodId)
      return
    }
    setSelectedItems((prev) =>
      prev.map((item) => (item.food_id === foodId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  return (
    <div className="col-span-12" ref={comboRef}>
      <PopupNotification
        isOpen={notif.open}
        onClose={() => setNotif((prev) => ({ ...prev, open: false }))}
        title={notif.type === "success" ? "Thành công" : notif.type === "error" ? "Lỗi" : "Thông báo"}
        type={notif.type}
      >
        <p>{notif.message}</p>
      </PopupNotification>

      <Card>
        <CardHeader header="Danh sách combo món ăn" className="flex justify-between items-center">
          <div className="flex gap-2 w-full max-w-md">
            <SearchInput value={searchText} onChange={setSearchText} />
          </div>
          <Button
            className="bg-[#f3eae4] text-[#9c6b66] px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer hover:bg-[#e8d5c4] transition-colors"
            onClick={() => setShowAddComboPopup(true)}
            disabled={loading}
          >
            <FaPlus /> Thêm combo
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
                  <th className="px-4 py-2">Hình ảnh</th>
                  <th className="px-4 py-2">Tên combo</th>
                  <th className="px-4 py-2">Mô tả</th>
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
                {currentCombos.length > 0 ? (
                  currentCombos.map((combo, index) => (
                    <tr key={combo.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                      <td className="px-4 py-2 font-medium">{combo.id}</td>
                      <td className="px-4 py-2">
                        {combo.image && (
                          <Image
                            src={combo.image || "/placeholder.svg"}
                            alt={combo.name}
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px] object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 font-medium">{combo.name}</td>
                      <td className="px-4 py-2 text-gray-600">{combo.description || "Không có mô tả"}</td>
                      <td className="px-4 py-2 font-semibold text-green-600">
                        {Number(combo.price).toLocaleString("vi-VN")} đ
                      </td>
                      <td className={`px-4 py-2 font-bold ${combo.status ? "text-green-600" : "text-red-600"}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${combo.status ? "bg-green-500" : "bg-red-500"}`}></div>
                          {combo.status ? "Đang bán" : "Ngưng bán"}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCombo(combo)}
                            className="px-2 py-1 text-blue-700 border border-blue-700 rounded flex items-center gap-1 hover:bg-blue-100 transition-colors"
                            disabled={loading}
                          >
                            <FaPen />
                            <span className="text-blue-700 font-semibold">Sửa</span>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(combo)}
                            className={`px-2 py-1 border rounded flex items-center gap-1 transition-colors ${
                              combo.status
                                ? "text-red-700 border-red-700 hover:bg-red-100"
                                : "text-green-700 border-green-700 hover:bg-green-100"
                            }`}
                            disabled={loading}
                          >
                            {combo.status ? <FaEyeSlash /> : <FaEye />}
                            <span className="font-semibold">{combo.status ? "Ẩn" : "Hiện"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      {searchText ? "Không tìm thấy combo nào phù hợp" : "Chưa có combo nào"}
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

      {/* Popup Thêm Combo */}
      <Popup
        isOpen={showAddComboPopup}
        onClose={() => {
          setShowAddComboPopup(false)
          resetForm()
        }}
        title="Thêm combo mới"
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Tên combo"
                name="comboName"
                value={comboName}
                onChange={(e) => setComboName(e.target.value)}
                required
              />
              <InputField
                label="Giá combo"
                name="comboPrice"
                value={comboPrice}
                onChange={(e) => setComboPrice(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <InputField
                label="Mô tả"
                name="comboDesc"
                value={comboDesc}
                onChange={(e) => setComboDesc(e.target.value)}
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Hình ảnh combo</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <FaImage className="text-gray-400 text-2xl" />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="comboImageUpload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setComboImage(e.target.files[0])
                    }
                  }}
                />
                <label htmlFor="comboImageUpload">
                  <Button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer">
                    <FaImage /> Chọn hình ảnh
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-2">Định dạng: JPG, PNG. Kích thước tối đa: 5MB</p>
              </div>
            </div>
          </div>

          {/* Food Items Section */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Món ăn trong combo</h3>
              <Button
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={() => setOpenFoodPopup(true)}
              >
                <FaPlus /> {selectedItems.length > 0 ? "Chỉnh sửa món ăn" : "Thêm món ăn"}
              </Button>
            </div>
            {selectedItems.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 italic text-lg">Chưa có món ăn nào được chọn</p>
                <p className="text-sm text-gray-400 mt-2">Nhấn Thêm món ăn để bắt đầu tạo combo</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedItems.map((item, index) => {
                  const food = foods.find((f) => f.id === item.food_id)
                  return (
                    <div
                      key={item.food_id}
                      className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      {food?.image && (
                        <Image
                          src={food.image ? `http://127.0.0.1:8000/storage/${food.image}` : "/placeholder.svg"}
                          alt={food.name}
                          width={50}
                          height={50}
                          className="rounded-lg object-cover w-[50px] h-[50px]"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{food?.name}</p>
                        <p className="text-sm text-gray-600">
                          {Number(food?.price).toLocaleString("vi-VN")} đ × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {(item.quantity * Number(food?.price || 0)).toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    </div>
                  )
                })}

                {/* Total Summary */}
                <div className="border-t-2 border-green-200 pt-4 mt-4">
                  <div className="flex justify-between items-center bg-green-100 p-4 rounded-lg">
                    <span className="text-lg font-semibold text-gray-800">Tổng giá trị các món:</span>
                    <span className="text-xl font-bold text-green-600">
                      {selectedItems
                        .reduce((total, item) => {
                          const food = foods.find((f) => f.id === item.food_id)
                          return total + item.quantity * Number(food?.price || 0)
                        }, 0)
                        .toLocaleString("vi-VN")}{" "}
                      đ
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              className="bg-gray-500 text-white px-6 py-2"
              onClick={() => {
                setShowAddComboPopup(false)
                resetForm()
              }}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              className="bg-green-600 text-white px-6 py-2"
              onClick={handleSubmitCombo}
              disabled={!comboName || !comboPrice || selectedItems.length === 0 || loading}
            >
              {loading ? "Đang tạo..." : "Tạo Combo"}
            </Button>
          </div>
        </div>
      </Popup>

      {/* Popup Sửa Combo */}
      <Popup
        isOpen={showEditComboPopup}
        onClose={() => {
          setShowEditComboPopup(false)
          resetForm()
        }}
        title="Chỉnh sửa combo"
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Tên combo"
                name="comboName"
                value={comboName}
                onChange={(e) => setComboName(e.target.value)}
                required
              />
              <InputField
                label="Giá combo"
                name="comboPrice"
                value={comboPrice}
                onChange={(e) => setComboPrice(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <InputField
                label="Mô tả"
                name="comboDesc"
                value={comboDesc}
                onChange={(e) => setComboDesc(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              className="bg-gray-500 text-white px-6 py-2"
              onClick={() => {
                setShowEditComboPopup(false)
                resetForm()
              }}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              className="bg-blue-600 text-white px-6 py-2"
              onClick={handleUpdateCombo}
              disabled={!comboName || !comboPrice || loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </Popup>

      {/* Popup Chọn món ăn - Same as before but shortened for space */}
      <Popup
        isOpen={openFoodPopup}
        onClose={() => setOpenFoodPopup(false)}
        title="Chọn món ăn cho combo"
        width="w-full md:w-[1100px]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[75vh]">
          {/* Left Section - Food Grid */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-4 rounded-lg h-full">
              <h4 className="font-semibold text-lg mb-4 text-gray-800">Danh sách món ăn ({foods.length} món)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="group hover:bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer"
                    onClick={() => handleAddFoodToSelected(food.id)}
                  >
                    <div className="relative flex items-center gap-4">
                      <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={food.image ? `http://127.0.0.1:8000/storage/${food.image}` : "/placeholder.svg"}
                          alt={food.name}
                          width={80}
                          height={80}
                          className="w-[80px] h-[80px] object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h5 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-blue-600 transition-colors truncate">
                          {food.name}
                        </h5>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {food.description || "Món ăn ngon, được chế biến từ những nguyên liệu tươi ngon nhất"}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-lg font-bold text-green-600">
                            {Number(food.price).toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Selected Items */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 p-4 rounded-lg h-full">
              <h4 className="font-semibold text-lg mb-4 text-gray-800">Món đã chọn ({selectedItems.length})</h4>
              <div className="max-h-[500px] overflow-y-auto">
                {selectedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 italic">Chưa có món nào</p>
                    <p className="text-sm text-gray-400 mt-1">Chọn món từ danh sách bên trái</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedItems.map((item) => {
                      const food = foods.find((f) => f.id === item.food_id)
                      return (
                        <div key={item.food_id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            {food?.image && (
                              <Image
                                src={food.image ? `http://127.0.0.1:8000/storage/${food.image}` : "/placeholder.svg"}
                                alt={food.name}
                                width={40}
                                height={40}
                                className="rounded object-cover w-[40px] h-[40px]"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900">{food?.name}</p>
                              <p className="text-xs text-gray-500">{Number(food?.price).toLocaleString("vi-VN")} đ</p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.food_id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.food_id, item.quantity - 1)}
                                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-gray-600 transition-colors"
                              >
                                <FaMinus className="text-xs" />
                              </button>
                              <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.food_id, item.quantity + 1)}
                                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-gray-600 transition-colors"
                              >
                                <FaPlus className="text-xs" />
                              </button>
                            </div>
                            <span className="font-semibold text-sm text-green-600">
                              {(item.quantity * Number(food?.price || 0)).toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button className="bg-gray-500 text-white px-6 py-2" onClick={() => setOpenFoodPopup(false)}>
            Hủy
          </Button>
          <Button className="bg-blue-600 text-white px-6 py-2" onClick={() => setOpenFoodPopup(false)}>
            Xác nhận ({selectedItems.length} món)
          </Button>
        </div>
      </Popup>
    </div>
  )
}
