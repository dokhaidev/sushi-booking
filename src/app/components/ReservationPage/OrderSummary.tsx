"use client"
import type React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import {
  FiHome,
  FiClock,
  FiChevronRight,
  FiImage,
  FiPercent,
  FiChevronDown,
  FiTag,
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi"
import { useTranslation } from "@/src/app/lib/i18n/client"

interface FoodItem {
  food_id: number
  name: string
  price: number
  quantity: number
  image?: string | null
  description?: string | null
}

interface ComboItem {
  combo_id: number
  name: string
  price: number
  quantity: number
  image?: string | null
  items: {
    name: string
    quantity: number
    image?: string | null
    description?: string | null
  }[]
}

interface FormData {
  guest_count: number
  payment_method: "cash" | "vnpay"
}

interface Table {
  location?: string
  max_guests?: number
}

interface Voucher {
  id: number
  code: string
  name: string
  discount_amount: number
  discount_type: "percent" | "fixed"
  expiry_date: string
  min_order_amount?: number
  status: string
}

interface RawVoucher {
  id: number
  code: string
  discount_value: number
  end_date: string
  status: string
}

interface NotificationState {
  message: string
  show: boolean
  type: "success" | "error" | "info"
}

interface OrderSummaryProps {
  selectedTable: Table | null
  selectedDate: string
  selectedTime: string
  foods: FoodItem[]
  formData: FormData
  depositAmount: number
  onAddFood: () => void
  onAddCombo: () => void
  onSubmitOrder: () => Promise<boolean>
  isLoading: boolean
  voucherCode: string
  setVoucherCode: (code: string) => void
  discountAmount: number
  applyVoucherCode: () => void
  combos: ComboItem[]
  userId?: number
  getPaymentAmount: () => number
  setNotification: React.Dispatch<React.SetStateAction<NotificationState>>
}

export default function OrderSummaryUpdated({
  selectedTable,
  selectedDate,
  selectedTime,
  foods,
  formData,
  depositAmount,
  onAddFood,
  onAddCombo,
  onSubmitOrder,
  isLoading,
  voucherCode,
  setVoucherCode,
  discountAmount,
  applyVoucherCode,
  combos,
  userId,
  setNotification,
}: OrderSummaryProps) {
  const { t } = useTranslation("orderSummary")

  const [userVouchers, setUserVouchers] = useState<Voucher[]>([])
  const [showVoucherDropdown, setShowVoucherDropdown] = useState(false)
  const [loadingVouchers, setLoadingVouchers] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Kiểm tra payment method
  const isCashPayment = formData.payment_method === "cash"
  const isVnpayPayment = formData.payment_method === "vnpay"

  const displayGuestCount = Math.min(formData.guest_count, 12)
  const shouldDeposit = formData.guest_count > 12
  const effectiveDeposit = shouldDeposit ? 200000 : depositAmount

  const originalTotal =
    (foods || []).reduce((sum, food) => sum + food.price * food.quantity, 0) +
    (combos || []).reduce((sum, combo) => sum + combo.price * combo.quantity, 0)

  const finalTotal = Math.max(originalTotal - discountAmount, 0)
  const payNowAmount = formData.payment_method === "cash" ? effectiveDeposit : finalTotal
  const remainingCashPayment = formData.payment_method === "cash" ? Math.max(finalTotal - effectiveDeposit, 0) : 0

  useEffect(() => {
    const fetchUserVouchers = async () => {
      if (!userId) return

      setLoadingVouchers(true)
      try {
        const token = localStorage.getItem("auth")
        if (!token) {
          console.warn("No auth token found")
          setUserVouchers([])
          return
        }

        const response = await fetch(`http://127.0.0.1:8000/api/getAllVoucherByUser/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data?.data)) {
            const formattedVouchers: Voucher[] = (data.data as RawVoucher[]).map((voucher) => ({
              id: voucher.id,
              code: voucher.code,
              name: `Voucher ${voucher.code}`,
              discount_amount: voucher.discount_value,
              discount_type: "fixed",
              expiry_date: voucher.end_date,
              min_order_amount: 0,
              status: voucher.status,
            }))

            const activeUniqueVouchers: Voucher[] = formattedVouchers
              .filter((v: Voucher) => v.status === "active" && new Date(v.expiry_date) > new Date())
              .filter(
                (v: Voucher, i: number, self: Voucher[]) =>
                  i === self.findIndex((t: Voucher) => t.id === v.id && t.code === v.code),
              )

            setUserVouchers(activeUniqueVouchers)
          } else {
            setUserVouchers([])
          }
        } else {
          console.error("Failed to fetch vouchers:", response.status, response.statusText)
          setUserVouchers([])

          if (response.status === 401) {
            setNotification({
              message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
              show: true,
              type: "error",
            })
          }
        }
      } catch (error: any) {
        console.error("Error fetching vouchers:", error)
        setUserVouchers([])
      } finally {
        setLoadingVouchers(false)
      }
    }

    fetchUserVouchers()
  }, [userId, setNotification])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowVoucherDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleVoucherSelect = (voucher: Voucher) => {
    setVoucherCode(voucher.code)
    setShowVoucherDropdown(false)
    setTimeout(() => {
      applyVoucherCode()
    }, 100)
  }

  const formatDiscountText = (voucher: Voucher) => {
    return t("orderSummary.discount", { amount: voucher.discount_amount.toLocaleString() })
  }

  const handleConfirmOrder = async () => {
    // Chỉ kiểm tra table và thông tin cơ bản, bỏ kiểm tra món ăn
    if (!selectedTable) {
      setNotification({
        message: "Vui lòng chọn bàn trước khi đặt.",
        show: true,
        type: "error",
      })
      return
    }

    // Kiểm tra thông tin form data có đầy đủ không
    if (!formData.guest_count || !formData.payment_method) {
      setNotification({
        message: "Vui lòng điền đầy đủ thông tin đặt bàn.",
        show: true,
        type: "error",
      })
      return
    }

    // Kiểm tra payment method có hợp lệ không
    if (!["cash", "vnpay"].includes(formData.payment_method)) {
      setNotification({
        message: "Phương thức thanh toán không hợp lệ.",
        show: true,
        type: "error",
      })
      return
    }

    // ✅ Kiểm tra table capacity
    if (selectedTable && formData.guest_count <= 12) {
      if (selectedTable.max_guests && selectedTable.max_guests < formData.guest_count) {
        setNotification({
          message: `Bàn hiện tại chỉ phù hợp cho ${selectedTable.max_guests} khách. Vui lòng chọn lại bàn hoặc giảm số lượng khách.`,
          show: true,
          type: "error",
        })
        return
      }
    }

    setNotification({
      message: "Đang kiểm tra tình trạng bàn và xử lý đơn hàng...",
      show: true,
      type: "info",
    })

    try {
      const success = await onSubmitOrder()
      if (success) {
        setNotification({
          message: "Đặt bàn thành công!",
          show: true,
          type: "success",
        })
      } else {
        setNotification({
          message: "Đặt bàn thất bại. Vui lòng thử lại.",
          show: true,
          type: "error",
        })
      }
    } catch (error: any) {
      console.error("Lỗi khi xác nhận đơn hàng:", error)

      // ✅ Xử lý thông báo thân thiện hơn
      if (error.response?.status === 422) {
        const errorData = error.response.data
        const errorMessage = errorData?.message || errorData

        if (typeof errorMessage === "string" && errorMessage.includes("bàn")) {
          if (errorMessage.includes("không còn") || errorMessage.includes("phù hợp")) {
            setNotification({
              message:
                "🚫 Không còn bàn phù hợp!\n\nHiện tại không còn bàn trống cho số lượng khách của bạn trong khung giờ này.\n\n💡 Gợi ý:\n• Thử chọn khung giờ khác\n• Giảm số lượng khách\n• Chọn ngày khác",
              show: true,
              type: "error",
            })
          } else if (errorMessage.includes("đã được đặt")) {
            setNotification({
              message:
                "⚡ Bàn vừa được đặt!\n\nBàn bạn chọn vừa được khách khác đặt trước. Vui lòng chọn bàn khác hoặc thời gian khác.",
              show: true,
              type: "error",
            })
          } else {
            setNotification({
              message: `❌ ${errorMessage}`,
              show: true,
              type: "error",
            })
          }
        } else {
          // Lỗi validation khác
          let friendlyMessage = "⚠️ Thông tin đặt bàn chưa hợp lệ:\n\n"

          if (errorData?.errors) {
            const errorDetails = Object.entries(errorData.errors)
              .map(([field, messages]) => {
                const fieldName =
                  field === "guest_count"
                    ? "Số lượng khách"
                    : field === "reservation_date"
                      ? "Ngày đặt"
                      : field === "reservation_time"
                        ? "Giờ đặt"
                        : field === "customer_name"
                          ? "Tên khách hàng"
                          : field === "customer_phone"
                            ? "Số điện thoại"
                            : field
                return `• ${fieldName}: ${Array.isArray(messages) ? messages.join(", ") : messages}`
              })
              .join("\n")
            friendlyMessage += errorDetails
          } else {
            friendlyMessage += `• ${errorMessage || "Vui lòng kiểm tra lại thông tin"}`
          }

          setNotification({
            message: friendlyMessage,
            show: true,
            type: "error",
          })
        }
      } else if (error.response?.status === 401) {
        setNotification({
          message: "🔐 Phiên đăng nhập đã hết hạn\n\nVui lòng đăng nhập lại để tiếp tục đặt bàn.",
          show: true,
          type: "error",
        })
      } else if (error.code === "NETWORK_ERROR") {
        setNotification({
          message: "🌐 Lỗi kết nối mạng\n\nVui lòng kiểm tra kết nối internet và thử lại.",
          show: true,
          type: "error",
        })
      } else {
        setNotification({
          message: "❌ Đã xảy ra lỗi trong quá trình đặt bàn\n\nVui lòng thử lại sau hoặc liên hệ hỗ trợ.",
          show: true,
          type: "error",
        })
      }
    }
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("orderSummary.title")}</h2>

      {selectedTable ? (
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <div className="bg-gray-100 p-2 rounded-lg mr-3">
              <FiHome className="text-[#AF763E]" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{t("orderSummary.tableInfo")}</h3>
              <p className="text-sm text-gray-600">{t("orderSummary.tableFor", { guestCount: displayGuestCount })}</p>
              <p className="text-sm text-gray-600">
                {selectedDate} • {selectedTime}
              </p>
              {selectedTable.location && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="bg-gray-50 text-[#AF763E] px-2 py-1 rounded">{selectedTable.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-6">
          <p className="text-[#AF763E] text-sm flex items-center">
            <FiClock className="mr-2" />
            {t("orderSummary.selectDateTime")}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">{t("orderSummary.foodSection")}</h3>
        <div className="flex gap-2">
          <button onClick={onAddFood} className="text-[#AF763E] hover:text-blue-800 text-sm flex items-center">
            {(foods || []).length > 0 ? t("orderSummary.editFood") : t("orderSummary.addFood")}
            <FiChevronRight className="ml-1" />
          </button>
          <button
            onClick={() => window.open("/san-pham", "_blank")}
            className="text-[#AF763E] hover:text-blue-800 text-sm flex items-center border border-[#AF763E]/30 px-2 py-1 rounded"
          >
            Thêm từ menu
          </button>
        </div>
      </div>

      {(foods || []).length > 0 ? (
        <div className="space-y-3 mb-4">
          {foods.map((food) => (
            <div key={food.food_id} className="flex justify-between items-center">
              <div className="flex items-center">
                {food.image ? (
                  <Image
                    src={food.image || "/placeholder.svg"}
                    alt={food.name}
                    className="w-10 h-10 rounded-md object-cover mr-3"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                    <FiImage className="text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800">{food.name}</p>
                  <p className="text-xs text-gray-500">
                    {food.price.toLocaleString()} ₫ × {food.quantity}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium">{(food.price * food.quantity).toLocaleString()} ₫</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
          <p className="text-gray-500 text-sm">{t("orderSummary.noFoodSelected")}</p>
          <button onClick={onAddFood} className="mt-2 text-[#AF763E] text-sm font-medium">
            + {t("orderSummary.addFood")}
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">{t("orderSummary.comboSection")}</h3>
        <div className="flex gap-2">
          <button onClick={onAddCombo} className="text-[#AF763E] hover:text-blue-800 text-sm flex items-center">
            {(combos || []).length > 0 ? t("orderSummary.editCombo") : t("orderSummary.addCombo")}
            <FiChevronRight className="ml-1" />
          </button>
          <button
            onClick={() => window.open("/san-pham", "_blank")}
            className="text-[#AF763E] hover:text-blue-800 text-sm flex items-center border border-[#AF763E]/30 px-2 py-1 rounded"
          >
            Thêm từ menu
          </button>
        </div>
      </div>

      {(combos || []).length > 0 ? (
        <div className="space-y-3 mb-4">
          {combos.map((combo) => (
            <div key={combo.combo_id} className="flex justify-between items-center">
              <div className="flex items-center">
                {combo.image ? (
                  <Image
                    src={combo.image || "/placeholder.svg"}
                    alt={combo.name}
                    className="w-10 h-10 rounded-md object-cover mr-3"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                    <FiImage className="text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800">{combo.name}</p>
                  <p className="text-sm text-[#4CAF50] font-medium">{combo.price.toLocaleString()}₫</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {combo.items &&
                      combo.items.map((item: { name: string; quantity: number }, index: number) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium">{(combo.price * combo.quantity).toLocaleString()} ₫</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
          <p className="text-gray-500 text-sm">{t("orderSummary.noComboSelected")}</p>
          <button onClick={onAddCombo} className="mt-2 text-[#AF763E] text-sm font-medium">
            + {t("orderSummary.addCombo")}
          </button>
        </div>
      )}

      <div className="mt-3 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("orderSummary.voucherLabel")}</label>
        <div className="relative" ref={dropdownRef}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                onFocus={() => setShowVoucherDropdown(true)}
                placeholder={t("orderSummary.voucherPlaceholder")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#AF763E]"
              />
              <button
                onClick={() => setShowVoucherDropdown(!showVoucherDropdown)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiChevronDown size={16} />
              </button>
            </div>
            <button
              onClick={applyVoucherCode}
              className="bg-[#AF763E] text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
              disabled={isLoading}
            >
              {t("orderSummary.apply")}
            </button>
          </div>

          {showVoucherDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {loadingVouchers ? (
                <div className="p-3 text-center text-gray-500">
                  <span className="animate-spin mr-2">↻</span>
                  {t("orderSummary.loadingVouchers")}
                </div>
              ) : userVouchers.length === 0 ? (
                <div className="p-3 text-center text-gray-500">{t("orderSummary.noVouchers")}</div>
              ) : (
                userVouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    onClick={() => handleVoucherSelect(voucher)}
                    className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <FiTag className="text-orange-600" size={16} />
                      </div>
                      <div className="flex-1">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{voucher.code}</p>
                          <p className="text-xs text-gray-600">{voucher.name}</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {formatDiscountText(voucher)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {t("orderSummary.expiry", { date: new Date(voucher.expiry_date).toLocaleDateString() })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {discountAmount > 0 && (
          <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
            <FiPercent className="text-green-500" />
            {t("orderSummary.discount", { amount: discountAmount.toLocaleString() })}
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">{t("orderSummary.subtotal")}</span>
          <span className="font-medium">{originalTotal.toLocaleString()} ₫</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between mb-1 text-green-700">
            <span className="text-sm">Giảm giá</span>
            <span>-{discountAmount.toLocaleString()} ₫</span>
          </div>
        )}

        <div className="flex justify-between mb-1">
          <span className="text-gray-600">{t("orderSummary.deposit")}</span>
          <span className="font-medium text-orange-600">{effectiveDeposit.toLocaleString()} ₫</span>
        </div>

        <div className="mt-4 mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Phương thức thanh toán:{" "}
              <span className="text-[#AF763E]">
                {isCashPayment ? "Tiền mặt" : isVnpayPayment ? "VNPay" : "Không xác định"}
              </span>
            </p>
          </div>

          {isCashPayment ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FiDollarSign className="text-blue-600 mr-2" size={20} />
                <p className="text-sm text-blue-700 font-semibold">{t("orderSummary.cashPayment")}</p>
              </div>
              <div className="text-xs text-blue-600 space-y-1">
                {shouldDeposit ? (
                  <>
                    <p>
                      • Thanh toán ngay:{" "}
                      <span className="font-semibold text-blue-800">{effectiveDeposit.toLocaleString()}₫</span>
                    </p>
                    <p>
                      • Thanh toán tại quán:{" "}
                      <span className="font-semibold text-blue-800">{remainingCashPayment.toLocaleString()}₫</span>
                    </p>
                    <p className="text-blue-500 italic mt-2">
                      ⚠️ Do số khách &gt; 12 người, bạn cần thanh toán tiền cọc trước.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      • Thanh toán tại quán:{" "}
                      <span className="font-semibold text-blue-800">{finalTotal.toLocaleString()}₫</span>
                    </p>
                    <p className="text-blue-500 italic mt-2">✅ Bạn sẽ thanh toán toàn bộ khi đến nhà hàng.</p>
                  </>
                )}
              </div>
            </div>
          ) : isVnpayPayment ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FiCreditCard className="text-green-600 mr-2" size={20} />
                <p className="text-sm text-green-700 font-semibold">{t("orderSummary.vnpayPayment")}</p>
              </div>
              <div className="text-xs text-green-600 space-y-1">
                <p>
                  • Thanh toán online ngay:{" "}
                  <span className="font-semibold text-green-800">{finalTotal.toLocaleString()}₫</span>
                </p>
                <p className="text-green-500 italic mt-2">
                  🔒 Bạn sẽ được chuyển đến trang thanh toán VNPay an toàn để hoàn tất giao dịch.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">Phương thức thanh toán không hợp lệ: "{formData.payment_method}"</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-3 pt-2 border-t border-gray-200">
          <span className="font-semibold text-gray-800">
            {isCashPayment ? (shouldDeposit ? "Cần thanh toán ngay:" : "Tổng cộng:") : "Tổng thanh toán:"}
          </span>
          <span className="font-bold text-red-600 text-lg">{payNowAmount.toLocaleString()} ₫</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleConfirmOrder}
        disabled={!selectedTable || isLoading || !formData.guest_count || !formData.payment_method}
        className={`w-full py-3 rounded-lg text-white mt-6 font-semibold ${
          !selectedTable || isLoading || !formData.guest_count || !formData.payment_method
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#AF763E] hover:bg-[#9A6635]"
        } transition-all shadow-md`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">↻</span>
            {t("orderSummary.processing")}
          </span>
        ) : (
          <>Xác nhận đặt bàn</>
        )}
      </motion.button>
    </motion.div>
  )
}
