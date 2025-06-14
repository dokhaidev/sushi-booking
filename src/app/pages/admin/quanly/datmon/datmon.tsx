"use client";
import React, { useState } from "react";
import TitleDesc from "../../../../components/ui/titleDesc";
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import SearchInput from "../../../../components/ui/SearchInput";
import Pagination from "../../../../components/ui/Panigation";

export default function QuanLyDatMon() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const data = new Array(128).fill(null).map((_, i) => ({
    maDon: `DM-${2000 + i}`,
    khachHang: `Khách ${i + 1}`,
    ngayGio: "2025-05-29 13:00",
    monAn: `Món ${1 + (i % 15)}`,
    soLuong: 1 + (i % 5),
    trangThai: i % 4 === 0 ? "Đã huỷ" : i % 3 === 0 ? "Đang xử lý" : "Hoàn thành",
  }));

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="grid grid-cols-12 gap-4 bg-[#fff8f0] min-h-screen p-4">
      {/* Title */}
      <TitleDesc
        title="Quản lý đặt món"
        description="Xem và xử lý tất cả các đơn đặt món"
        className="col-span-12"
      />

    {/* Filter */}
    <div className="col-span-12">
        <Card>
            <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 md:col-span-3">
                    <label className="text-sm text-gray-700 font-medium block mb-1">Trạng thái</label>
                    <select className="w-full bg-gray-200 px-4 py-2 rounded-md">
                        <option>Tất cả</option>
                        <option>Đang xử lý</option>
                        <option>Hoàn thành</option>
                        <option>Đã huỷ</option>
                    </select>
                </div>
                <div className="col-span-12 md:col-span-3">
                    <label className="text-sm text-gray-700 font-medium block mb-1">Thời gian</label>
                    <select className="w-full bg-gray-200 px-4 py-2 rounded-md">
                        <option>Tất cả</option>
                        <option>Hôm nay</option>
                        <option>Tuần này</option>
                        <option>Tháng này</option>
                    </select>
                </div>
                <div className="col-span-12 md:col-span-3">
                    <label className="text-sm text-gray-700 font-medium block mb-1">Món ăn</label>
                    <select className="w-full bg-gray-200 px-4 py-2 rounded-md">
                        <option>Tất cả</option>
                        <option>Món 1</option>
                        <option>Món 2</option>
                        <option>Món 3</option>
                        <option>Món 4</option>
                    </select>
                </div>
                <div className="col-span-12 md:col-span-3 flex justify-end">
                    <Button className="w-full bg-[#9c6b66] text-white px-6 py-2 rounded-xl">
                        Lọc
                    </Button>
                </div>
            </div>
        </Card>
    </div>
    

      {/* Stats */}
      <div className="col-span-12 grid grid-cols-12 gap-4">
        {[
          { label: "Tổng đơn món", value: 128, color: "blue-500" },
          { label: "Đang xử lý", value: 20, color: "yellow-500" },
          { label: "Hoàn thành", value: 100, color: "green-500" },
          { label: "Đã huỷ", value: 8, color: "red-500" },
        ].map((item, idx) => (
          <Card className="col-span-12 sm:col-span-6 md:col-span-3" key={idx}>
            <CardContent className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full bg-${item.color}/10 text-${item.color} flex items-center justify-center text-lg font-bold`}
              >
                {item.value}
              </div>
              <p className="text-sm mt-2">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Danh sách đặt món */}
    <div className="col-span-12">
        <Card>
            <CardHeader header="Danh sách đặt món" className="flex justify-between items-center">
              <div className="flex gap-2 w-full max-w-md">
                <SearchInput value={searchText} onChange={setSearchText} />
              </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#fff8f1] text-[#5c4033] font-medium text-sm">
                    <tr>
                        <th className="px-4 py-2">MÃ ĐƠN</th>
                        <th className="px-4 py-2">KHÁCH HÀNG</th>
                        <th className="px-4 py-2">NGÀY & GIỜ</th>
                        <th className="px-4 py-2">MÓN ĂN</th>
                        <th className="px-4 py-2">SỐ LƯỢNG</th>
                        <th className="px-4 py-2">TRẠNG THÁI</th>
                        <th className="px-4 py-2">THAO TÁC</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.map((item, index) => (
                        <tr key={item.maDon} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                          <td className="px-4 py-2">{item.maDon}</td>
                          <td className="px-4 py-2">{item.khachHang}</td>
                          <td className="px-4 py-2">{item.ngayGio}</td>
                          <td className="px-4 py-2">{item.monAn}</td>
                          <td className="px-4 py-2">{item.soLuong}</td>
                          <td className="px-4 py-2">
                            <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                                item.trangThai === "Hoàn thành"
                                ? "bg-green-100 text-green-700"
                                : item.trangThai === "Đang xử lý"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                            >
                            {item.trangThai}
                            </span>
                        </td>
                        <td className="px-4 py-2">
                            <button className="text-blue-600 hover:underline text-sm">
                            Xem
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalItems={data.length}
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
