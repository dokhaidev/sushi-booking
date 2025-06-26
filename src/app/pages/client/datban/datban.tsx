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
import { useBooking } from "../../../hooks/useBooking";
import { useAuth } from "../../../context/authContext";

export default function DatBanPage() {
  const router = useRouter();
  const { user, isLoading, isInitialized } = useAuth();
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
    foodsData,
    orderId,
    showFoodModal,
    setShowFoodModal,
    activeFoodCategory,
    setActiveFoodCategory,
    depositAmount,
    showPaymentModal,
    setShowPaymentModal,
    paymentQRCode,
    paymentCompleted,
    notification,
    setNotification,
    today,

    // Functions
    fetchAvailableSlots,
    fetchFoods,
    handleSelectTime,
    submitOrder,
    handlePaymentComplete,
    handleAddFood,
    handleRemoveFood,
    handleFoodQuantityChange,
    getPaymentAmount,
  } = useBooking();

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (isInitialized && !user && !isLoading) {
      router.replace(`/dang-nhap?returnUrl=${encodeURIComponent("/dat-ban")}`);
    }
  }, [user, isLoading, isInitialized, router]);

  // Debug log
  useEffect(() => {
    console.log("DatBanPage mounted or updated");
    console.log("showPaymentModal:", showPaymentModal);
    console.log("paymentQRCode:", paymentQRCode);
    console.log("orderId:", orderId);
  }, [showPaymentModal, paymentQRCode, orderId]);

  // Hiển thị loading spinner khi chưa khởi tạo xong hoặc đang loading
  if (!isInitialized || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu đã khởi tạo xong và không có user thì không render gì
  // (sẽ được redirect trong useEffect)
  if (!user) {
    return null;
  }

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
            foods={foods}
            formData={formData}
            depositAmount={depositAmount}
            onAddFood={() => {
              setShowFoodModal(true);
              fetchFoods();
            }}
            onSubmitOrder={submitOrder}
            getPaymentAmount={getPaymentAmount}
            isLoading={isLoading}
          />
        </div>
      </div>

      <FoodSelectionModal
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        foods={foodsData}
        selectedFoods={foods}
        activeFoodCategory={activeFoodCategory}
        setActiveFoodCategory={setActiveFoodCategory}
        onAddFood={handleAddFood}
        onRemoveFood={handleRemoveFood}
        onQuantityChange={handleFoodQuantityChange}
        totalPrice={formData.total_price}
        isLoading={isLoading}
      />
    </div>
  );
}
