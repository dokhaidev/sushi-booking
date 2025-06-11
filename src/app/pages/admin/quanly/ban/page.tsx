"use client";
import React, { useState, useEffect } from "react";
import TitleDesc from "../../../../components/ui/titleDesc";
import { Card, CardHeader , CardContent } from "../../../../components/ui/Card";
import Pagination from "../../../../components/ui/Panigation";
import axios from "axios";

export default function QuanLyBan() {
  const [tables, setTables] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/tables");
        setTables(res.data);
        console.log("Danh sách bàn:", res.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bàn:", error);
      }
    };
    fetchTables();
  }, []);

  const paginatedData = tables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-600";
      case "occupied":
        return "bg-red-100 text-red-600";
      case "reserved":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-[#fff8f0] min-h-screen">
      <TitleDesc
        title="Quản lý bàn"
        description="Xem và quản lý tất cả bàn trong hệ thống"
        className="mb-6"
      />

      <div className="col-span-12">
            <Card>
            <CardHeader header="Đơn đặt bàn gần đây" />
            <CardContent>
                <div className="overflow-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                    <tr>
                        <th className="px-4 py-2">SỐ BÀN</th>
                        <th className="px-4 py-2">KHÁCH TỐI ĐA</th>
                        <th className="px-4 py-2">TRẠNG THÁI</th>
                        <th className="px-4 py-2">THAO TÁC</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.map((table: any, idx: number) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                          <td className="px-4 py-2">{table.table_number}</td>
                          <td className="px-4 py-2">{table.max_guests}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                table.status
                              )}`}
                            >
                              {table.status === "available"
                                ? "Còn trống"
                                : table.status === "occupied"
                                ? "Đang sử dụng"
                                : table.status === "reserved"
                                ? "Đã đặt"
                                : table.status}
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
                    totalItems={tables.length}
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
