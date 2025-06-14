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
  const { user, isLoading: authLoading } = useAuth();

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
  const [isLoading, setIsLoading] = useState(false);
  const [foodsData, setFoodsData] = useState<FoodItem[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [activeFoodCategory, setActiveFoodCategory] = useState<string>("all");
  const [depositAmount] = useState(200000);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentQRCode, setPaymentQRCode] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "info",
    show: false,
  });

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

    setIsLoading(true);
    try {
      const token = localStorage.getItem("auth");
      const response = await axios.post<{ available_slots: TimeSlot[] }>(
        "http://127.0.0.1:8000/api/tables/DateTime",
        { reservation_date: selectedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvailableSlots(response.data.available_slots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
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
      console.error("Error fetching foods:", error);
      showNotification("Lỗi khi tải danh sách món ăn", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    const selectedSlot = availableSlots.find((slot) => slot.time === time);

    if (!selectedSlot || selectedSlot.tables.length === 0) {
      showNotification("Không có bàn trống trong khung giờ này", "error");
      return;
    }

    const suitableTables = selectedSlot.tables
      .filter((table) => table.max_guests >= formData.guest_count)
      .sort((a, b) => a.max_guests - b.max_guests);

    if (suitableTables.length > 0) {
      setSelectedTable(suitableTables[0]);
      setFormData((prev) => ({
        ...prev,
        reservation_date: selectedDate,
        reservation_time: time.length === 5 ? `${time}:00` : time,
      }));
    } else {
      showNotification(
        `Không có bàn phù hợp cho ${formData.guest_count} khách. Vui lòng chọn khung giờ khác hoặc điều chỉnh số lượng khách.`,
        "error"
      );
    }
  };

  const generateQRCode = (
    orderId: number,
    amount: number,
    paymentType: string
  ) => {
    // Tạo QR code với thông tin thanh toán
    const prefix = paymentType === "cash" ? "COC" : "FULL";
    const qrImage = `https://api.vietqr.io/image/970422-0367438455-mlaoiwq.jpg?accountName=HUYNH%20PHAN%20DO%20KHAI&amount=${amount}&addInfo=${prefix}%20${orderId}`;

    console.log("QR Code URL:", qrImage);
    return qrImage;
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

    setIsLoading(true);

    try {
      const token = localStorage.getItem("auth");
      const hasFoods = foods.length > 0;

      const payload = {
        ...formData,
        table_id: selectedTable?.table_id,
        deposit_amount: depositAmount,
        foods: hasFoods
          ? foods.map((food) => ({
              food_id: food.food_id,
              quantity: food.quantity,
              price: food.price,
            }))
          : [],
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/orders/bookTables",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      const { message, order_id } = response.data;

      if (response.status === 200 && order_id) {
        setOrderId(order_id);
        console.log("Order ID set:", order_id);

        // Xác định số tiền cần thanh toán dựa trên phương thức
        let amountToPay = 0;
        let paymentMessage = "";

        if (formData.payment_method === "cash") {
          // Tiền mặt: chỉ thanh toán cọc
          amountToPay = depositAmount;
          paymentMessage = `Đặt bàn thành công! Vui lòng thanh toán cọc ${amountToPay.toLocaleString()} VNĐ`;
        } else if (
          formData.payment_method === "momo" ||
          formData.payment_method === "bank"
        ) {
          // Momo/Bank: thanh toán toàn bộ
          amountToPay = formData.total_price + depositAmount;
          paymentMessage = `Đặt bàn thành công! Vui lòng thanh toán toàn bộ ${amountToPay.toLocaleString()} VNĐ`;
        }

        console.log("Amount to pay:", amountToPay);
        console.log("Payment method:", formData.payment_method);

        // Tạo QR code và hiển thị modal thanh toán
        const qrCode = generateQRCode(
          order_id,
          amountToPay,
          formData.payment_method
        );
        setPaymentQRCode(qrCode);
        console.log("Payment QR Code set:", qrCode);

        // Hiển thị modal thanh toán
        setShowPaymentModal(true);
        console.log("Payment modal shown");

        // Hiển thị thông báo
        showNotification(paymentMessage, "success");
        setShowSuccess(true);
      } else {
        showNotification(message || "Đặt bàn không thành công", "error");
      }
    } catch (error: any) {
      console.error("Lỗi khi gửi đơn đặt:", error);
      showNotification(
        error?.response?.data?.message || "Lỗi khi gửi yêu cầu đặt bàn",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    showNotification(
      "Thanh toán thành công! Chúng tôi đã gửi xác nhận qua SMS",
      "success"
    );
    setTimeout(() => {
      setShowPaymentModal(false);
    }, 2000);
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
          food_id: food.id,
          name: food.name,
          quantity: 1,
          price: food.price,
          image: food.image,
        },
      ];
    });
  };

  const handleRemoveFood = (foodId: number) => {
    setFoods((prev) => prev.filter((food) => food.food_id !== foodId));
  };

  const handleFoodQuantityChange = (foodId: number, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFood(foodId);
      return;
    }
    setFoods((prev) =>
      prev.map((food) =>
        food.food_id === foodId ? { ...food, quantity } : food
      )
    );
  };

  // Effects
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customer_id: Number(user.id),
        customer_name: user.name || "",
        customer_phone: user.phone ? String(user.phone) : "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/dang-nhap");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const total = foods.reduce(
      (sum, food) => sum + food.price * food.quantity,
      0
    );
    setFormData((prev) => ({ ...prev, total_price: total }));
  }, [foods]);

  const getPaymentAmount = () => {
    if (formData.payment_method === "cash") {
      return depositAmount; // Chỉ cọc
    } else {
      return formData.total_price + depositAmount; // Toàn bộ
    }
  };

  // Debug function
  const debugPayment = () => {
    console.log("=== DEBUG PAYMENT ===");
    console.log("Foods:", foods);
    console.log("Payment method:", formData.payment_method);
    console.log("Total price:", formData.total_price);
    console.log("Deposit amount:", depositAmount);
    console.log("Payment amount:", getPaymentAmount());
    console.log("Order ID:", orderId);
    console.log("Payment QR Code:", paymentQRCode);
    console.log("Show Payment Modal:", showPaymentModal);
    console.log("====================");
  };

  return {
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
    showSuccess,
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
    authLoading,

    // Functions
    showNotification,
    fetchAvailableSlots,
    fetchFoods,
    handleSelectTime,
    submitOrder,
    handlePaymentComplete,
    handleAddFood,
    handleRemoveFood,
    handleFoodQuantityChange,
    getPaymentAmount,
    debugPayment,
  };
}
