"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/authContext"
import type {
  Table,
  TimeSlot,
  FoodItem,
  SelectedFoodItem,
  BookingFormData,
  NotificationState,
  Combo,
  SelectedComboItem,
  Category,
} from "../types/booking"

// Hàm trợ giúp để đọc dữ liệu đặt bàn từ localStorage khi khởi tạo hook
const getInitialBookingData = () => {
  let initialGuestCount = 1
  let initialReservationDate = new Date().toISOString().split("T")[0]
  let initialReservationTime = ""
  let initialFoods: SelectedFoodItem[] = []
  let initialCombos: SelectedComboItem[] = []

  const savedBookingInfo = localStorage.getItem("booking_info")
  const savedFoods = localStorage.getItem("bookingFoods")
  const savedCombos = localStorage.getItem("bookingCombos")

  if (savedBookingInfo) {
    try {
      const parsed = JSON.parse(savedBookingInfo)
      console.log("useBooking: Loaded initial booking info from localStorage:", parsed)
      if (parsed.guest_count !== undefined) {
        initialGuestCount = Math.max(1, Math.min(20, Number(parsed.guest_count)))
      }
      if (parsed.date) {
        initialReservationDate = parsed.date
      }
      if (parsed.time) {
        initialReservationTime = parsed.time
      }
    } catch (e) {
      console.error("Failed to parse saved booking info from localStorage for useBooking:", e)
      localStorage.removeItem("booking_info")
    }
  }

  if (savedFoods) {
    try {
      initialFoods = JSON.parse(savedFoods)
      console.log("useBooking: Loaded initial foods from localStorage:", initialFoods)
    } catch (e) {
      console.error("Failed to parse saved booking foods from localStorage:", e)
      localStorage.removeItem("bookingFoods")
    }
  }

  if (savedCombos) {
    try {
      initialCombos = JSON.parse(savedCombos)
      console.log("useBooking: Loaded initial combos from localStorage:", initialCombos)
    } catch (e) {
      console.error("Failed to parse saved booking combos from localStorage:", e)
      localStorage.removeItem("bookingCombos")
    }
  }

  return {
    guest_count: initialGuestCount,
    reservation_date: initialReservationDate,
    reservation_time: initialReservationTime,
    foods: initialFoods,
    combos: initialCombos,
  }
}

// Hàm helper để kiểm tra xem một time slot có phù hợp với số lượng khách không
const isTimeSlotSuitableForGuests = (slot: TimeSlot, guestCount: number): boolean => {
  if (!slot.tables || slot.tables.length === 0) return false

  // Nếu số khách <= 12, chỉ cần 1 bàn
  if (guestCount <= 12) {
    return slot.tables.some(table => table.max_guests >= guestCount)
  }

  // Nếu số khách > 12, cần tìm 2 bàn có thể chứa đủ
  const sortedTables = [...slot.tables].sort((a, b) => b.max_guests - a.max_guests)
  
  for (let i = 0; i < sortedTables.length; i++) {
    for (let j = i + 1; j < sortedTables.length; j++) {
      const totalCapacity = sortedTables[i].max_guests + sortedTables[j].max_guests
      if (totalCapacity >= guestCount) {
        return true
      }
    }
  }

  return false
}

