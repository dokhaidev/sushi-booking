"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import NotificationPopup from "../../../components/layout/NotificationPopup";
import DateTimeSelector from "../../../components/ReservationPage/DateTimeSelector";
import CustomerInfoForm from "../../../components/ReservationPage/CustomerInfoForm";
import PaymentNotesForm from "../../../components/ReservationPage/PaymentNotesForm";
import OrderSummary from "../../../components/ReservationPage/OrderSummary";
import FoodSelectionModal from "../../../components/ReservationPage/FoodSelectionModal";
import PaymentModal from "../../../components/ReservationPage/PaymentModal";
import { useBooking } from "../../../hooks/useBooking";

export default function DatBanPage() {
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
    isLoading,
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
    user,
    loading,

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

  // Debug log khi component mount và khi các state quan trọng thay đổi
  useEffect(() => {
    console.log("DatBanPage mounted or updated");
    console.log("showPaymentModal:", showPaymentModal);
    console.log("paymentQRCode:", paymentQRCode);
    console.log("orderId:", orderId);
  }, [showPaymentModal, paymentQRCode, orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Vui lòng đăng nhập</h2>
          <button
            onClick={() => (window.location.href = "/dang-nhap")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
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
            isLoading={isLoading}
            getPaymentAmount={getPaymentAmount}
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

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentQRCode={paymentQRCode}
        depositAmount={depositAmount}
        orderId={orderId}
        paymentCompleted={paymentCompleted}
        onPaymentComplete={handlePaymentComplete}
        paymentMethod={formData.payment_method}
        totalAmount={getPaymentAmount()}
      />
    </div>
  );
}
