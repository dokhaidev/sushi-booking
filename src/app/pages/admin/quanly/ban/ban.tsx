"use client";
import React, { useState, useEffect } from "react";
import TitleDesc from "../../../../components/ui/titleDesc";
import { Card, CardHeader , CardContent } from "../../../../components/ui/Card";
import Pagination from "../../../../components/ui/Panigation";
import axios from "axios";

export default function QuanLyBan() {
  const [tables, setTables] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
  <div className="min-h-screen px-6 py-4">
    <TitleDesc
      title="Quản lý bàn"
      description="Xem và quản lý tất cả bàn trong hệ thống"
      className="mb-6"
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedData.map((table: any, idx: number) => (
        <Card key={idx}>
          <CardHeader header={`Bàn số ${table.table_number}`} />
          <CardContent>
            <div className="text-sm mb-2">
              <strong>Khách tối đa:</strong> {table.max_guests}
            </div>
            <div className="mb-2">
              <strong>Trạng thái:</strong>{" "}
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
            </div>

            {/* Hiển thị khung giờ mẫu (có thể sau này thay bằng API gọi giờ rảnh thực tế) */}
            <div className="mt-2">
              <strong>Khung giờ:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {["10:00", "12:15", "14:30", "16:45", "18:00", "20:15"].map(
                  (time, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-[#ffeeda] text-[#5c4033] rounded text-xs"
                    >
                      {time}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="mt-4">
              <button className="text-blue-600 hover:underline text-sm">
                Chi tiết
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="mt-6">
      <Pagination
        currentPage={currentPage}
        totalItems={tables.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  </div>
);

}