export function useBooking() {
  const router = useRouter()
  const { user, isLoading: authLoading, isInitialized } = useAuth()

  // Lấy dữ liệu khởi tạo từ localStorage
  const initialData = getInitialBookingData()

  const [selectedDate, setSelectedDate] = useState(initialData.reservation_date)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState(initialData.reservation_time)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [formData, setFormDataState] = useState<BookingFormData>({
    customer_id: 0,
    guest_count: initialData.guest_count,
    reservation_date: initialData.reservation_date,
    reservation_time: initialData.reservation_time,
    payment_method: "cash",
    total_price: 0,
    note: "",
    customer_name: "",
    customer_phone: "",
  })

  const [foods, setFoods] = useState<SelectedFoodItem[]>(initialData.foods)
  const [combos, setCombos] = useState<SelectedComboItem[]>(initialData.combos)
  const [foodsData, setFoodsData] = useState<FoodItem[]>([])
  const [combosData, setCombosData] = useState<Combo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [voucherId, setVoucherId] = useState<number | null>(null)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [showFoodModal, setShowFoodModal] = useState(false)
  const [showComboModal, setShowComboModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentQRCode, setPaymentQRCode] = useState<string>("")
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [activeFoodCategory, setActiveFoodCategory] = useState("all")
  const [activeComboCategory, setActiveComboCategory] = useState("all")
  const [userVouchers, setUserVouchers] = useState<string[]>([])
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "info",
    show: false,
  })
  const [voucherCode, setVoucherCode] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)

  const userIdRef = useRef<string | number | null>(null)
  const hasInitializedRef = useRef(false)
  const today = new Date().toISOString().split("T")[0]

  // ✅ NEW: Computed property để lọc các time slots phù hợp
  const filteredAvailableSlots = availableSlots.filter(slot => 
    isTimeSlotSuitableForGuests(slot, formData.guest_count)
  )

  // Reset booking data function
  const resetBookingData = useCallback(() => {
    console.log("Resetting booking data...")
    setFoods([])
    setCombos([])
    setFormDataState((prev) => ({
      ...prev,
      guest_count: 1,
      reservation_date: new Date().toISOString().split("T")[0],
      reservation_time: "",
      payment_method: "cash",
      total_price: 0,
      note: "",
    }))

    setSelectedDate(new Date().toISOString().split("T")[0])
    setSelectedTime("")
    setSelectedTable(null)
    setAvailableSlots([])
    setVoucherId(null)
    setOrderId(null)
    setVoucherCode("")
    setDiscountAmount(0)
    setActiveFoodCategory("all")
    setActiveComboCategory("all")

    localStorage.removeItem("bookingFoods")
    localStorage.removeItem("bookingCombos")
    localStorage.removeItem("booking_info")
    console.log("Booking data reset completed")
  }, [])

  const setFormData = useCallback((newFormData: BookingFormData | ((prev: BookingFormData) => BookingFormData)) => {
    console.log("=== useBooking setFormData Debug ===")
    if (typeof newFormData === "function") {
      setFormDataState((prev) => {
        const result = newFormData(prev)
        console.log("Current formData:", prev)
        console.log("New formData (from function):", result)
        console.log("payment_method changing from", prev.payment_method, "to", result.payment_method)
        return result
      })
    } else {
      setFormDataState((prev) => {
        console.log("Current formData:", prev)
        console.log("New formData (direct):", newFormData)
        console.log("payment_method changing from", prev.payment_method, "to", newFormData.payment_method)
        return newFormData
      })
    }
  }, [])

  const showNotification = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type, show: true })
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("auth")
      const res = await axios.get("http://127.0.0.1:8000/api/category", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCategories(res.data || [])
    } catch (error: any) {
      console.error("Error fetching categories:", error)
      setCategories([])
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        showNotification("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error")
        router.push("/dang-nhap")
      } else if (axios.isAxiosError(error) && error.code === "NETWORK_ERROR") {
        showNotification("Lỗi mạng khi tải danh mục. Vui lòng kiểm tra kết nối internet.", "error")
      } else {
        showNotification("Lỗi khi tải danh mục", "error")
      }
    } finally {
      setIsLoading(false)
    }
  }, [showNotification, router])

  const fetchUserVouchers = useCallback(
    async (userId: number) => {
      if (isLoading || userIdRef.current === userId) return

      try {
        userIdRef.current = userId
        setIsLoading(true)
        const token = localStorage.getItem("auth")
        const res = await axios.get(`http://127.0.0.1:8000/api/getAllVoucherByUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = Array.isArray(res.data) ? res.data : res.data.data
        if (Array.isArray(data)) {
          setUserVouchers(data)
        } else {
          console.error("Voucher response is not an array:", res.data)
          setUserVouchers([])
        }
      } catch (error: any) {
        console.error("Error fetching vouchers:", error)
        setUserVouchers([])
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          showNotification("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error")
          router.push("/dang-nhap")
        } else if (axios.isAxiosError(error) && error.code === "NETWORK_ERROR") {
          showNotification("Lỗi mạng khi tải voucher. Vui lòng kiểm tra kết nối internet hoặc thử lại sau.", "error")
        } else {
          showNotification("Lỗi khi tải voucher", "error")
        }
      } finally {
        setIsLoading(false)
      }
    },
    [showNotification, router, isLoading],
  )

  const calculateDepositAmount = useCallback(() => {
    return formData.guest_count > 12 ? 200000 : 0
  }, [formData.guest_count])

  const depositAmount = calculateDepositAmount()

  const handlePaymentComplete = useCallback(() => {
    setPaymentCompleted(true)
    setShowPaymentModal(false)
    showNotification("Thanh toán thành công!", "success")
  }, [showNotification])

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDate) {
      showNotification("Vui lòng chọn ngày đặt bàn", "error")
      return
    }
    try {
      setIsLoading(true)
      const token = localStorage.getItem("auth")
      const response = await axios.post(
        "http://127.0.0.1:8000/api/tables/DateTime",
        { reservation_date: selectedDate },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setAvailableSlots(response.data.available_slots || [])
    } catch (error: any) {
      console.error("Error fetching available slots:", error)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        showNotification("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error")
        router.push("/dang-nhap")
      } else if (axios.isAxiosError(error) && error.code === "NETWORK_ERROR") {
        showNotification("Lỗi mạng khi kiểm tra bàn. Vui lòng kiểm tra kết nối internet.", "error")
      } else {
        showNotification("Lỗi khi kiểm tra bàn", "error")
      }
    } finally {
      setIsLoading(false)
    }
  }, [selectedDate, showNotification, router])

  const fetchFoods = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("auth")
      const res = await axios.get("http://127.0.0.1:8000/api/foods", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const foodsWithCategories = res.data.data.map((food: FoodItem) => {
        const category = categories.find((cat) => cat.id === food.category_id)
        return {
          ...food,
          category: category || null,
          price: typeof food.price === "string" ? Number.parseFloat(food.price) : food.price || 0,
        }
      })
      setFoodsData(foodsWithCategories || [])
    } catch (error: any) {
      console.error("Error fetching foods:", error)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        showNotification("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error")
        router.push("/dang-nhap")
      } else if (axios.isAxiosError(error) && error.code === "NETWORK_ERROR") {
        showNotification("Lỗi mạng khi tải danh sách món ăn. Vui lòng kiểm tra kết nối internet.", "error")
      } else {
        showNotification("Lỗi khi tải danh sách món ăn", "error")
      }
    } finally {
      setIsLoading(false)
    }
  }, [categories, showNotification, router])

  const fetchCombos = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("auth")
      const res = await axios.get("http://127.0.0.1:8000/api/combos", {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("fetchCombos response:", res.data)
      let combosData = []
      if (res.data?.data && Array.isArray(res.data.data)) {
        combosData = res.data.data
      } else if (Array.isArray(res.data)) {
        combosData = res.data
      }

      const combosWithParsedPrices = combosData.map((combo: Combo) => ({
        ...combo,
        price: typeof combo.price === "string" ? Number.parseFloat(combo.price) : combo.price,
        combo_items:
          combo.combo_items?.map((item) => ({
            ...item,
            food: {
              ...item.food,
              price: typeof item.food.price === "string" ? Number.parseFloat(item.food.price) : item.food.price,
            },
          })) || [],
      }))

      setCombosData(combosWithParsedPrices)
      console.log("useBooking: fetchCombos successful, combosData:", combosWithParsedPrices)
    } catch (error: any) {
      console.error("Error fetching combos:", error)
      setCombosData([])
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        showNotification("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error")
        router.push("/dang-nhap")
      } else if (axios.isAxiosError(error) && error.code === "NETWORK_ERROR") {
        showNotification("Lỗi mạng khi tải danh sách combo. Vui lòng kiểm tra kết nối internet.", "error")
      } else {
        showNotification("Lỗi khi tải danh sách combo", "error")
      }
    } finally {
      setIsLoading(false)
    }
  }, [showNotification, router])

  const applyVoucherCode = useCallback(async () => {
    if (!voucherCode) {
      showNotification("Vui lòng nhập mã giảm giá", "error")
      return
    }

    if (!user) {
      showNotification("Vui lòng đăng nhập để sử dụng mã giảm giá", "error")
      return
    }

    const currentOriginalTotal =
      foods.reduce((sum, food) => sum + food.price * food.quantity, 0) +
      combos.reduce((sum, combo) => sum + combo.price * combo.quantity, 0)

    try {
      setIsLoading(true)
      const token = localStorage.getItem("auth")
      const res = await axios.post(
        "http://127.0.0.1:8000/api/applyVoucher",
        {
          code: voucherCode,
          customer: user.id,
          total: currentOriginalTotal,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      const { discount, message, voucher } = res.data
      if (discount > 0) {
        setDiscountAmount(discount)
        setVoucherId(voucher?.id || null)
        showNotification(message || "Áp dụng mã giảm giá thành công!", "success")
      } else {
        setDiscountAmount(0)
        setVoucherId(null)
        showNotification("Mã giảm giá không hợp lệ hoặc đã hết hạn", "error")
      }
    } catch (err: any) {
      console.error("Voucher error:", err)
      setDiscountAmount(0)
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        showNotification("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error")
        router.push("/dang-nhap")
      } else if (axios.isAxiosError(err) && err.code === "NETWORK_ERROR") {
        showNotification("Lỗi mạng khi áp dụng mã giảm giá. Vui lòng kiểm tra kết nối internet.", "error")
      } else {
        showNotification(err?.response?.data?.message || "Lỗi khi áp dụng mã giảm giá", "error")
      }
    } finally {
      setIsLoading(false)
    }
  }, [voucherCode, user, foods, combos, showNotification, router])

  // ✅ FIX CHÍNH: Cải thiện submitOrder function
  const submitOrder = useCallback(async (): Promise<boolean> => {
    console.log("=== SUBMIT ORDER DEBUG ===")
    console.log("submitOrder called with payment_method:", formData.payment_method)
    console.log("Full formData:", formData)
    console.log("selectedTable:", selectedTable)
    console.log("foods:", foods)
    console.log("combos:", combos)

    if (!selectedTable) {
      showNotification("Vui lòng chọn bàn trước khi đặt.", "error")
      return false
    }

    if (!formData.customer_name || !formData.customer_phone) {
      showNotification("Vui lòng điền đầy đủ thông tin khách hàng.", "error")
      return false
    }

    // ✅ Validation thêm để tránh lỗi 422
    if (!formData.reservation_date || !formData.reservation_time) {
      showNotification("Vui lòng chọn ngày và giờ đặt bàn.", "error")
      return false
    }

    if (!["cash", "vnpay"].includes(formData.payment_method)) {
      showNotification("Phương thức thanh toán không hợp lệ.", "error")
      return false
    }

    if (formData.guest_count < 1 || formData.guest_count > 20) {
      showNotification("Số lượng khách không hợp lệ (1-20 người).", "error")
      return false
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("auth")
      if (!token) {
        showNotification("Vui lòng đăng nhập lại.", "error")
        router.push("/dang-nhap")
        return false
      }

      const isOver12Guests = formData.guest_count > 12
      const isVnPay = formData.payment_method === "vnpay"

      console.log("Order details:", {
        isOver12Guests,
        isVnPay,
        payment_method: formData.payment_method,
        guest_count: formData.guest_count,
      })

      const currentDepositAmount = calculateDepositAmount()
      const totalFinalAfterDiscount = formData.total_price

      let depositForApi = 0
      let remainingForApi = totalFinalAfterDiscount

      if (isVnPay) {
        depositForApi = totalFinalAfterDiscount
        remainingForApi = 0
      } else if (isOver12Guests && formData.payment_method === "cash") {
        depositForApi = currentDepositAmount
        remainingForApi = Math.max(totalFinalAfterDiscount - currentDepositAmount, 0)
      } else {
        depositForApi = 0
        remainingForApi = totalFinalAfterDiscount
      }

      console.log("Payment calculation:", {
        depositForApi,
        remainingForApi,
        totalFinalAfterDiscount,
        currentDepositAmount,
      })

      // ✅ Chuẩn bị data gửi lên API với format chính xác
      const orderData = {
        customer_id: Number(formData.customer_id), // Đảm bảo là number
        customer_name: String(formData.customer_name).trim(),
        customer_phone: String(formData.customer_phone).trim(),
        guest_count: Number(formData.guest_count),
        reservation_date: formData.reservation_date,
        reservation_time:
          formData.reservation_time.length === 5 ? `${formData.reservation_time}:00` : formData.reservation_time,
        payment_method: formData.payment_method,
        total_price: Number(totalFinalAfterDiscount),
        deposit_amount: Number(depositForApi),
        remaining_payment: Number(remainingForApi),
        table_id: Number(selectedTable.table_id),
        voucher_id: voucherId ? Number(voucherId) : null,
        note: formData.note || "",
        foods: foods.map((f) => ({
          food_id: Number(f.food_id),
          quantity: Number(f.quantity),
          price: Number(f.price),
        })),
        combos: combos.map((c) => ({
          combo_id: Number(c.combo_id),
          quantity: Number(c.quantity),
          price: Number(c.price),
        })),
      }

      console.log("=== FINAL ORDER DATA ===")
      console.log(JSON.stringify(orderData, null, 2))

      // ✅ Gửi request với error handling tốt hơn
      const res = await axios.post("http://127.0.0.1:8000/api/orders/bookTables", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 seconds timeout
      })

      console.log("Order response:", res.data)
      const order_id = res.data.order_id
      setOrderId(order_id)

      // Xử lý thanh toán
      if (isVnPay || (isOver12Guests && formData.payment_method === "cash")) {
        const payRes = await axios.post(
          "http://127.0.0.1:8000/api/orders/vnpay-url",
          {
            order_id,
            amount: depositForApi,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )

        const payUrl = payRes.data?.data
        if (payUrl) {
          resetBookingData()
          window.location.href = payUrl
          return true
        } else {
          showNotification("Không thể tạo URL thanh toán. Vui lòng thử lại.", "error")
          return false
        }
      }

      // Thành công không cần thanh toán online
      resetBookingData()
      showNotification("Đặt bàn thành công!", "success")
      return true
    } catch (err: any) {
      console.error("=== BOOKING ERROR ===")
      console.error("Full error:", err)
      console.error("Error response:", err.response?.data)
      console.error("Error status:", err.response?.status)

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422) {
          const errorData = err.response.data
          let errorMessage = "Dữ liệu không hợp lệ: "

          if (errorData?.errors) {
            // Laravel validation errors
            const errorDetails = Object.entries(errorData.errors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
              .join("; ")
            errorMessage += errorDetails
          } else if (errorData?.message) {
            errorMessage += errorData.message
          } else {
            errorMessage += "Vui lòng kiểm tra lại thông tin đặt bàn."
          }

          showNotification(errorMessage, "error")
        } else if (err.response?.status === 401) {
          showNotification("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error")
          router.push("/dang-nhap")
        } else if (err.code === "NETWORK_ERROR") {
          showNotification("Lỗi mạng khi đặt bàn. Vui lòng kiểm tra kết nối internet và thử lại.", "error")
        } else {
          showNotification(err?.response?.data?.message || "Lỗi khi đặt bàn. Vui lòng thử lại.", "error")
        }
      } else {
        showNotification("Đã xảy ra lỗi không xác định. Vui lòng thử lại.", "error")
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }, [
    selectedTable,
    formData,
    voucherId,
    foods,
    combos,
    calculateDepositAmount,
    showNotification,
    router,
    resetBookingData,
  ])

  const handleSelectTime = useCallback(
    (time: string) => {
      setSelectedTime(time)
      setFormData((prev) => ({
        ...prev,
        reservation_time: time.length === 5 ? `${time}:00` : time,
      }))

      const slot = availableSlots.find((s) => s.time === time)
      if (!slot || slot.tables.length === 0) {
        showNotification("Không có bàn khả dụng cho khung giờ này", "error")
        return
      }

      const guestCount = formData.guest_count
      const sortedTables = [...slot.tables].sort((a, b) => b.max_guests - a.max_guests)

      if (guestCount <= 12) {
        const oneTable = sortedTables
          .filter((t) => t.max_guests >= guestCount)
          .sort((a, b) => a.max_guests - b.max_guests)[0]
        if (oneTable) {
          setSelectedTable(oneTable)
          setFormData((prev) => ({
            ...prev,
            reservation_date: selectedDate,
          }))
        } else {
          showNotification("Không có bàn phù hợp với số lượng khách", "error")
        }
        return
      }

      let bestPair: Table[] = []
      let minWastedSeats = Number.POSITIVE_INFINITY

      for (let i = 0; i < sortedTables.length; i++) {
        for (let j = i + 1; j < sortedTables.length; j++) {
          const totalGuests = sortedTables[i].max_guests + sortedTables[j].max_guests
          if (totalGuests >= guestCount) {
            const wasted = totalGuests - guestCount
            if (wasted < minWastedSeats) {
              minWastedSeats = wasted
              bestPair = [sortedTables[i], sortedTables[j]]
            }
          }
        }
      }

      if (bestPair.length === 2) {
        setSelectedTable(bestPair[0])
        showNotification(
          `Khách được chia thành 2 bàn (tổng số ghế: ${bestPair[0].max_guests + bestPair[1].max_guests})`,
          "info",
        )
        setFormData((prev) => ({
          ...prev,
          reservation_date: selectedDate,
        }))
      } else {
        showNotification("Không thể chia khách thành 2 bàn", "error")
      }
    },
    [availableSlots, formData.guest_count, selectedDate, showNotification, setFormData],
  )

  const handleAddFood = useCallback((food: FoodItem) => {
    setFoods((prev: SelectedFoodItem[]) => {
      const existing = prev.find((f) => f.food_id === food.id)
      let normalizedCategory: string | Category | null | undefined

      if (typeof food.category === "object" && food.category !== null) {
        normalizedCategory = food.category.name
      } else {
        normalizedCategory = food.category
      }

      if (existing) {
        return prev.map((f) => (f.food_id === food.id ? { ...f, quantity: f.quantity + 1 } : f))
      }

      return [
        ...prev,
        {
          id: food.id,
          food_id: food.id,
          name: food.name,
          price: typeof food.price === "string" ? Number.parseFloat(food.price) : food.price || 0,
          quantity: 1,
          image: food.image ?? null,
          description: food.description ?? null,
          category: normalizedCategory,
          category_id: food.category_id,
          group_id: food.group_id,
          jpName: food.jpName,
        },
      ]
    })
  }, [])

  const handleRemoveFood = useCallback((id: number) => setFoods((prev) => prev.filter((f) => f.food_id !== id)), [])

  const handleFoodQuantityChange = useCallback(
    (id: number, quantity: number) => {
      if (quantity < 1) return handleRemoveFood(id)
      setFoods((prev) => prev.map((f) => (f.food_id === id ? { ...f, quantity } : f)))
    },
    [handleRemoveFood],
  )

  const handleAddCombo = useCallback((combo: Combo) => {
    setCombos((prev) => {
      const existing = prev.find((c) => c.combo_id === combo.id)
      if (existing) {
        return prev.map((c) => (c.combo_id === combo.id ? { ...c, quantity: c.quantity + 1 } : c))
      }

      return [
        ...prev,
        {
          id: combo.id,
          combo_id: combo.id,
          name: combo.name,
          quantity: 1,
          price: typeof combo.price === "string" ? Number.parseFloat(combo.price) : combo.price || 0,
          image: combo.image,
          description: combo.description,
          items: combo.combo_items.map((item) => ({
            food_id: item.food.id,
            name: item.food.name,
            price: typeof item.food.price === "string" ? Number.parseFloat(item.food.price) : item.food.price || 0,
            quantity: item.quantity,
            image: item.food.image,
            description: item.food.description,
            category_id: item.food.category_id,
            group_id: item.food.group_id,
            jpName: item.food.jpName,
          })),
        },
      ]
    })
  }, [])

  const handleRemoveCombo = useCallback((id: number) => setCombos((prev) => prev.filter((c) => c.combo_id !== id)), [])

  const handleComboQuantityChange = useCallback(
    (id: number, quantity: number) => {
      if (quantity < 1) return handleRemoveCombo(id)
      setCombos((prev) => prev.map((c) => (c.combo_id === id ? { ...c, quantity } : c)))
    },
    [handleRemoveCombo],
  )

  const getPaymentAmount = useCallback(() => {
    const finalTotalAfterDiscount = formData.total_price
    const deposit = calculateDepositAmount()

    console.log(
      "getPaymentAmount - payment_method:",
      formData.payment_method,
      "finalTotal:",
      finalTotalAfterDiscount,
      "deposit:",
      deposit,
    )

    return formData.payment_method === "vnpay" ? finalTotalAfterDiscount : deposit
  }, [formData.total_price, formData.payment_method, calculateDepositAmount])

  const remainingCashPayment =
    formData.payment_method === "cash" ? Math.max(formData.total_price - calculateDepositAmount(), 0) : 0

  // ✅ NEW: Effect để reset selectedTime khi guest_count thay đổi và time slot hiện tại không còn phù hợp
  useEffect(() => {
    if (selectedTime && availableSlots.length > 0) {
      const currentSlot = availableSlots.find(slot => slot.time === selectedTime)
      if (currentSlot && !isTimeSlotSuitableForGuests(currentSlot, formData.guest_count)) {
        console.log(`Time slot ${selectedTime} is no longer suitable for ${formData.guest_count} guests. Resetting selection.`)
        setSelectedTime("")
        setSelectedTable(null)
        showNotification("Khung giờ đã chọn không còn phù hợp với số lượng khách mới. Vui lòng chọn lại.", "info")
      }
    }
  }, [formData.guest_count, selectedTime, availableSlots, showNotification])

  // ✅ NEW: Effect để tự động lấy lại available slots khi guest_count thay đổi
  useEffect(() => {
    if (selectedDate && formData.guest_count) {
      fetchAvailableSlots()
    }
  }, [formData.guest_count, selectedDate, fetchAvailableSlots])

  // Update formData.customer_id, name, phone when user changes
  useEffect(() => {
    if (user && user.id !== userIdRef.current) {
      userIdRef.current = user.id
      setFormData((prev) => ({
        ...prev,
        customer_id: +user.id,
        customer_name: user.name || "",
        customer_phone: user.phone || "",
      }))
    }
  }, [user, setFormData])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user && isInitialized) {
      router.push("/dang-nhap")
    }
  }, [authLoading, user, isInitialized, router])

  // Calculate total_price in formData based on foods, combos, and discount
  useEffect(() => {
    const foodTotal = foods.reduce((sum, food) => sum + food.price * food.quantity, 0)
    const comboTotal = combos.reduce((sum, combo) => sum + combo.price * combo.quantity, 0)
    const calculatedOriginalTotal = foodTotal + comboTotal
    const finalPriceAfterDiscount = Math.max(calculatedOriginalTotal - discountAmount, 0)

    setFormData((prev) => ({ ...prev, total_price: finalPriceAfterDiscount }))
  }, [foods, combos, discountAmount, setFormData])

  // Initial data fetching when user is available
  useEffect(() => {
    if (user && !hasInitializedRef.current) {
      hasInitializedRef.current = true
      fetchCategories().then(() => {
        fetchFoods()
        fetchCombos()
      })

      const userId = +user.id
      if (userId && userIdRef.current !== userId) {
        fetchUserVouchers(userId)
      }
    }
  }, [user, fetchCategories, fetchFoods, fetchCombos, fetchUserVouchers])

  // Update formData when selectedDate changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      reservation_date: selectedDate,
    }))
  }, [selectedDate, setFormData])

  // Update formData when selectedTime changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      reservation_time: selectedTime,
    }))
  }, [selectedTime, setFormData])

  // Save foods to localStorage
  useEffect(() => {
    localStorage.setItem("bookingFoods", JSON.stringify(foods))
  }, [foods])

  // Save combos to localStorage
  useEffect(() => {
    localStorage.setItem("bookingCombos", JSON.stringify(combos))
  }, [combos])

  return {
    selectedDate,
    setSelectedDate,
    availableSlots,
    filteredAvailableSlots, // ✅ NEW: Export filtered slots
    selectedTime,
    selectedTable,
    setSelectedTable,
    formData,
    setFormData,
    foods,
    combos,
    foodsData,
    combosData,
    categories,
    voucherId,
    setVoucherId,
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
    setPaymentQRCode,
    paymentCompleted,
    setPaymentCompleted,
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
    userVouchers,
    fetchUserVouchers,
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
    resetBookingData,
    isTimeSlotSuitableForGuests, // ✅ NEW: Export helper function for external use
  }
}