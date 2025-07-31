"use client"

import { useState, useMemo } from "react"
import axios from "axios"
import TitleDesc from "../../../../components/ui/titleDesc"
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card"
import type { Customer } from "../../../../types/customer"
import Pagination from "../../../../components/ui/Panigation"
import { FaEye, FaLock, FaPenFancy, FaUser, FaUsers, FaCashRegister, FaFilter, FaTimes } from "react-icons/fa"
import { PiChefHat } from "react-icons/pi"
import PopupNotification from "../../../../components/ui/PopupNotification"
import SearchInput from "@/src/app/components/ui/SearchInput"
import Popup from "../../../../components/ui/Popup"
import InputField from "../../../../components/ui/InputField"
import { Button } from "../../../../components/ui/button"
import Cookies from "js-cookie"
import { useSearchFilter } from "@/src/app/hooks/useSearchFilter"
import { useFetch } from "@/src/app/hooks/useFetch"

export default function QuanLyNguoiDung() {
  const [searchText, setSearchText] = useState("")
  const [popupOpen, setPopupOpen] = useState(false)
  const [editPopupOpen, setEditPopupOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null)
  const [selectedRole, setSelectedRole] = useState("")
  const [popupContent, setPopupContent] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "error",
  })
  const [userPage, setUserPage] = useState(1)

  // Filter states
  const [filters, setFilters] = useState({
    membershipLevel: "",
    role: "",
    status: "",
  })

  const itemsPerPage = 10
  const { customers, setCustomers } = useFetch()
  const searchFiltered = useSearchFilter(customers, searchText, ["name", "email", "phone"])

  // Advanced filtering function - moved outside component to avoid recreating
  const applyFilters = (data: Customer[], filters: { membershipLevel: string; role: string; status: string }) => {
    return data.filter((customer) => {
      // Membership level filter
      if (filters.membershipLevel && filters.membershipLevel !== "all") {
        const membershipMap: { [key: string]: string } = {
          silver: "silver",
          gold: "gold",
          platinum: "platinum",
        }
        if (customer.membership_level !== membershipMap[filters.membershipLevel]) {
          return false
        }
      }

      // Role filter
      if (filters.role && filters.role !== "all") {
        if (customer.role !== filters.role) {
          return false
        }
      }

      // Status filter
      if (filters.status && filters.status !== "all") {
        const statusMap: { [key: string]: number } = {
          active: 1,
          inactive: 0,
          locked: 0,
        }
        if (customer.status !== statusMap[filters.status]) {
          return false
        }
      }

      return true
    })
  }

  // Combined filtering: search + filters - optimized dependencies
  const filteredAndSearchedUsers = useMemo(() => {
    return applyFilters(searchFiltered, filters)
  }, [searchFiltered, filters])

  // Pagination
  const paginate = <T,>(data: T[], page: number) => data.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const currentUsers = paginate(filteredAndSearchedUsers, userPage)

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
    setUserPage(1) // Reset to first page when filters change
  }

  // Apply filters button handler
  const handleApplyFilters = () => {
    setUserPage(1) // Reset pagination
    // The filtering is already applied through useMemo, so we just need to reset page
  }

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      membershipLevel: "",
      role: "",
      status: "",
    })
    setSearchText("")
    setUserPage(1)
  }

  const toggleUserStatus = async (user: Customer) => {
    const newStatus = user.status === 1 ? 0 : 1

    const token = Cookies.get("access_token")

    if (!token) {
      throw new Error("Không tìm thấy access_token")
    }

    try {
      const res = await axios.put(`http://localhost:8000/api/customers/${user.id}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const updatedUser = res.data.customer

      setCustomers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))

      setPopupContent({
        title: newStatus === 1 ? "Mở khóa tài khoản thành công." : "Khóa tài khoản thành công.",
        message: res.data.message,
        type: "success",
      })
      setPopupOpen(true)
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err)
      setPopupContent({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi cập nhật trạng thái người dùng.",
        type: "error",
      })
      setPopupOpen(true)
    }
  }

  const openEditRolePopup = (user: Customer) => {
    setSelectedUser(user)
    setSelectedRole(user.role)
    setEditPopupOpen(true)
  }

  const handleUpdateRole = async () => {
    if (!selectedUser) return

    try {
      const token = Cookies.get("access_token")
      if (!token) {
        throw new Error("Không tìm thấy access_token")
      }

      const res = await axios.put(
        `http://localhost:8000/api/customers/${selectedUser.id}/role`,
        { role: selectedRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const updated = res.data.customer
      setCustomers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))

      setPopupContent({
        title: "Cập nhật vai trò thành công",
        message: "Vai trò người dùng đã được cập nhật.",
        type: "success",
      })
      setPopupOpen(true)
      setEditPopupOpen(false)
    } catch (err) {
      console.error("Lỗi cập nhật vai trò:", err)
      setPopupContent({
        title: "Lỗi",
        message: "Không thể cập nhật vai trò người dùng.",
        type: "error",
      })
      setPopupOpen(true)
    }
  }

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
        title="Quản lý người dùng"
        description="Xem và quản lý tất cả người dùng, nhân viên, quản lý"
        className="col-span-12"
      />

      <div className="col-span-12">
        {/* Filters */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Hạng</label>
                <select
                  value={filters.membershipLevel}
                  onChange={(e) => handleFilterChange("membershipLevel", e.target.value)}
                  className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="">Tất cả hạng</option>
                  <option value="silver">Bạc</option>
                  <option value="gold">Vàng</option>
                  <option value="platinum">Bạch kim</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Vai trò</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="">Tất cả vai trò</option>
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="manager">Quản lý</option>
                  <option value="chef">Nhân viên bếp</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Trạng thái</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Bị khóa</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleApplyFilters}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FaFilter className="w-4 h-4" />
                  Lọc dữ liệu
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
            {(filters.membershipLevel || filters.role || filters.status || searchText) && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-orange-800">Bộ lọc đang áp dụng:</span>
                  {searchText && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Tìm kiếm: &quot;{searchText}&quot;
                    </span>
                  )}
                  {filters.membershipLevel && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Hạng:{" "}
                      {filters.membershipLevel === "silver"
                        ? "Bạc"
                        : filters.membershipLevel === "gold"
                          ? "Vàng"
                          : "Bạch kim"}
                    </span>
                  )}
                  {filters.role && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Vai trò:{" "}
                      {filters.role === "user"
                        ? "Người dùng"
                        : filters.role === "admin"
                          ? "Quản trị viên"
                          : filters.role === "chef"
                            ? "NV bếp"
                            : filters.role === "menumanager"
                              ? "NV bàn"
                              : "NV thu ngân"}
                    </span>
                  )}
                  {filters.status && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      Trạng thái: {filters.status === "active" ? "Đang hoạt động" : "Bị khóa"}
                    </span>
                  )}
                  <span className="text-sm text-orange-700">({filteredAndSearchedUsers.length} kết quả)</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Tổng số khách hàng",
            value: customers.length,
            icon: <FaUser className="w-6 h-6" />,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "Nhân viên bếp",
            value: customers.filter((user) => user.role === "chef").length,
            icon: <PiChefHat className="w-6 h-6" />,
            color: "from-green-500 to-green-600",
          },
          {
            label: "Quản lý",
            value: customers.filter((user) => user.role === "manager").length,
            icon: <FaUsers className="w-6 h-6" />,
            color: "from-purple-500 to-purple-600",
          },
          {
            label: "Nhân viên",
            value: customers.filter((user) => user.role === "staff").length,
            icon: <FaCashRegister className="w-6 h-6" />,
            color: "from-orange-500 to-orange-600",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {item.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-gradient-to-r ${item.color} text-white`}
                >
                  {item.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <div className="col-span-12">
        <Card>
          <CardHeader header="Danh sách người dùng" className="flex justify-between items-center">
            <div className="flex gap-2">
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#fff8f1] text-[#5c4033] font-medium text-sm">
                  <tr>
                    <th className="px-4 py-2">Id</th>
                    <th className="px-4 py-2">Tên người dùng</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Số điện thoại</th>
                    <th className="px-4 py-2">Điểm</th>
                    <th className="px-4 py-2">Hạng</th>
                    <th className="px-4 py-2">Vai trò</th>
                    <th className="px-4 py-2">Trạng thái</th>
                    <th className="px-4 py-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user: Customer, index) => (
                      <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                        <td className="px-4 py-2">{user.id}</td>
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.phone}</td>
                        <td className="px-4 py-2">{user.point}</td>
                        <td
                          className={`px-4 py-2 
                          ${
                            user.membership_level === "silver"
                              ? "text-gray-400"
                              : user.membership_level === "gold"
                                ? "text-yellow-600"
                                : user.membership_level === "platinum"
                                  ? "text-gray-800"
                                  : "text-gray-500"
                          }`}
                        >
                          {user.membership_level === "silver"
                            ? "Bạc"
                            : user.membership_level === "gold"
                              ? "Vàng"
                              : user.membership_level === "platinum"
                                ? "Bạch kim"
                                : "Chưa có hạng"}
                        </td>
                        <td
                          className={`px-4 py-2 
                          ${
                            user.role === "admin"
                              ? "text-red-600"
                              : user.role === "user"
                                ? "text-blue-600"
                                : user.role === "manager"
                                  ? "text-orange-600"
                                  : user.role === "chef"
                                    ? "text-green-600"
                                    : user.role === "staff"
                                      ? "text-purple-600"
                                      : "text-gray-500"
                          }`}
                        >
                          {user.role === "admin"
                            ? "Quản trị viên"
                            : user.role === "user"
                              ? "Người dùng"
                              : user.role === "manager"
                                ? "Quản lý"
                                : user.role === "chef"
                                  ? "Nhân viên bếp"
                                  : user.role === "staff"
                                    ? "NV thực đơn"
                                    : "Không xác định"}
                        </td>
                        <td className={`p-2 font-medium ${user.status === 0 ? "text-red-700" : "text-green-700"}`}>
                          {user.status === 0 ? "Đã khóa" : "Đang hoạt động"}
                        </td>
                        <td className="px-4 py-2 flex gap-1">
                          <button
                            className="p-2 flex items-center gap-1 text-red-700 cursor-pointer border border-red-700 rounded hover:bg-red-100"
                            onClick={() => toggleUserStatus(user)}
                          >
                            {user.status === 1 ? <FaLock /> : <FaEye />}
                          </button>
                          <button
                            className="p-2 flex items-center gap-1 text-sm text-blue-700 border border-blue-700 rounded hover:bg-blue-100 font-semibold"
                            onClick={() => openEditRolePopup(user)}
                          >
                            <FaPenFancy />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        Không tìm thấy người dùng nào phù hợp với bộ lọc
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination
                currentPage={userPage}
                totalItems={filteredAndSearchedUsers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setUserPage}
              />
            </div>
          </CardContent>
        </Card>

        <Popup isOpen={editPopupOpen} onClose={() => setEditPopupOpen(false)} title="Chỉnh sửa vai trò người dùng">
          <div className="space-y-4">
            {selectedUser && (
              <>
                <InputField
                  label="Tên"
                  name="name"
                  value={selectedUser.name}
                  disabled
                />
                <InputField
                  label="Email"
                  name="email"
                  value={selectedUser.email}
                  disabled
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="manager">Quản lý</option>
                    <option value="chef">Nhân viên bếp</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    onClick={() => setEditPopupOpen(false)}
                  >
                    Huỷ
                  </Button>
                  <Button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleUpdateRole}>
                    Lưu thay đổi
                  </Button>
                </div>
              </>
            )}
          </div>
        </Popup>
      </div>
    </div>
  )
}
