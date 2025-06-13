import { FaPlus, FaPen, FaEyeSlash } from "react-icons/fa";
import { Card, CardHeader, CardContent } from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/button";
import {useFetch} from "../../../../../hooks/useFetch";
import usePagination from "@/src/app/hooks/usePagination";
import Pagination from "../../../../../components/ui/Panigation";
import SearchInput from "../../../../../components/ui/SearchInput";
import React, { useState } from "react";

export default function CategoryComponent({
  categoryRef,
}: {
  categoryRef: React.RefObject<HTMLDivElement | null>;
}) {
    const [searchText, setSearchText] = useState("");
    const { categories } = useFetch();
    const {
        currentPage,
        setCurrentPage,
        currentData: currentCategories,
        totalItems,
        itemsPerPage,
    } = usePagination(categories, 10);
    

    return (
    <div className="col-span-12" ref={categoryRef}>
        <Card>
          <CardHeader header="Danh sách danh mục" className="flex justify-between items-center">
            <div className="flex gap-2 w-full max-w-md">
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
            <Button 
            className="bg-[#9c6b66] text-white px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer"
            >
              <FaPlus /> Thêm danh mục
            </Button>
          </CardHeader>
          <CardContent>
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                <tr>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">Tên danh mục</th>
                  <th className="px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map((cate, index) => (
                  <tr
                    key={cate.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                  >
                    <td className="px-4 py-2">{cate.id}</td>
                    <td className="px-4 py-2">{cate.name}</td>
                    <td className="py-2 flex items-center gap-2">
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