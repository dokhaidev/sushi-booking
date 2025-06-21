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
  const [foodsData, setFoodsData] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentQRCode, setPaymentQRCode] = useState<string>("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [activeFoodCategory, setActiveFoodCategory] = useState("all");
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "info",
    show: false,
  });

  const depositAmount = 200000;
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
    } catch (error) {
      showNotification("Lỗi khi kiểm tra bàn trống", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth");
      const response = await axios.get("http://127.0.0.1:8000/api/foods", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoodsData(response.data.data || []);
    } catch (error) {
      showNotification("Lỗi khi tải danh sách món ăn", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    const slot = availableSlots.find((s) => s.time === time);

    if (!slot || slot.tables.length === 0) {
      showNotification("Không có bàn trống trong khung giờ này", "error");
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
        `Không có bàn phù hợp cho ${formData.guest_count} khách.`,
        "error"
      );
    }
  };

  const submitOrder = async () => {
    if (!selectedTable) {
      showNotification("Vui lòng chọn bàn trước khi đặt", "error");
      return;
    }

    if (!formData.customer_name || !formData.customer_phone) {
      showNotification("Vui lòng nhập đầy đủ thông tin liên hệ", "error");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth");

      // B1: Tạo đơn hàng
      const response = await axios.post(
        "http://127.0.0.1:8000/api/orders/bookTables",
        {
          ...formData,
          table_id: selectedTable.table_id,
          deposit_amount: depositAmount,
          foods: foods.map((f) => ({
            food_id: f.food_id,
            quantity: f.quantity,
            price: f.price,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { order_id } = response.data;
      setOrderId(order_id);

      // B2: Tính số tiền cần thanh toán qua VNPay
      let amountToPay = depositAmount;

      if (formData.payment_method !== "cash" && formData.total_price > 0) {
        amountToPay = formData.total_price + depositAmount;
      }

      // B3: Gửi yêu cầu tạo link thanh toán VNPay
      const payRes = await axios.post(
        "http://127.0.0.1:8000/api/orders/vnpay-url",
        { order_id, amount: amountToPay },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payUrl = payRes.data?.data;

      if (payUrl) {
        window.location.href = payUrl;
      } else {
        showNotification("Không lấy được URL thanh toán VNPay", "error");
      }
    } catch (err: any) {
      console.error("Booking Error:", err);
      showNotification(
        err?.response?.data?.message || "Lỗi khi đặt bàn",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    setShowPaymentModal(false);
    showNotification("Thanh toán thành công!", "success");
  };

  const handleAddFood = (food: FoodItem) => {
    setFoods((prev) => {
      const existing = prev.find((f) => f.food_id === food.id);
      if (existing) {
        return prev.map((f) =>
          f.food_id === food.id ? { ...f, quantity: f.quantity + 1 } : f
        );
      }
      return [...prev, { ...food, food_id: food.id, quantity: 1 }];
    });
  };

  const handleRemoveFood = (id: number) => {
    setFoods((prev) => prev.filter((f) => f.food_id !== id));
  };

  const handleFoodQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return handleRemoveFood(id);
    setFoods((prev) =>
      prev.map((f) => (f.food_id === id ? { ...f, quantity } : f))
    );
  };

  const getPaymentAmount = () => {
    return formData.payment_method === "cash"
      ? depositAmount
      : formData.total_price + depositAmount;
  };

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
    const total = foods.reduce(
      (sum, food) => sum + food.price * food.quantity,
      0
    );
    setFormData((prev) => ({ ...prev, total_price: total }));
  }, [foods]);

  return {
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
    user,
    isLoading,
    isInitialized,

    fetchAvailableSlots,
    fetchFoods,
    handleSelectTime,
    submitOrder,
    handlePaymentComplete,
    handleAddFood,
    handleRemoveFood,
    handleFoodQuantityChange,
    getPaymentAmount,
  };
}
