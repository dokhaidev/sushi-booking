"use client"
import Image from "next/image"
import { X, Plus, Minus, ShoppingCart, ArrowRight, Trash2, Calendar } from "lucide-react"

interface CartFood {
  food_id: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartCombo {
  combo_id: number
  name: string
  price: number
  quantity: number
  image?: string | null
  items: {
    name: string
    quantity: number
  }[]
}

interface SimplifiedCartSidebarProps {
  isOpen: boolean
  onClose: () => void
  foods: CartFood[]
  combos: CartCombo[]
  onUpdateFoodQuantity: (foodId: number, quantity: number) => void
  onUpdateComboQuantity: (comboId: number, quantity: number) => void
  onRemoveFood: (foodId: number) => void
  onRemoveCombo: (comboId: number) => void
  onProceedToReservation: () => void
  isBookingMode?: boolean
}

export default function SimplifiedCartSidebar({
  isOpen,
  onClose,
  foods,
  combos,
  onUpdateFoodQuantity,
  onUpdateComboQuantity,
  onRemoveFood,
  onRemoveCombo,
  onProceedToReservation,
  isBookingMode = false,
}: SimplifiedCartSidebarProps) {
  const getTotalItems = () => {
    return foods.reduce((sum, f) => sum + f.quantity, 0) + combos.reduce((sum, c) => sum + c.quantity, 0)
  }

  const getTotalValue = () => {
    return (
      foods.reduce((sum, f) => sum + f.price * f.quantity, 0) + combos.reduce((sum, c) => sum + c.price * c.quantity, 0)
    )
  }

  const hasItems = foods.length > 0 || combos.length > 0

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b border-gray-200 ${
            isBookingMode
              ? "bg-gradient-to-r from-[#A68345] to-[#BD944A]"
              : "bg-gradient-to-r from-[#A68345] to-[#BD944A]"
          }`}
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {isBookingMode ? <Calendar className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
            {isBookingMode ? `Đặt bàn (${getTotalItems()})` : `Giỏ hàng (${getTotalItems()})`}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4">
            {!hasItems ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                {isBookingMode ? (
                  <Calendar className="w-16 h-16 mb-4 opacity-50" />
                ) : (
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                )}
                <p className="text-lg font-medium mb-2">
                  {isBookingMode ? "Chưa chọn món cho đặt bàn" : "Giỏ hàng trống"}
                </p>
                <p className="text-sm text-center">
                  {isBookingMode ? "Hãy chọn món ăn cho đơn đặt bàn của bạn" : "Hãy thêm món ăn yêu thích vào giỏ hàng"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Foods Section */}
                {foods.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      🍣 Món ăn ({foods.length})
                    </h3>
                    <div className="space-y-3">
                      {foods.map((food) => (
                        <div key={food.food_id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={food.image || "/placeholder.svg?height=64&width=64"}
                                alt={food.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{food.name}</h4>
                              <p className="text-sm text-[#A68345] font-medium">{food.price.toLocaleString()}₫</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => onUpdateFoodQuantity(food.food_id, Math.max(0, food.quantity - 1))}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium">{food.quantity}</span>
                                  <button
                                    onClick={() => onUpdateFoodQuantity(food.food_id, food.quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => onRemoveFood(food.food_id)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                Tổng: {(food.price * food.quantity).toLocaleString()}₫
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Combos Section */}
                {combos.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      🎁 Combo ({combos.length})
                    </h3>
                    <div className="space-y-3">
                      {combos.map((combo) => (
                        <div key={combo.combo_id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={combo.image || "/placeholder.svg?height=64&width=64"}
                                alt={combo.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{combo.name}</h4>
                              <p className="text-sm text-[#A68345] font-medium">{combo.price.toLocaleString()}₫</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {combo.items.map((item, index) => (
                                  <span key={index} className="text-xs bg-white px-2 py-0.5 rounded border">
                                    {item.name} × {item.quantity}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      onUpdateComboQuantity(combo.combo_id, Math.max(0, combo.quantity - 1))
                                    }
                                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium">{combo.quantity}</span>
                                  <button
                                    onClick={() => onUpdateComboQuantity(combo.combo_id, combo.quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => onRemoveCombo(combo.combo_id)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                Tổng: {(combo.price * combo.quantity).toLocaleString()}₫
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {hasItems && (
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tổng món:</span>
                  <span className="font-medium">{getTotalItems()} món</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng tiền:</span>
                  <span className="text-xl font-bold text-[#A68345]">{getTotalValue().toLocaleString()}₫</span>
                </div>
              </div>
              <button
                onClick={onProceedToReservation}
                className="w-full bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isBookingMode ? "Quay lại đặt bàn" : "Tiến hành đặt bàn"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
