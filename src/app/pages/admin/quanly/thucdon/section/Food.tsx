import React, { useState } from "react";
import { FaPlus, FaPen, FaEyeSlash } from "react-icons/fa";
import { Card, CardHeader, CardContent } from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/button";
import {useFetch} from "../../../../../hooks/useFetch";
import usePagination from "@/src/app/hooks/usePagination";
import Pagination from "../../../../../components/ui/Panigation";
import Image from "next/image";
import SearchInput from "../../../../../components/ui/SearchInput";

export default function FoodComponent({
  foodRef,
}: {
  foodRef: React.RefObject<HTMLDivElement | null>;
}) {
    const [searchText, setSearchText] = useState("");
    const { foods } = useFetch();
    const {
        currentPage,
        setCurrentPage,
        currentData: currentFood,
        totalItems,
        itemsPerPage,
    } = usePagination(foods, 10);
    

    return (
    <div className="col-span-12" ref={foodRef}>
        <Card>
          <CardHeader header="Danh sách món ăn" className="flex justify-between items-center">
            <div className="flex gap-2 w-full max-w-md">
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
            <Button className="bg-[#9c6b66] text-white px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer">
              <FaPlus /> Thêm món ăn
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                  <tr>
                    <th className="px-4 py-2">STT</th>
                    <th className="px-4 py-2">Hình ảnh</th>
                    <th className="px-4 py-2">Tên</th>
                    <th className="px-4 py-2">Tên Nhật</th>
                    <th className="px-4 py-2">Loại danh mục</th>
                    <th className="px-4 py-2">Danh mục</th>
                    <th className="px-4 py-2">Giá</th>
                    <th className="px-4 py-2">Mùa</th>
                    <th className="px-4 py-2">Trạng thái</th>
                    <th className="px-4 py-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFood.map((food, index) => (
                    <tr
                      key={food.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                    >
                      <td className="px-4 py-2">{food.id}</td>
                      <td className="px-4 py-2">
                        {/* <img src={`${food.image}`} alt="" className="w-[50px] h-[50px]"/> */}
                        {food.image && (
                          <Image
                            src={`${food.image}`}
                            alt={food.name}
                            width={200}
                            height={200}
                            className="w-[50px] h-[50px] object-cover mx-auto rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2">{food.name}</td>
                      <td className="px-4 py-2">{food.jpName || "Không có tên nhật"}</td>
                      <td className="px-4 py-2">{food.group?.name ?? "Không có"}</td>
                      <td className="px-4 py-2">{food.category?.name ?? "Không có"}</td>
                      <td className="px-4 py-2">{Number(food.price).toLocaleString('vi-VN')} đ</td>
                      <td className="px-4 py-2">{food.season}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            food.status
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {food.status ? "Đang bán" : "Ngưng bán"}
                        </span>
                      </td>
                      <td className=" py-2 flex items-center gap-2">
                        <button className="px-1 text-blue-700 cursor-pointer border border-blue-700 rounded flex items-center gap-1 hover:bg-blue-100">
                          <FaPen />
                          <span className="text-blue-700 font-semibold">Sửa</span>
                        </button>
                        <button className="px-1 text-red-700 cursor-pointer border border-red-700 rounded flex items-center gap-1 hover:bg-red-100">
                          <FaEyeSlash />
                          <span className="text-red-700 font-semibold">Ẩn</span>
                          </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                />
            </div>
          </CardContent>
        </Card>
      </div>
    );
}