"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NotificationPopup from "@/src/app/components/layout/NotificationPopup"
import DateTimeSelector from "@/src/app/components/ReservationPage/DateTimeSelector"
import CustomerInfoForm from "@/src/app/components/ReservationPage/CustomerInfoForm"
import PaymentNotesForm from "@/src/app/components/ReservationPage/PaymentNotesForm"
import OrderSummaryUpdated from "@/src/app/components/ReservationPage/OrderSummary"
import FoodSelectionModal from "@/src/app/components/ReservationPage/FoodSelectionModal"
import ComboSelectionModal from "@/src/app/components/ReservationPage/ComboSelectionModal"
import { useBooking } from "@/src/app/hooks/useBooking"
import { useAuth } from "@/src/app/context/authContext"
import { useTranslation } from "@/src/app/lib/i18n/client"

// Import từ booking.ts
import type { Combo } from "@/src/app/types/booking"

// Import từ FoodSelectionModal.types.ts
import type {
  FoodItem as FoodModalItem,
  SelectedFoodItem as FoodModalSelectedItem,
  Category as FoodModalCategory,
} from "@/src/app/types/Booking/FoodSelectionModal.types"

// Import từ ComboSelectionModal.types.ts
import type {
  ComboItem as ComboModalItem,
  SelectedComboItem as ComboModalSelectedItem,
  FoodItem as ComboModalFoodItem,
} from "@/src/app/types/Booking/ComboSelectionModal.types"

// Định nghĩa NotificationState
interface NotificationState {
  message: string
  show: boolean
  type: "success" | "error" | "info"
}

// Interface cho OrderSummary foods
interface OrderSummaryFoodItem {
  food_id: number
  name: string
  price: number
  quantity: number
  image?: string | null
  description?: string | null
}

