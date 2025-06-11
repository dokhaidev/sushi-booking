"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import TitleDesc from "../../../../components/ui/titleDesc";
import { Button } from "../../../../components/ui/button";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BiPrinter } from "react-icons/bi";
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import { Customer } from "../../../../types/customer";
import Pagination from "../../../../components/ui/Panigation";
import { FaEye, FaLock } from "react-icons/fa";
import Popup from "../../../../components/ui/Popup";


export default function QuanLyNguoiDung() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "error",
  });
  const [userPage, setUserPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get("http://localhost:8000/api/admin/customers") // sửa lại URL nếu khác
      .then((res) => {
        console.log("Danh sách người dùng:", res.data);
        setUsers(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy users:", err));
  }, []);

    // Phân trang dữ liệu
  const paginate = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  // Lấy dữ liệu người dùng hiện tại theo trang
  const currentUsers = paginate(users, userPage);

  const toggleUserStatus = async (user: Customer) => {
  const newStatus = user.status === 1 ? 0 : 1 ;

  try {
    const res = await axios.put(`http://localhost:8000/api/customers/${user.id}/status`, {
      status: newStatus,
    });
    const updatedUser = res.data.customer;

    // Cập nhật lại danh sách user tại local state
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setPopupContent({
      title: newStatus === 1 ? "Mở khóa tài khoản thành công." : "Khóa tài khoản thành công.",
      message: res.data.message,
      type: "success",
    });
    setPopupOpen(true);
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      setPopupContent({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi cập nhật trạng thái người dùng.",
        type: "error",
    });
    setPopupOpen(true);
  };
  }


  return (
    <div className="grid grid-cols-12 gap-4 bg-[#fff8f0]">
      <Popup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={popupContent.title}
        type={popupContent.type}
      >
        <p>{popupContent.message}</p>
      </Popup>
        {/* Header */}
        <TitleDesc
            title="Quản lý người dùng"
            description="Xem và quản lý tất cả người dùng, nhân viên, quản lý"
            className="col-span-12"
        />

        <div className="col-span-12">
            <Card className="bg-[#fff7f2]">
                <div className="grid grid-cols-12 gap-4 items-end">
                {/* Trạng thái */}
                <div className="col-span-12 md:col-span-3">
                    <label className="text-sm text-gray-700 font-medium block mb-1">Trạng thái</label>
                    <select className="w-full bg-gray-200 px-4 py-2 rounded-md ">
                    <option>Tất cả</option>
                    <option>Chờ xử lý</option>
                    <option>Đã xử lý</option>
                    </select>
                </div>

                {/* Thời gian */}
                <div className="col-span-12 md:col-span-3">
                    <label className="text-sm text-gray-700 font-medium block mb-1">Thời gian</label>
                    <select className="w-full bg-gray-200 px-4 py-2 rounded-md ">
                        <option>Tất cả</option>
                        <option>Hôm nay</option>
                        <option>Tuần này</option>
                        <option>Tháng này</option>
                    </select>
                </div>

                {/* Phương thức thanh toán */}
                <div className="col-span-12 md:col-span-3">
                    <label className="text-sm text-gray-700 font-medium block mb-1">Phương thức thanh toán</label>
                    <select className="w-full bg-gray-200 px-4 py-2 rounded-md ">
                    <option>Tất cả</option>
                    <option>Tiền mặt</option>
                    <option>Chuyển khoản</option>
                    </select>
                </div>

                {/* Nút lọc đơn hàng */}
                <div className="col-span-12 md:col-span-3 flex justify-end">
                    <button className="w-full bg-[#9c6b66] text-white px-6 py-2 rounded-xl">
                    Lọc đơn hàng
                    </button>
                </div>
                </div>
            </Card>
        </div>
        
      {/* Stats */}
      <div className="col-span-12 grid grid-cols-12 gap-4">
        {[
          { label: "Tổng số khách hàng", value: users.length, },
          { label: "Tổng số nhân viên bếp", value: users.filter(user => user.role === 'kitchenmanager').length },
          { label: "Tổng số nhân viên bàn", value: users.filter(user => user.role === 'menumanager').length },
          { label: "Tổng số nhân viên thu ngân", value: users.filter(user => user.role === 'ordermanager').length },
        ].map((item, i) => (
          <Card className="col-span-3" key={i}>
            <CardContent>
              <p className="text-base text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold mt-2">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <div className="col-span-12">
        <Card>
          <CardHeader header="Đơn hàng gần đây">
            <div className="flex gap-2 float-right">
                <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm">
                <PiMicrosoftExcelLogoFill /> Xuất Excel
                </Button>
                <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm">
                <BiPrinter /> In
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#fff8f1] text-[#5c4033] font-medium text-sm">
                  <tr>
                    <th className=" px-4 py-2">Id</th>
                    <th className=" px-4 py-2">Tên người dùng</th>
                    <th className=" px-4 py-2">Email</th>
                    <th className=" px-4 py-2">Số điện thoại</th>
                    <th className=" px-4 py-2">Điểm</th>
                    <th className=" px-4 py-2">Hạng</th>
                    <th className=" px-4 py-2">Vai trò</th>
                    <th className=" px-4 py-2">Trạng thái</th>
                    <th className=" px-4 py-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user: Customer, index) => (
                    <tr
                      key={user.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                    >
                      <td className=" px-4 py-2">{user.id}</td>
                      <td className=" px-4 py-2">{user.name}</td>
                      <td className=" px-4 py-2">{user.email}</td>
                      <td className=" px-4 py-2">{user.phone}</td>
                      <td className=" px-4 py-2">{user.point}</td>
                      <td className={` px-4 py-2 
                        ${user.membership_level === "silver"
                          ? "text-gray-400"
                          : user.membership_level === "gold"
                          ? "text-yellow-600"
                          : user.membership_level === "platinum"
                          ? "text-gray-800"
                          : "Không xác định"}`}>
                        {user.membership_level === "silver"
                          ? "Bạc"
                          : user.membership_level === "gold"
                          ? "Vàng"
                          : user.membership_level === "platinum"
                          ? "Bạch kim"
                          : "Không xác định"}
                        </td>
                      <td className={`px-4 py-2 
                        ${user.role === 'admin'
                          ? 'text-red-600'
                          : user.role === 'user'
                          ? 'text-blue-600'
                          : user.role === 'kitchenmanager'
                          ? 'text-orange-600'
                          : user.role === 'ordermanager'
                          ? 'text-green-600'
                          : user.role === 'menumanager'
                          ? 'text-purple-600'
                          : 'Không xác định'}`}>
                        {user.role === 'admin'
                          ? 'Quản trị viên'
                          : user.role === 'user'
                          ? 'Người dùng'
                          : user.role === 'kitchenmanager'
                          ? 'QL bếp'
                          : user.role === 'ordermanager'
                          ? 'QL đơn hàng'
                          : user.role === 'menumanager'
                          ? 'QL thực đơn'
                          : 'Không xác định'}
                      </td>
                      <td className={`p-2 font-medium ${user.status === 0
                          ? 'text-red-700'
                          : 'text-green-700'}`}>
                        {user.status === 0
                          ? 'Đã khóa'
                          : 'Đang hoạt động'}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="px-1 flex items-center gap-1 text-red-700 cursor-pointer border border-red-700 rounded hover:bg-red-100"
                          onClick={() => toggleUserStatus(user)}
                        >
                          {user.status === 1 ? <FaLock /> : <FaEye />}
                          <span className="text-red-700 cursor-pointer font-semibold">
                            {user.status === 1 ? "Khóa" : "Mở khóa"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={userPage}
                totalItems={users.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setUserPage}
            />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
