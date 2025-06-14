"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import TitleDesc from "../../../../components/ui/titleDesc";
import { Button } from "../../../../components/ui/button";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BiPrinter } from "react-icons/bi";
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import { Voucher } from "@/src/app/types";
import Pagination from "../../../../components/ui/Panigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function QuanLyNguoiDung() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherPage, setVoucherPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/voucher") // sửa lại URL nếu khác
      .then((res) => {
        console.log("Danh sách khuyến mãi:", res.data);
        setVouchers(res.data);
      })
      .catch((err) => console.error("Lỗi khi lấy vouchers:", err));
  }, []);

  // Phân trang dữ liệu
  const paginate = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  // Lấy dữ liệu người dùng hiện tại theo trang
  const currentVouchers = paginate(vouchers, voucherPage);

  //   const toggleUserStatus = async (user: Customer) => {
  //   const newStatus = user.status === 1 ? 0 : 1 ;

  return (
    <div className="grid grid-cols-12 gap-4 bg-[#fff8f0]">
      {/* Header */}
      <TitleDesc
        title="Quản lý khuyến mãi"
        description="Xem và quản lý tất cả khuyến mãi trong hệ thống."
        className="col-span-12"
      />

      <div className="col-span-12">
        <Card className="bg-[#fff7f2]">
          <div className="grid grid-cols-12 gap-4 items-end">
            {/* Trạng thái */}
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">
                Trạng thái
              </label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md ">
                <option>Tất cả</option>
                <option>Chờ xử lý</option>
                <option>Đã xử lý</option>
              </select>
            </div>

            {/* Thời gian */}
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">
                Thời gian
              </label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md ">
                <option>Tất cả</option>
                <option>Hôm nay</option>
                <option>Tuần này</option>
                <option>Tháng này</option>
              </select>
            </div>

            {/* Phương thức thanh toán */}
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">
                Giá trị khuyến mãi
              </label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md ">
                <option>Tất cả</option>
                <option>Dưới 100</option>
                <option>Trên 100</option>
              </select>
            </div>

            {/* Nút lọc đơn hàng */}
            <div className="col-span-12 md:col-span-3 flex justify-end">
              <button className="w-full bg-[#9c6b66] text-white px-6 py-2 rounded-xl">
                Lọc khuyến mãi
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="col-span-12 grid grid-cols-12 gap-4">
        {[
          { label: "Tổng số khuyên mãi", value: vouchers.length },
          {
            label: "Tổng số nhân khuyến mãi còn hạn",
            value: vouchers.filter((voucher) => voucher.status === "active")
              .length,
          },
        ].map((item, i) => (
          <Card className="col-span-6" key={i}>
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
                    <th className=" px-4 py-2">Mã khuyến mãi</th>
                    <th className=" px-4 py-2">Giá trị khuyến mãi</th>
                    <th className=" px-4 py-2">Ngày bắt đầu</th>
                    <th className=" px-4 py-2">Ngày hết hạn</th>
                    <th className=" px-4 py-2">Trạng thái</th>
                    <th className=" px-4 py-2">Số lượng sử dụng</th>
                    <th className=" px-4 py-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVouchers.map((voucher: Voucher, index) => (
                    <tr
                      key={voucher.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                    >
                      <td className=" px-4 py-2">{voucher.id}</td>
                      <td className=" px-4 py-2">{voucher.code}</td>
                      <td className=" px-4 py-2">{voucher.discount_value}</td>
                      <td className=" px-4 py-2">{voucher.start_date}</td>
                      <td className=" px-4 py-2">{voucher.end_date}</td>
                      <td
                        className={` px-4 py-2 
                            ${
                              voucher.status === "active"
                                ? "text-blue-700"
                                : voucher.status === "expired"
                                ? "text-red-700"
                                : "Không xác định"
                            }`}
                      >
                        {voucher.status === "active"
                          ? "Đang hoạt động"
                          : voucher.status === "expired"
                          ? "Đã hết hạn"
                          : "Không xác định"}
                      </td>
                      <td className=" px-4 py-2">{voucher.usage_limit}</td>
                      <td className="px-4 py-2">
                        <button
                          className="px-1 flex items-center gap-1 text-red-700 cursor-pointer border border-red-700 rounded hover:bg-red-100"
                          //   onClick={() => togglevoucherStatus(voucher)}
                        >
                          {voucher.status === "active" ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                          <span className="text-red-700 cursor-pointer font-semibold">
                            {voucher.status === "active" ? "Khóa" : "Mở khóa"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={voucherPage}
                totalItems={vouchers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setVoucherPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
