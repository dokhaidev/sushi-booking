import { FaPlus, FaPen, FaEyeSlash } from "react-icons/fa";
import { Card, CardHeader, CardContent } from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/button";
import {useFetch} from "../../../../../hooks/useFetch";
import usePagination from "@/src/app/hooks/usePagination";
import Pagination from "../../../../../components/ui/Panigation";
import Image from "next/image";
import SearchInput from "../../../../../components/ui/SearchInput";
import React, { useState } from "react";

export default function ComboComponent({
  comboRef,
}: {
  comboRef: React.RefObject<HTMLDivElement | null>;
}) {
    const [searchText, setSearchText] = useState("");
    const { combos } = useFetch();
    const {
        currentPage,
        setCurrentPage,
        currentData: currentCombos,
        totalItems,
        itemsPerPage,
    } = usePagination(combos, 10);
    

    return (
    <div className="col-span-12" ref={comboRef}>
        <Card>
          <CardHeader header="Danh sách combo món ăn" className="flex justify-between items-center">
            <div className="flex gap-2 w-full max-w-md">
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
            <Button className="bg-[#f3eae4] text-[#9c6b66] px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer">
              <FaPlus /> Thêm combo
            </Button>
          </CardHeader>
          <CardContent>
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                <tr>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">Hình ảnh</th>
                  <th className="px-4 py-2">Tên combo</th>
                  <th className="px-4 py-2">Mô tả</th>
                  <th className="px-4 py-2">Giá</th>
                  <th className="px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentCombos.map((combo, index) => (
                  <tr
                    key={combo.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                  >
                    <td className="px-4 py-2">{combo.id}</td>
                    <td className="px-4 py-2">
                        {/* <img src={`${food.image}`} alt="" className="w-[50px] h-[50px]"/> */}
                        {combo.image && (
                          <Image
                            src={`${combo.image}`}
                            alt={combo.name}
                            width={200}
                            height={200}
                            className="w-[50px] h-[50px] object-cover mx-auto rounded"
                          />
                        )}
                      </td>
                    <td className="px-4 py-2">{combo.name}</td>
                    <td className="px-4 py-2">{combo.description || "Không có mô tả"}</td>
                    <td className="px-4 py-2">{Number(combo.price).toLocaleString('vi-VN')} đ</td>
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
          </CardContent>
        </Card>
      </div>
    );
}