// Interface cho OrderSummary combos
interface OrderSummaryComboItem {
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

export default function DatBanPage() {
  const { t, lang } = useTranslation("reservation")
  const router = useRouter()
  const { user, isLoading: authLoading, isInitialized } = useAuth()
  const {
    selectedDate,
    setSelectedDate,
    availableSlots,
    selectedTime,
    selectedTable,
    formData,
    setFormData,
    foods, // SelectedFoodItem[] from useBooking
    combos, // SelectedComboItem[] from useBooking
    foodsData, // FoodItem[] from useBooking
    combosData, // Combo[] from useBooking
    showFoodModal,
    setShowFoodModal,
    showComboModal,
    setShowComboModal,
    activeFoodCategory,
    setActiveFoodCategory,
    today,
    voucherCode,
    setVoucherCode,
    discountAmount,
    fetchUserVouchers,
    fetchAvailableSlots,
    fetchFoods,
    fetchCombos,
    handleSelectTime,
    submitOrder,
    handleAddFood,
    handleRemoveFood,
    handleFoodQuantityChange,
    handleAddCombo,
    handleRemoveCombo,
    handleComboQuantityChange,
    getPaymentAmount,
    applyVoucherCode,
  } = useBooking()

  // Quản lý trạng thái notification
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    show: false,
    type: "info",
  })

  const currentUserId = user?.id || user?.user_id || null

  useEffect(() => {
    if (isInitialized && !user && !authLoading) {
      router.replace(`/${lang}/dang-nhap?returnUrl=${encodeURIComponent("/dat-ban")}`)
    }
  }, [user, authLoading, isInitialized, router, lang])

  // Loading state
  if (!isInitialized || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) return null

  // === MAPPING CHO FOODSELECTIONMODAL ===
  // Chuyển đổi FoodItem[] từ useBooking sang FoodModalItem[] cho FoodSelectionModal
  const foodsForModal: FoodModalItem[] = foodsData.map((food) => {
    let category: FoodModalCategory | undefined
    if (food.category && typeof food.category === "object") {
      category = {
        id: Number(food.category.id),
        name: food.category.name,
        description: food.category.description || null,
        status: food.category.status || 1,
        created_at: food.category.created_at || new Date().toISOString(),
        updated_at: food.category.updated_at || new Date().toISOString(),
      }
    }
    return {
      id: food.id,
      name: food.name,
      description: food.description || null,
      price: typeof food.price === "string" ? Number.parseFloat(food.price) : food.price,
      image: food.image || null,
      category,
      category_id: food.category_id ?? 0,
      group_id: food.group_id ?? null,
      jpName: food.jpName ?? null,
      status: food.status || 1,
      created_at: food.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  })

  // Chuyển đổi SelectedFoodItem[] từ useBooking sang FoodModalSelectedItem[] cho FoodSelectionModal
  const selectedFoodsForModal: FoodModalSelectedItem[] = foods.map((food) => ({
    id: food.food_id,
    name: food.name,
    price: typeof food.price === "string" ? Number.parseFloat(food.price) : food.price,
    quantity: food.quantity,
    image: food.image || null,
    description: food.description || null,
    food_id: food.food_id,
    category_id: food.category_id ?? 0,
    group_id: food.group_id ?? null,
    jpName: food.jpName ?? null,
  }))

  // Chuyển đổi Category[] cho FoodSelectionModal
  const categoriesForModal: FoodModalCategory[] = Array.from(
    new Map(
      foodsData
        .filter((food) => food.category && typeof food.category === "object")
        .map((food) => [
          food.category!.id,
          {
            id: Number(food.category!.id),
            name: food.category!.name,
            description: food.category!.description || null,
            status: food.category!.status || 1,
            created_at: food.category!.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as FoodModalCategory,
        ]),
    ).values(),
  )

  // === MAPPING CHO ORDERSUMARRY ===
  // Chuyển đổi foods cho OrderSummary
  const foodsForOrderSummary: OrderSummaryFoodItem[] = foods.map((food) => ({
    food_id: food.food_id,
    name: food.name,
    price: typeof food.price === "string" ? Number.parseFloat(food.price) : food.price,
    quantity: food.quantity,
    image: food.image || null,
    description: food.description || null,
  }))

  // Chuyển đổi combos cho OrderSummary - sử dụng type từ ComboSelectionModal.types.ts
  const combosForOrderSummary: OrderSummaryComboItem[] = combos.map((combo) => ({
    combo_id: combo.combo_id,
    name: combo.name,
    price: typeof combo.price === "string" ? Number.parseFloat(combo.price) : combo.price,
    quantity: combo.quantity,
    image: combo.image || null,
    items: combo.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image || null,
      description: item.description || null,
    })),
  }))

  // === MAPPING CHO COMBOSELECTIONMODAL ===
  // Chuyển đổi Combo[] từ useBooking sang ComboModalItem[] cho ComboSelectionModal
  const combosForModal: ComboModalItem[] = (combosData || [])
    .map((combo) => {
      try {
        return {
          id: combo.id,
          name: combo.name,
          description: combo.description || undefined,
          price: typeof combo.price === "string" ? Number.parseFloat(combo.price) : combo.price,
          image: combo.image || null,
          items: (combo.combo_items || []).map(
            (ci): ComboModalFoodItem => ({
              food_id: ci.food.id,
              name: ci.food.name,
              price: typeof ci.food.price === "string" ? Number.parseFloat(ci.food.price) : ci.food.price,
              quantity: ci.quantity,
              image: ci.food.image || null,
              description: ci.food.description || undefined,
            }),
          ),
        }
      } catch (error) {
        console.error("Error mapping combo:", combo, error)
        return null
      }
    })
    .filter(Boolean) as ComboModalItem[]

  // Chuyển đổi SelectedComboItem[] từ useBooking sang ComboModalSelectedItem[] cho ComboSelectionModal
  const selectedCombosForModal: ComboModalSelectedItem[] = combos.map((selectedBookingCombo) => ({
    id: selectedBookingCombo.id,
    name: selectedBookingCombo.name,
    description: selectedBookingCombo.description || undefined,
    price: selectedBookingCombo.price,
    image: selectedBookingCombo.image || null,
    items: selectedBookingCombo.items.map(
      (item): ComboModalFoodItem => ({
        food_id: item.food_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || null,
        description: item.description || undefined,
      }),
    ),
    combo_id: selectedBookingCombo.combo_id,
    quantity: selectedBookingCombo.quantity,
  }))

  // === WRAPPER FUNCTIONS ===
  // Hàm wrapper để chuyển đổi FoodModalItem thành FoodItem (cho useBooking)
  const handleAddFoodWrapper = (modalFood: FoodModalItem) => {
    const bookingFood = {
      id: modalFood.id,
      name: modalFood.name,
      description: modalFood.description || null,
      price: modalFood.price,
      image: modalFood.image || null,
      category_id: modalFood.category_id,
      group_id: modalFood.group_id,
      jpName: modalFood.jpName,
      status: modalFood.status,
      created_at: modalFood.created_at,
      updated_at: modalFood.updated_at,
      category: modalFood.category,
    }
    handleAddFood(bookingFood)
  }

  // Hàm wrapper để chuyển đổi ComboModalItem thành Combo (cho useBooking)
  const handleAddComboWrapper = (modalCombo: ComboModalItem) => {
    const bookingCombo: Combo = {
      id: modalCombo.id,
      name: modalCombo.name,
      description: modalCombo.description || null,
      price: modalCombo.price.toString(),
      image: modalCombo.image || null,
      status: 1,
      combo_items: modalCombo.items.map((modalFoodItem) => ({
        id: 0,
        combo_id: modalCombo.id,
        food_id: modalFoodItem.food_id,
        quantity: modalFoodItem.quantity,
        food: {
          id: modalFoodItem.food_id,
          name: modalFoodItem.name,
          price: modalFoodItem.price.toString(),
          image: modalFoodItem.image || null,
          description: modalFoodItem.description || null,
          category_id: 0,
          group_id: null,
          jpName: null,
        },
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    handleAddCombo(bookingCombo)
  }

  // Tạo formData cho OrderSummary - KHÔNG transform payment_method
  const formDataForOrderSummary = {
    ...formData,
    // Đảm bảo payment_method được giữ nguyên
    payment_method: formData.payment_method as "cash" | "vnpay",
  }

  // Debug logs trước khi truyền props xuống OrderSummaryUpdated
  console.log("--- datban.tsx passing props to OrderSummaryUpdated ---")
  console.log("Passing selectedDate:", selectedDate)
  console.log("Passing selectedTime:", selectedTime)
  console.log("Passing formData.guest_count:", formData.guest_count)
  console.log("Passing selectedTable:", selectedTable)
  console.log("----------------------------------------------------")

  return (
    <div className="mx-auto py-[60px] sm:px-16 lg:px-24">
      <AnimatePresence>
        {notification.show && (
          <NotificationPopup
            message={notification.message}
            onClose={() => setNotification({ ...notification, show: false })}
            type={notification.type}
            show={notification.show}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Đặt Bàn Nhà Hàng</h1>
        <p className="text-gray-600">Chọn thời gian, bàn và món ăn bạn yêu thích</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <DateTimeSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            formData={formData}
            setFormData={setFormData}
            availableSlots={availableSlots}
            selectedTime={selectedTime}
            onTimeSelect={handleSelectTime}
            onFetchSlots={fetchAvailableSlots}
            today={today}
          />
          <CustomerInfoForm formData={formData} setFormData={setFormData} />
          <PaymentNotesForm formData={formData} setFormData={setFormData} />
        </div>

        <div className="space-y-6">
          <OrderSummaryUpdated
            userId={currentUserId}
            selectedTable={selectedTable}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            foods={foodsForOrderSummary}
            combos={combosForOrderSummary}
            formData={formDataForOrderSummary}
            depositAmount={0}
            onAddFood={() => {
              setShowFoodModal(true)
              fetchFoods()
            }}
            onAddCombo={() => {
              setShowComboModal(true)
              if (combosData.length === 0) {
                fetchCombos()
              }
            }}
            onSubmitOrder={submitOrder}
            isLoading={authLoading}
            getPaymentAmount={getPaymentAmount}
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            discountAmount={discountAmount}
            applyVoucherCode={applyVoucherCode}
            setNotification={setNotification}
          />
        </div>
      </div>

      <FoodSelectionModal
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        foods={foodsForModal}
        selectedFoods={selectedFoodsForModal}
        activeFoodCategory={activeFoodCategory}
        setActiveFoodCategory={setActiveFoodCategory}
        onAddFood={handleAddFoodWrapper}
        onRemoveFood={handleRemoveFood}
        onQuantityChange={handleFoodQuantityChange}
        totalPrice={selectedFoodsForModal.reduce((sum, food) => sum + food.price * food.quantity, 0)}
        isLoading={authLoading}
        categories={categoriesForModal}
      />

      <ComboSelectionModal
        isOpen={showComboModal}
        onClose={() => setShowComboModal(false)}
        combos={combosForModal}
        selectedCombos={selectedCombosForModal}
        onAddCombo={handleAddComboWrapper}
        onRemoveCombo={handleRemoveCombo}
        onQuantityChange={handleComboQuantityChange}
        totalPrice={selectedCombosForModal.reduce((sum, combo) => sum + combo.price * combo.quantity, 0)}
        isLoading={authLoading}
      />
    </div>
  )
}
