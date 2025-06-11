"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiImage,
  FiPlus,
  FiMinus,
  FiShoppingCart,
  FiSearch,
} from "react-icons/fi";
import { useState } from "react";
import type { FoodItem, SelectedFoodItem } from "../../types/booking";

interface FoodSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: FoodItem[];
  selectedFoods: SelectedFoodItem[];
  activeFoodCategory: string;
  setActiveFoodCategory: (category: string) => void;
  onAddFood: (food: FoodItem) => void;
  onRemoveFood: (foodId: number) => void;
  onQuantityChange: (foodId: number, quantity: number) => void;
  totalPrice: number;
  isLoading: boolean;
}

export default function FoodSelectionModal({
  isOpen,
  onClose,
  foods,
  selectedFoods,
  activeFoodCategory,
  setActiveFoodCategory,
  onAddFood,
  onRemoveFood,
  onQuantityChange,
  totalPrice,
  isLoading,
}: FoodSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const foodCategories = [
    "all",
    ...Array.from(new Set(foods.map((food) => food.category || "other"))),
  ];

  // Filter foods by category and search term
  const filteredFoods = foods
    .filter(
      (food) =>
        activeFoodCategory === "all" || food.category === activeFoodCategory
    )
    .filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 30 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-[#AF763E]/10 p-2 rounded-full">
                  <FiShoppingCart className="w-6 h-6 text-[#AF763E]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Chọn món từ thực đơn
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Food Categories & List */}
              <div className="lg:col-span-2 flex flex-col overflow-hidden border-r">
                {/* Search and Category Tabs */}
                <div className="p-5 border-b">
                  {/* Search */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Tìm kiếm món ăn..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF763E]/30 focus:border-[#AF763E]"
                    />
                    <FiSearch
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>

                  {/* Category Tabs */}
                  <div className="flex overflow-x-auto space-x-2 pb-1 scrollbar-hide">
                    {foodCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveFoodCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          activeFoodCategory === category
                            ? "bg-[#AF763E] text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category === "all" ? "Tất cả" : category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food List */}
                <div className="overflow-y-auto p-5 flex-1 bg-gray-50">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AF763E]"></div>
                    </div>
                  ) : filteredFoods.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
                      <FiImage size={48} className="mb-4 opacity-30" />
                      <p className="text-lg font-medium">
                        Không tìm thấy món ăn nào
                      </p>
                      <p className="text-sm">
                        Vui lòng thử tìm kiếm hoặc chọn danh mục khác
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {filteredFoods.map((food) => (
                        <motion.div
                          key={food.id}
                          variants={itemVariants}
                          whileHover={{
                            scale: 1.01,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          }}
                          className="flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="w-28 h-28 bg-gray-100 relative">
                            {food.image ? (
                              <img
                                src={food.image || "/placeholder.svg"}
                                alt={food.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <FiImage size={28} />
                              </div>
                            )}
                            {food.category && (
                              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                {food.category}
                              </div>
                            )}
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                                {food.name}
                              </h3>
                              {food.description && (
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                  {food.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[#AF763E] font-bold">
                                {food.price.toLocaleString()} VNĐ
                              </span>
                              <button
                                onClick={() => onAddFood(food)}
                                className="bg-[#AF763E] hover:bg-[#8E5F32] text-white px-3 py-1.5 rounded-lg text-xs flex items-center transition-colors"
                              >
                                <FiPlus size={14} className="mr-1" />
                                Thêm
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Selected Foods */}
              <div className="flex flex-col h-full bg-white">
                <div className="p-5 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <span className="bg-[#AF763E] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">
                        {selectedFoods.length}
                      </span>
                      Món đã chọn
                    </h3>
                    {selectedFoods.length > 0 && (
                      <button
                        onClick={() =>
                          selectedFoods.forEach((food) =>
                            onRemoveFood(food.food_id)
                          )
                        }
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                  {selectedFoods.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
                      <FiShoppingCart size={48} className="mb-4 opacity-30" />
                      <p className="text-base font-medium">Giỏ hàng trống</p>
                      <p className="text-sm text-center mt-1">
                        Hãy thêm món ăn từ thực đơn
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedFoods.map((food) => (
                        <motion.div
                          key={food.food_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-between bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            {food.image ? (
                              <img
                                src={food.image || "/placeholder.svg"}
                                alt={food.name}
                                className="w-12 h-12 object-cover rounded-lg mr-3"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                                <FiImage className="text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {food.name}
                              </p>
                              <p className="text-xs text-[#AF763E] font-medium">
                                {food.price.toLocaleString()} VNĐ
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                onQuantityChange(
                                  food.food_id,
                                  food.quantity - 1
                                )
                              }
                              className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {food.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onQuantityChange(
                                  food.food_id,
                                  food.quantity + 1
                                )
                              }
                              className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="p-5 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Tổng cộng:</span>
                    <span className="text-xl font-bold text-[#AF763E]">
                      {totalPrice.toLocaleString()} VNĐ
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full py-3 bg-[#AF763E] hover:bg-[#8E5F32] text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-medium shadow-md"
                  >
                    <FiShoppingCart size={18} />
                    Xác nhận đơn hàng
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
