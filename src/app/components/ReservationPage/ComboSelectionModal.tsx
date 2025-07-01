"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiImage,
  FiPlus,
  FiMinus,
  FiShoppingCart,
  FiSearch,
  FiEye,
  FiClock,
  FiUsers,
  FiStar,
  FiPackage,
} from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";

// ✅ Interface chuẩn hóa theo types/booking
interface ComboItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string | null;
  items: {
    food_id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

interface SelectedComboItem extends ComboItem {
  combo_id: number;
  quantity: number;
}

// ✅ Props
interface ComboSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  combos: ComboItem[];
  selectedCombos: SelectedComboItem[];
  onAddCombo: (combo: ComboItem) => void;
  onRemoveCombo: (comboId: number) => void;
  onQuantityChange: (comboId: number, quantity: number) => void;
  totalPrice: number;
  isLoading: boolean;
}

export default function ComboSelectionModal({
  isOpen,
  onClose,
  combos = [],
  selectedCombos,
  onAddCombo,
  onRemoveCombo,
  onQuantityChange,
  totalPrice,
  isLoading,
}: ComboSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCombo, setSelectedCombo] = useState<ComboItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // ✅ Ngăn scroll khi mở modal
  useEffect(() => {
    if (isOpen || isDetailModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, isDetailModalOpen]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);

  const filteredCombos = useMemo(() => {
    return combos.filter((combo) =>
      combo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, combos]);

  const generateKey = (prefix: string, ...args: (string | number)[]) =>
    `${prefix}-${args.join("-")}`;

  const openDetailModal = (combo: ComboItem) => {
    setSelectedCombo(combo);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCombo(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderComboImage = (combo: ComboItem) => {
    if (combo.image) {
      return (
        <img
          src={combo.image}
          alt={combo.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-300">
        <FiImage size={48} />
      </div>
    );
  };

  const renderComboCard = (combo: ComboItem) => (
    <motion.div
      key={generateKey("combo", combo.id)}
      variants={itemVariants}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.15)",
      }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
      onClick={() => openDetailModal(combo)}
    >
      <div className="h-48 bg-gray-100 relative group">
        {renderComboImage(combo)}
        <div className="absolute top-3 left-3 bg-[#4CAF50]/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full flex items-center">
          <FiPackage size={14} className="mr-1" />
          <span>Combo</span>
        </div>
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white/90 backdrop-blur-sm text-[#AF763E] p-2 rounded-full hover:bg-white transition-colors">
            <FiEye size={18} />
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
          {combo.name}
        </h3>
        {combo.description && (
          <p className="text-sm text-gray-500 line-clamp-3 mb-4">
            {combo.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#AF763E]">
            {formatCurrency(combo.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddCombo(combo);
            }}
            className="bg-[#AF763E] hover:bg-[#8E5F32] text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors"
          >
            <FiPlus size={16} className="mr-2" />
            Thêm
          </button>
        </div>
      </div>
    </motion.div>
  );

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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-[85vw] max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b">
              <div className="flex items-center gap-4">
                <div className="bg-[#4CAF50]/10 p-3 rounded-full">
                  <FiPackage className="w-8 h-8 text-[#4CAF50]" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Chọn combo từ thực đơn
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-8 h-8" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
              {/* Left: Combo List */}
              <div className="lg:col-span-2 flex flex-col overflow-hidden border-r">
                <div className="p-6 border-b">
                  <div className="relative mb-6">
                    <input
                      type="text"
                      placeholder="Tìm kiếm combo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] text-lg"
                    />
                    <FiSearch
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <div className="overflow-y-auto p-6 flex-1 bg-gray-50">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4CAF50]"></div>
                    </div>
                  ) : filteredCombos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                      <FiPackage size={64} className="mb-6 opacity-30" />
                      <p className="text-xl font-medium">
                        Không tìm thấy combo nào
                      </p>
                      <p className="text-base mb-4">
                        Hãy thử từ khóa khác hoặc kiểm tra chính tả.
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      {filteredCombos.map(renderComboCard)}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right: Selected Combos */}
              <div className="flex flex-col bg-white overflow-hidden border-l">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center justify-between">
                    <span>
                      Combo đã chọn{" "}
                      <span className="ml-2 text-[#4CAF50]">
                        ({selectedCombos.length})
                      </span>
                    </span>
                    {selectedCombos.length > 0 && (
                      <button
                        onClick={() =>
                          selectedCombos.forEach((combo) =>
                            onRemoveCombo(combo.combo_id)
                          )
                        }
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {selectedCombos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-gray-500 py-12">
                      <FiShoppingCart size={64} className="mb-6 opacity-30" />
                      <p className="text-lg font-medium">Chưa chọn combo</p>
                      <p className="text-base mt-2 text-center">
                        Hãy chọn combo từ danh sách bên trái
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedCombos.map((combo) => (
                        <motion.div
                          key={generateKey(
                            "selected-combo",
                            combo.combo_id,
                            combo.price
                          )}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            {combo.image ? (
                              <img
                                src={combo.image || "/placeholder.svg"}
                                alt={combo.name}
                                className="w-16 h-16 object-cover rounded-lg mr-4"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/placeholder.svg";
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                                <FiImage className="text-gray-400" size={24} />
                              </div>
                            )}
                            <div>
                              <p className="text-base font-medium text-gray-800">
                                {combo.name}
                              </p>
                              <p className="text-sm text-[#4CAF50] font-medium">
                                {formatCurrency(combo.price)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                onQuantityChange(
                                  combo.combo_id,
                                  Math.max(1, combo.quantity - 1)
                                )
                              }
                              disabled={combo.quantity <= 1}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                combo.quantity <= 1
                                  ? "bg-gray-100 text-gray-400"
                                  : "bg-gray-200 hover:bg-gray-300"
                              }`}
                            >
                              <FiMinus size={16} />
                            </button>
                            <span className="text-base font-medium w-8 text-center">
                              {combo.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onQuantityChange(
                                  combo.combo_id,
                                  combo.quantity + 1
                                )
                              }
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg text-gray-600">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-[#4CAF50]">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full py-4 bg-[#4CAF50] hover:bg-[#3d8b40] text-white rounded-xl transition-colors flex items-center justify-center gap-3 font-medium shadow-md text-lg"
                  >
                    <FiShoppingCart size={20} />
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
