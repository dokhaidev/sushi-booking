"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import type {
  Order,
  OrderItem,
  Customer,
  Category,
  Group,
  Food,
  Combo,
  Voucher,
  Table, // Ensure Table is imported from index.ts or directly from table.ts
  Feedback,
  OrderDetail,
} from "@/src/app/types" // Changed to import from index.ts

interface UseFetchResult {
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
  foodGroups: Group[]
  setFoodGroups: React.Dispatch<React.SetStateAction<Group[]>>
  foods: Food[]
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>
  combos: Combo[]
  setCombos: React.Dispatch<React.SetStateAction<Combo[]>>
  vouchers: Voucher[]
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>
  tables: Table[]
  orders: Order[]
  orderDetail: OrderDetail | null
  orderItems: OrderItem[]
  feedbacks: Feedback[]
  setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  error: string | null
  fetchOrderDetail: (orderId: number) => Promise<OrderDetail | null>
  fetchOrderItemsByOrderId: (orderId: number) => Promise<OrderItem[]>
  fetchOrderItemsByRole: (role: "chef" | "staff") => Promise<void>
  refetchOrders: () => Promise<void>
}

export function useFetch(): UseFetchResult {
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

  const getAuthToken = useCallback((): string | null => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";")
      const tokenCookieEntry = cookies.find((cookie) => cookie.trim().startsWith("access_token="))
      if (tokenCookieEntry) {
        const trimmedEntry = tokenCookieEntry.trim()
        const parts = trimmedEntry.split("=")
        if (parts.length > 1) {
          const token = parts[1]?.trim()
          return token || null
        }
      }
      return null
    }
    return null
  }, [])

  const createAuthAxios = useCallback(() => {
    const token = getAuthToken()
    const authAxiosInstance = axios.create({
      baseURL: "http://127.0.0.1:8000/api",
    })
    if (token) {
      authAxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete authAxiosInstance.defaults.headers.common["Authorization"]
    }
    authAxiosInstance.defaults.headers.common["Content-Type"] = "application/json"
    return authAxiosInstance
  }, [getAuthToken])

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
  }, [createAuthAxios])

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
  const refetchOrders = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    refetchOrders()
  }, [refetchOrders])

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
    [createAuthAxios],
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
    refetchOrders,
  }
}
