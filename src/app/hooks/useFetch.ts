"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios" // Import AxiosError
import type {
  Customer,
  Category,
  Group,
  Food,
  Combo,
  Voucher,
  Table,
  Order,
  OrderItem,
  OrderDetail,
  Feedback,
} from "../types" // Đã sửa đường dẫn import types

const getAuthToken = (): string | null => {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";")
    // Find the cookie, trim the individual cookie string before checking startsWith
    const tokenCookieEntry = cookies.find((cookie) => cookie.trim().startsWith("access_token="))

    // console.log("Raw token cookie entry found:", tokenCookieEntry) // Log the raw cookie string found by find()

    if (tokenCookieEntry) {
      // Trim the found entry string itself before splitting
      const trimmedEntry = tokenCookieEntry.trim()
      const parts = trimmedEntry.split("=")
      if (parts.length > 1) {
        const token = parts[1]?.trim() // Trim the extracted value as well
        // console.log("Extracted token value (after all trims):", token)
        const finalToken = token || null // Ensure it's null if empty string after trim
        // console.log("Auth Token retrieved:", finalToken ? "Exists" : "None")
        return finalToken
      }
    }
    // console.log("Auth Token retrieved: None (cookie not found or value empty after split)")
    return null
  }
  return null
}

const createAuthAxios = () => {
  const token = getAuthToken() // This calls getAuthToken()
  // console.log("Token value inside createAuthAxios (after getAuthToken call):", token) // Confirm value here
  // console.log("Type of token inside createAuthAxios:", typeof token) // Log type of token

  const authAxiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    // Không đặt headers ở đây, sẽ đặt sau khi tạo instance
  })

  if (token) {
    authAxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    // Nếu không có token, đảm bảo header Authorization không tồn tại
    delete authAxiosInstance.defaults.headers.common["Authorization"]
  }

  // console.log(
  //   "Axios instance created with Authorization header:",
  //   authAxiosInstance.defaults.headers.common["Authorization"],
  // )
  return authAxiosInstance
}

export function useFetch() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [foodGroups, setFoodGroups] = useState<Group[]>([])
  const [foods, setFoods] = useState<Food[]>([])
  const [combos, setCombos] = useState<Combo[]>([])
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Goi API lấy người dùng
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const authAxios = createAuthAxios()
        const response = await authAxios.get("/admin/customers")
        setCustomers(response.data)
      } catch (error: unknown) {
        console.error("Lỗi khi lấy người dùng:", error)
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError("Lỗi 401: Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.")
          } else if (error.response?.status === 403) {
            setError("Lỗi 403: Bạn không có quyền truy cập vào danh sách khách hàng.")
          } else {
            setError(`Lỗi khi lấy người dùng: ${error.message}`)
          }
        } else {
          setError("Đã xảy ra lỗi không xác định khi lấy người dùng.")
        }
      }
    }
    fetchCustomers()
  }, [])

  // Gọi API lấy danh mục
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/category")
      .then((res) => {
        setCategories(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err))
  }, [])

  // Gọi API lấy loại danh mục
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/foodgroups")
      .then((res) => {
        setFoodGroups(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy loại danh mục:", err))
  }, [])

  // Gọi API lấy món ăn
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/foods")
      .then((res) => {
        setFoods(res.data.data)
      })
      .catch((err) => console.error("Lỗi khi lấy món ăn:", err))
  }, [])

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/combos")
      .then((res) => {
        setCombos(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy combo:", err))
  }, [])

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/voucher")
      .then((res) => {
        setVouchers(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách voucher:", err))
  }, [])

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/tables")
      .then((res) => setTables(res.data))
      .catch((err) => console.error("Lỗi khi lấy bàn:", err))
  }, [])

  // Gọi API lấy danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://127.0.0.1:8000/api/orders")
        setOrders(response.data)
        setError(null)
      } catch (error: unknown) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error)
        setError("Lỗi khi lấy danh sách đơn hàng")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Lấy chi tiết đơn hàng (publicly available for other fetches)
  const fetchOrderDetail = useCallback(async (id: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/orders/${id}`)
      console.log(response.data)
      setOrderDetail(response.data)
      return response.data as OrderDetail
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", err)
      return null
    }
  }, [])

  // Lấy order items theo order ID (original function, kept for compatibility)
  const fetchOrderItemsByOrderId = useCallback(async (orderId: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/getItemsByOrderId/${orderId}`)
      return response.data.data || []
    } catch (error) {
      console.error("Lỗi khi lấy order items theo order ID:", error)
      return []
    }
  }, [])

  // NEW: Fetch order items based on role (Chef or Staff)
  const fetchOrderItemsByRole = useCallback(
    async (role: "chef" | "staff") => {
      setLoading(true)
      setError(null)
      // console.log(`Fetching order items for role: ${role}`)
      try {
        const authAxios = createAuthAxios()
        let apiEndpoint = ""
        if (role === "chef") {
          apiEndpoint = "/getOrderChef"
        } else if (role === "staff") {
          apiEndpoint = "/getOrderStaff"
        } else {
          throw new Error("Invalid role specified for fetching order items.")
        }
        const response = await authAxios.get(apiEndpoint)
        const rawOrderItems: OrderItem[] = response.data.data || []

        // Dữ liệu đã được làm giàu từ backend, không cần xử lý thêm ở đây
        // console.log("data: ", rawOrderItems)
        setOrderItems(rawOrderItems)
      } catch (err: unknown) {
        console.error(`Lỗi khi lấy danh sách order items cho ${role}:`, err)
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError(`Lỗi 401: Token không hợp lệ hoặc đã hết hạn khi lấy món ăn cho ${role}. Vui lòng đăng nhập lại.`)
          } else if (err.response?.status === 403) {
            setError(
              `Lỗi 403: Bạn không có quyền truy cập món ăn cho vai trò ${role}. Vui lòng kiểm tra vai trò của bạn.`,
            )
          } else {
            setError(`Lỗi khi lấy danh sách món ăn cho ${role}: ${err.message}`)
          }
        } else {
          setError(`Lỗi không xác định khi lấy danh sách món ăn cho ${role}.`)
        }
      } finally {
        setLoading(false)
      }
    },
    [], // Dependency array is empty because fetchOrderDetail is no longer called inside
  )

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/feedbacks")
        setFeedbacks(response.data)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách feedback:", error)
      }
    }
    fetchFeedbacks()
  }, [])

  return {
    customers,
    setCustomers,
    categories,
    setCategories,
    foodGroups,
    setFoodGroups,
    foods,
    setFoods,
    combos,
    setCombos,
    vouchers,
    setVouchers,
    tables,
    orders,
    orderDetail,
    orderItems,
    feedbacks,
    setFeedbacks,
    loading,
    setLoading,
    error,
    fetchOrderDetail,
    fetchOrderItemsByOrderId,
    fetchOrderItemsByRole,
  }
}
