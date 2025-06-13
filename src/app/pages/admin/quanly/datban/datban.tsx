"use client";
import React, { useState } from "react";
import TitleDesc from "../../../../components/ui/titleDesc";
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import Pagination from "../../../../components/ui/Panigation";
import SearchInput from "../../../../components/ui/SearchInput";

export default function QuanLyDonDatBan() {
    const orders = [
        {
        id: "OD001",
        customer: "Nguyễn Văn A",
        datetime: "2025-05-29 18:30",
        total: 1250000,
        status: "Chờ xử lý",
        },
        {
        id: "OD002",
        customer: "Trần Thị B",
        datetime: "2025-05-28 12:00",
        total: 890000,
        status: "Đã xử lý",
        },
        {
        id: "OD003",
        customer: "Lê Văn C",
        datetime: "2025-05-27 20:15",
        total: 450000,
        status: "Chờ xử lý",
        },
        {
        id: "OD004",
        customer: "Phạm Thị D",
        datetime: "2025-05-26 17:00",
        total: 1230000,
        status: "Đã xử lý",
        },
        {
        id: "OD005",
        customer: "Hoàng Văn E",
        datetime: "2025-05-25 19:45",
        total: 600000,
        status: "Chờ xử lý",
        },
        {
        id: "OD006",
        customer: "Đỗ Thị F",
        datetime: "2025-05-24 14:20",
        total: 750000,
        status: "Đã xử lý",
        },
    ];

    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const paginatedOrders = orders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="grid grid-cols-12 gap-4">
        {/* Header */}
        <TitleDesc
            title="Quản lý đơn đặt bàn"
            description="Xem và quản lý tất cả những đơn đặt bàn"
            className="col-span-12"
        />

        {/* Bộ lọc */}
        <div className="col-span-12">
            <Card className="bg-[#fff7f2]">
            <div className="grid grid-cols-12 gap-4 items-end">
                {/* Trạng thái */}
                <div className="col-span-12 md:col-span-3">
                <label className="text-sm text-gray-700 font-medium block mb-1">Trạng thái</label>
                <select className="w-full bg-gray-200 px-4 py-2 rounded-md appearance-none">
                    <option>Tất cả</option>
                    <option>Chờ xử lý</option>
                    <option>Đã xử lý</option>
                </select>
                </div>

                {/* Thời gian */}
                <div className="col-span-12 md:col-span-3">
                <label className="text-sm text-gray-700 font-medium block mb-1">Thời gian</label>
                <select className="w-full bg-gray-200 px-4 py-2 rounded-md appearance-none">
                    <option>Hôm nay</option>
                    <option>Tuần này</option>
                    <option>Tháng này</option>
                </select>
                </div>

                {/* Phương thức thanh toán */}
                <div className="col-span-12 md:col-span-3">
                <label className="text-sm text-gray-700 font-medium block mb-1">Phương thức thanh toán</label>
                <select className="w-full bg-gray-200 px-4 py-2 rounded-md appearance-none">
                    <option>Tất cả</option>
                    <option>Tiền mặt</option>
                    <option>Chuyển khoản</option>
                </select>
                </div>

                {/* Nút lọc */}
                <div className="col-span-12 md:col-span-3 flex justify-end">
                <button className="w-full bg-[#9c6b66] text-white px-6 py-2 rounded-xl">
                    Lọc đơn hàng
                </button>
                </div>
            </div>
            </Card>
        </div>

        {/* Thống kê nhanh */}
        <div className="col-span-12 grid grid-cols-12 gap-4">
            {[
            { label: "Tổng đơn hôm nay", value: "12" },
            { label: "Tổng đơn chờ xử lý", value: "5" },
            { label: "Đơn đã xử lý", value: "7" },
            { label: "Tổng doanh thu", value: "15.300.000 ₫" },
            ].map((item, i) => (
            <Card className="col-span-3" key={i}>
                <CardContent>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold mt-2">{item.value}</p>
                </CardContent>
            </Card>
            ))}
        </div>

        {/* Bảng đơn đặt bàn */}
        <div className="col-span-12">
            <Card>
            <CardHeader header="Đơn đặt bàn gần đây" className="flex justify-between items-center">
                <div className="flex gap-2 w-full max-w-md">
                    <SearchInput value={searchText} onChange={setSearchText} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                    <tr>
                        <th className="px-4 py-2">MÃ ĐƠN</th>
                        <th className="px-4 py-2">KHÁCH HÀNG</th>
                        <th className="px-4 py-2">NGÀY & GIỜ</th>
                        <th className="px-4 py-2">TỔNG TIỀN</th>
                        <th className="px-4 py-2">TRẠNG THÁI</th>
                        <th className="px-4 py-2">THAO TÁC</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedOrders.map((order, idx) => (
                        <tr key={order.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                        <td className="px-4 py-2">{order.id}</td>
                        <td className="px-4 py-2">{order.customer}</td>
                        <td className="px-4 py-2">{order.datetime}</td>
                        <td className="px-4 py-2">{order.total.toLocaleString()} ₫</td>
                        <td className="px-4 py-2">
                            <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                                order.status === "Chờ xử lý"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                            >
                            {order.status}
                            </span>
                        </td>
                        <td className="px-4 py-2">
                            <button className="text-blue-600 hover:underline">Chi tiết</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Phân trang */}
                <Pagination
                    currentPage={currentPage}
                    totalItems={orders.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
