"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import type {
  Table,
  TimeSlot,
  FoodItem,
  SelectedFoodItem,
  BookingFormData,
  NotificationState,
  Combo,
  SelectedComboItem,
} from "../types/booking";

export function useBooking() {
  const router = useRouter();
  const { user, isLoading: authLoading, isInitialized } = useAuth();

  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    customer_id: 0,
    guest_count: 1,
    reservation_date: "",
    reservation_time: "",
    payment_method: "cash",
    total_price: 0,
    note: "",
    customer_name: "",
    customer_phone: "",
  });

  const [foods, setFoods] = useState<SelectedFoodItem[]>([]);
  const [combos, setCombos] = useState<SelectedComboItem[]>([]);
  const [foodsData, setFoodsData] = useState<FoodItem[]>([]);
  const [combosData, setCombosData] = useState<Combo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showComboModal, setShowComboModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentQRCode, setPaymentQRCode] = useState<string>("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [activeFoodCategory, setActiveFoodCategory] = useState("all");
  const [activeComboCategory, setActiveComboCategory] = useState("all");
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "info",
    show: false,
  });

  const [voucherCode, setVoucherCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const calculateDepositAmount = () => {
    return formData.guest_count >= 8 ? 200000 : 0;
  };

  const depositAmount = calculateDepositAmount();

  const updateOrderStatus = async (orderId: number) => {
    try {
      const token = localStorage.getItem("auth");
      const res = await axios.put(
        `http://127.0.0.1:8000/api/order/update-status/${orderId}`,
        { status: "success" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(
        res.data.message || "Cập nhật đơn hàng thành công",
        "success"
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái đơn hàng:", err);
      showNotification("Không thể cập nhật trạng thái đơn hàng", "error");
    }
  };

  const handlePaymentComplete = async () => {
    setPaymentCompleted(true);
    setShowPaymentModal(false);
    showNotification("Thanh toán thành công!", "success");

    if (orderId) {
      await updateOrderStatus(orderId);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate) {
      showNotification("Vui lòng chọn ngày đặt bàn", "error");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/tables/DateTime",
        { reservation_date: selectedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvailableSlots(response.data.available_slots || []);
    } catch {
      showNotification("Lỗi khi kiểm tra bàn trống", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth");
      const res = await axios.get("http://127.0.0.1:8000/api/foods", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoodsData(res.data.data || []);
    } catch {
      showNotification("Lỗi khi tải danh sách món ăn", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCombos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth");
      const res = await axios.get("http://127.0.0.1:8000/api/combos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCombosData(res.data || []);
    } catch {
      showNotification("Lỗi khi tải danh sách combo", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const applyVoucherCode = async () => {
    if (!voucherCode) {
      showNotification("Vui lòng nhập mã giảm giá", "error");
      return;
    }

    try {
      const token = localStorage.getItem("auth");
      const res = await axios.post(
        "http://127.0.0.1:8000/api/applyVoucher",
        {
          code: voucherCode,
          total: formData.total_price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { new_total, message } = res.data;
      const discount = formData.total_price - new_total;

      if (discount > 0) {
        setDiscountAmount(discount);
        showNotification(message || "Áp dụng mã thành công!", "success");
      } else {
        setDiscountAmount(0);
        showNotification("Mã không hợp lệ hoặc hết hạn", "error");
      }
    } catch {
      setDiscountAmount(0);
      showNotification("Lỗi khi áp dụng mã giảm giá", "error");
    }
  };

  const submitOrder = async () => {
    if (!selectedTable) {
      showNotification("Vui lòng chọn bàn", "error");
      return;
    }

    if (!formData.customer_name || !formData.customer_phone) {
      showNotification("Vui lòng nhập thông tin liên hệ", "error");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth");

      const finalTotal = Math.max(formData.total_price - discountAmount, 0);
      const deposit = calculateDepositAmount();
      const remainingPayment =
        formData.payment_method === "cash"
          ? Math.max(finalTotal - deposit, 0)
          : 0;

      const payAmount =
        formData.payment_method === "cash" ? deposit : finalTotal + deposit;

      const res = await axios.post(
        "http://127.0.0.1:8000/api/orders/bookTables",
        {
          ...formData,
          total_price: finalTotal,
          deposit_amount: deposit,
          remaining_payment: remainingPayment,
          table_id: selectedTable.table_id,
          voucher_code: voucherCode || null,
          foods: foods.map((f) => ({
            food_id: f.food_id,
            quantity: f.quantity,
            price: f.price,
          })),
          combos: combos.map((c) => ({
            combo_id: c.combo_id,
            quantity: c.quantity,
            price: c.price,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const order_id = res.data.order_id;
      setOrderId(order_id);

      const shouldRedirectToVNPAY =
        formData.payment_method === "vnpay" || formData.guest_count >= 8;

      if (shouldRedirectToVNPAY) {
        const payRes = await axios.post(
          "http://127.0.0.1:8000/api/orders/vnpay-url",
          { order_id, amount: payAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const payUrl = payRes.data?.data;
        if (payUrl) {
          window.location.href = payUrl;
        } else {
          showNotification("Không lấy được link thanh toán", "error");
        }
      } else {
        showNotification(
          "Đặt bàn thành công! Vui lòng thanh toán tại nhà hàng.",
          "success"
        );
        await updateOrderStatus(order_id); // ✅ tích điểm luôn
        router.push("/");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      showNotification(
        err?.response?.data?.message || "Lỗi khi đặt bàn",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    const slot = availableSlots.find((s) => s.time === time);
    if (!slot || slot.tables.length === 0) {
      showNotification("Không có bàn trống khung giờ này", "error");
      return;
    }

    const suitable = slot.tables
      .filter((t) => t.max_guests >= formData.guest_count)
      .sort((a, b) => a.max_guests - b.max_guests);

    if (suitable.length > 0) {
      setSelectedTable(suitable[0]);
      setFormData((prev) => ({
        ...prev,
        reservation_date: selectedDate,
        reservation_time: time.length === 5 ? `${time}:00` : time,
      }));
    } else {
      showNotification(
        `Không có bàn phù hợp cho ${formData.guest_count} khách`,
        "error"
      );
    }
  };

  const handleAddFood = (food: FoodItem) => {
    setFoods((prev) => {
      const existing = prev.find((f) => f.food_id === food.id);
      if (existing) {
        return prev.map((f) =>
          f.food_id === food.id ? { ...f, quantity: f.quantity + 1 } : f
        );
      }
      return [
        ...prev,
        {
          id: food.id,
          food_id: food.id,
          name: food.name,
          price: food.price,
          quantity: 1,
          image: food.image,
        },
      ];
    });
  };

  const handleRemoveFood = (id: number) =>
    setFoods((prev) => prev.filter((f) => f.food_id !== id));

  const handleFoodQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return handleRemoveFood(id);
    setFoods((prev) =>
      prev.map((f) => (f.food_id === id ? { ...f, quantity } : f))
    );
  };

  const handleAddCombo = (combo: Combo) => {
    setCombos((prev) => {
      const existing = prev.find((c) => c.combo_id === combo.id);
      if (existing) {
        return prev.map((c) =>
          c.combo_id === combo.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: combo.id,
          combo_id: combo.id,
          name: combo.name,
          quantity: 1,
          price: parseFloat(combo.price),
          image: combo.image,
          description: combo.description,
          items: combo.combo_items.map((item) => ({
            food_id: item.food.id,
            name: item.food.name,
            price: item.food.price,
            quantity: item.quantity,
          })),
        },
      ];
    });
  };

  const handleRemoveCombo = (id: number) =>
    setCombos((prev) => prev.filter((c) => c.combo_id !== id));

  const handleComboQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return handleRemoveCombo(id);
    setCombos((prev) =>
      prev.map((c) => (c.combo_id === id ? { ...c, quantity } : c))
    );
  };

  const getPaymentAmount = () => {
    const finalTotal = Math.max(formData.total_price - discountAmount, 0);
    const deposit = calculateDepositAmount();

    return formData.payment_method === "vnpay" ? finalTotal : deposit;
  };

  const remainingCashPayment =
    formData.payment_method === "cash"
      ? Math.max(formData.total_price - discountAmount - depositAmount, 0)
      : 0;

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customer_id: +user.id,
        customer_name: user.name || "",
        customer_phone: user.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user && isInitialized) {
      router.push("/dang-nhap");
    }
  }, [authLoading, user, isInitialized]);

  useEffect(() => {
    const foodTotal = foods.reduce(
      (sum, food) => sum + food.price * food.quantity,
      0
    );
    const comboTotal = combos.reduce(
      (sum, combo) => sum + combo.price * combo.quantity,
      0
    );
    setFormData((prev) => ({ ...prev, total_price: foodTotal + comboTotal }));
  }, [foods, combos]);

  return {
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
    user,
    isLoading,
    isInitialized,
    voucherCode,
    setVoucherCode,
    discountAmount,
    applyVoucherCode,
    fetchAvailableSlots,
    fetchFoods,
    fetchCombos,
    handleSelectTime,
    getPaymentAmount,
    remainingCashPayment,
    submitOrder,
    handlePaymentComplete,
    handleAddFood,
    handleRemoveFood,
    handleFoodQuantityChange,
    handleAddCombo,
    handleRemoveCombo,
    handleComboQuantityChange,
  };
}
