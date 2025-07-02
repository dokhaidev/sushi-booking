"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationPopup from "../../../components/layout/NotificationPopup";
import DateTimeSelector from "../../../components/ReservationPage/DateTimeSelector";
import CustomerInfoForm from "../../../components/ReservationPage/CustomerInfoForm";
import PaymentNotesForm from "../../../components/ReservationPage/PaymentNotesForm";
import OrderSummary from "../../../components/ReservationPage/OrderSummary";
import FoodSelectionModal from "../../../components/ReservationPage/FoodSelectionModal";
import ComboSelectionModal from "../../../components/ReservationPage/ComboSelectionModal";
import { useBooking } from "../../../hooks/useBooking";
import { useAuth } from "../../../context/authContext";
import {
  SelectedFoodItem,
  ComboItem,
  SelectedComboItem,
  FoodItem,
} from "../../../types/booking";

export default function DatBanPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isInitialized } = useAuth();
  const {
    // State
    selectedDate,
    setSelectedDate,
    availableSlots,
    selectedTime,
    selectedTable,
    formData,
    setFormData,
    foods,
    combos,
    foodsData,
    combosData,
    orderId,
    showFoodModal,
    setShowFoodModal,
    showComboModal,
    setShowComboModal,
    activeFoodCategory,
    setActiveFoodCategory,
    activeComboCategory,
    setActiveComboCategory,
    depositAmount,
    showPaymentModal,
    setShowPaymentModal,
    paymentQRCode,
    paymentCompleted,
    notification,
    setNotification,
    today,
    voucherCode,
    setVoucherCode,
    discountAmount,

    // Functions
    fetchAvailableSlots,
    fetchFoods,
    fetchCombos,
    handleSelectTime,
    submitOrder,
    handlePaymentComplete,
    handleAddFood,
    handleRemoveFood,
    handleFoodQuantityChange,
    handleAddCombo,
    handleRemoveCombo,
    handleComboQuantityChange,
    getPaymentAmount,
    applyVoucherCode,
  } = useBooking();

  // Redirect if not authenticated
  useEffect(() => {
    if (isInitialized && !user && !authLoading) {
      router.replace(`/dang-nhap?returnUrl=${encodeURIComponent("/dat-ban")}`);
    }
  }, [user, authLoading, isInitialized, router]);

  if (!isInitialized || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Fix: Handle null/undefined image values and normalize combo data structure
  const normalizedCombosData: ComboItem[] = combosData.map((combo) => ({
    id: combo.id,
    name: combo.name,
    description: combo.description,
    price: parseFloat(combo.price), // Convert string to number
    image: combo.image ?? undefined, // Convert null to undefined
    items: combo.combo_items.map((item) => ({
      food_id: item.food_id,
      name: item.food.name,
      price: item.food.price,
      quantity: item.quantity,
    })),
  }));

  // Chuyển đổi foods sang SelectedFoodItem (thêm id property)
  const normalizedFoods: SelectedFoodItem[] = foods.map((food) => ({
    id: food.food_id, // Add missing id property
    food_id: food.food_id,
    name: food.name,
    price: food.price,
    quantity: food.quantity,
    image: food.image,
  }));

  // Fix: Handle null/undefined image values in combos
  const normalizedCombos: SelectedComboItem[] = combos.map((combo) => ({
    combo_id: combo.combo_id,
    id: combo.id,
    name: combo.name,
    price:
      typeof combo.price === "string" ? parseFloat(combo.price) : combo.price, // Ensure number type
    quantity: combo.quantity,
    items: combo.items.map((item) => ({
      food_id: item.food_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    image: combo.image ?? undefined, // Convert null to undefined
    description: combo.description,
  }));

  // Wrapper function để xử lý type mismatch cho FoodItem
  const handleAddFoodWrapper = (food: FoodItem) => {
    // Chuyển đổi FoodItem từ component sang format mà hook expect
    const normalizedFood: FoodItem = {
      ...food,
      category:
        typeof food.category === "object" && food.category !== null
          ? food.category.name
          : food.category,
    };
    handleAddFood(normalizedFood);
  };

  // Fix: Create a proper wrapper that matches the expected ComboItem type from the modal
  const handleAddComboWrapper = (combo: ComboItem) => {
    // Create a proper Combo object that matches the hook's expected structure
    const normalizedCombo = {
      id: combo.id,
      name: combo.name,
      image: combo.image ?? null, // Handle undefined by converting to null
      description: combo.description || "",
      price: combo.price.toString(), // Convert number back to string for hook
      status: 1, // Default active status
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      combo_items: combo.items.map((item) => ({
        id: 0, // Placeholder id
        combo_id: combo.id,
        food_id: item.food_id,
        quantity: item.quantity,
        food: {
          id: item.food_id,
          name: item.name,
          price: item.price,
        },
      })),
    };
    handleAddCombo(normalizedCombo);
  };

  const remainingCashPayment = Math.max(
    (formData.total_price || 0) - depositAmount,
    0
  );

  return (
    <div className="container mx-auto py-[60px] sm:px-16 lg:px-24">
      <AnimatePresence>
        {notification.show && (
          <NotificationPopup
            message={notification.message}
            onClose={() =>
              setNotification((prev) => ({ ...prev, show: false }))
            }
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Đặt Bàn Nhà Hàng
        </h1>
        <p className="text-gray-600">
          Chọn thời gian, bàn và món ăn bạn yêu thích
        </p>
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
          <OrderSummary
            selectedTable={selectedTable}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            foods={normalizedFoods}
            combos={normalizedCombos}
            formData={formData}
            depositAmount={depositAmount}
            onAddFood={() => {
              setShowFoodModal(true);
              fetchFoods();
            }}
            onAddCombo={() => {
              setShowComboModal(true);
              fetchCombos();
            }}
            onSubmitOrder={submitOrder}
            isLoading={authLoading}
            getPaymentAmount={getPaymentAmount}
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            discountAmount={discountAmount}
            applyVoucherCode={applyVoucherCode}
          />
        </div>
      </div>

      <FoodSelectionModal
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        foods={foodsData}
        selectedFoods={normalizedFoods}
        activeFoodCategory={activeFoodCategory}
        setActiveFoodCategory={setActiveFoodCategory}
        onAddFood={handleAddFoodWrapper} // Use wrapper function
        onRemoveFood={handleRemoveFood}
        onQuantityChange={handleFoodQuantityChange}
        totalPrice={normalizedFoods.reduce(
          (sum, food) => sum + food.price * food.quantity,
          0
        )}
        isLoading={authLoading}
      />

      <ComboSelectionModal
        isOpen={showComboModal}
        onClose={() => setShowComboModal(false)}
        combos={normalizedCombosData}
        selectedCombos={normalizedCombos}
        onAddCombo={handleAddComboWrapper} // Use wrapper function
        onRemoveCombo={handleRemoveCombo}
        onQuantityChange={handleComboQuantityChange}
        totalPrice={normalizedCombos.reduce(
          (sum, combo) => sum + combo.price * combo.quantity,
          0
        )}
        isLoading={authLoading}
      />
    </div>
  );
}
