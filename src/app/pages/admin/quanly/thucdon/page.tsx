"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import TitleDesc from "../../../../components/ui/titleDesc";
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { FaPlus } from "react-icons/fa";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BiPrinter } from "react-icons/bi";
import Image from "next/image";
import Pagination from "../../../../components/ui/Panigation";
import { Category, Group, Food, Combo } from "../../../../types";
import { FaPen, FaEyeSlash  } from "react-icons/fa";


export default function QuanLyThucDon() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodGroups, setFoodGroups] = useState<Group[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);

  const categoryRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const foodRef = useRef<HTMLDivElement>(null);
  const comboRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Pagination state
  const [categoryPage, setCategoryPage] = useState(1);
  const [groupPage, setGroupPage] = useState(1);
  const [foodPage, setFoodPage] = useState(1);
  const [comboPage, setComboPage] = useState(1);
  const itemsPerPage = 10;

  // Gọi API lấy danh mục
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/category")
      .then((res) => {
        console.log("Danh sách danh mục:", res.data);
        setCategories(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  // Gọi API lấy loại danh mục
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/foodgroups")
      .then((res) => {
        console.log("Danh sách loại danh mục:", res.data);
        setFoodGroups(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy loại danh mục:", err));
  }, []);

  // Gọi API lấy món ăn
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/foods")
      .then((res) => {
        console.log("Danh sách món ăn:", res.data.data);
        setFoods(res.data.data)
      })
      .catch((err) => console.error("Lỗi khi lấy món ăn:", err));
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/combos")
      .then(res => {
        console.log("Danh sách combo:", res.data);
        setCombos(res.data);
      })
      .catch(err => console.error("Lỗi khi lấy combo:", err));
  }, []);

  // Phân trang dữ liệu
  const paginate = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const currentCategories = paginate(categories, categoryPage);
  const currentGroups = paginate(foodGroups, groupPage);
  const currentFoods = paginate(foods, foodPage);
  const currentCombos = paginate(combos, comboPage);

  return (
    <div className="grid grid-cols-12 gap-6">
      <TitleDesc
        title="Quản lý thực đơn"
        description="Danh sách danh mục và món ăn"
        className="col-span-12"
      />
      <div className="col-span-12 grid grid-cols-12 gap-4">
        {/* Thống kê */}
        {[
          { label: "Tổng danh mục", value: categories.length, ref: categoryRef },
          { label: "Tổng loại danh mục", value: foodGroups.length, ref: groupRef },
          { label: "Tổng món ăn", value: foods.length, ref: foodRef },
          { label: "Tổng combo", value: combos.length, ref: comboRef },
        ].map((item, index) => (
          <Card className="col-span-3" key={index} onClick={() => scrollToSection(item.ref)}>
            <CardContent>
              <p className="text-base text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold mt-2">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bảng danh mục */}
      <div className="col-span-12" ref={categoryRef}>
        <Card>
          <CardHeader header="Danh sách danh mục">
            <div className="flex gap-2 float-right">
                <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-base">
                <PiMicrosoftExcelLogoFill /> Xuất Excel
                </Button>
                <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-base">
                <BiPrinter /> In
                </Button>
            </div>
            <Button className="bg-[#9c6b66] text-white px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer">
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
                currentPage={categoryPage}
                totalItems={categories.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCategoryPage}
            />
          </CardContent>
        </Card>
      </div>

      {/* Bảng loại danh mục */}
      <div className="col-span-12" ref={groupRef}>
        <Card>
          <CardHeader header="Danh sách loại danh mục">
            <div className="flex gap-2 float-right">
                <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-base">
                <PiMicrosoftExcelLogoFill /> Xuất Excel
                </Button>
                <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-base">
                <BiPrinter /> In
                </Button>
            </div>
            <Button className="bg-[#f3eae4] text-[#9c6b66] px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer">
              <FaPlus /> Thêm loại danh mục
            </Button>
          </CardHeader>
          <CardContent>
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                <tr>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">Tên loại danh mục</th>
                  <th className="px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentGroups.map((cate, index) => (
                  <tr
                    key={cate.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                  >
                    <td className="px-4 py-2">{cate.id}</td>
                    <td className="px-4 py-2">{cate.name}</td>
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
                currentPage={groupPage}
                totalItems={foodGroups.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setGroupPage}
            />
          </CardContent>
        </Card>
      </div>

      {/* Bảng món ăn */}
      <div className="col-span-12" ref={foodRef}>
        <Card>
          <CardHeader header="Danh sách món ăn">
            <div className="flex gap-2 float-right">
                <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-base">
                <PiMicrosoftExcelLogoFill /> Xuất Excel
                </Button>
                <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-base">
                <BiPrinter /> In
                </Button>
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
                  {currentFoods.map((food, index) => (
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
                  currentPage={foodPage}
                  totalItems={foods.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setFoodPage}
                />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bảng combo */}
      <div className="col-span-12" ref={comboRef}>
        <Card>
          <CardHeader header="Danh sách combo món ăn">
            <div className="flex gap-2 float-right">
                <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-base">
                <PiMicrosoftExcelLogoFill /> Xuất Excel
                </Button>
                <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-base">
                <BiPrinter /> In
                </Button>
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
                currentPage={comboPage}
                totalItems={combos.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setComboPage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
