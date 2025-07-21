"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import type {
  Customer,
  Category,
  Group,
  Food,
  Combo,
  Voucher,
  Table,
  Order,
  OrderDetail,
  OrderItem,
  Feedback,
} from "../types"

const getAuthToken = () => {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";")
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("access_token="))
    return tokenCookie ? tokenCookie.split("=")[1] : null
  }
  return null
}

const createAuthAxios = () => {
  const token = getAuthToken()
  return axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  })
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
        // console.log("Danh sách người dùng:", response.data)
        setCustomers(response.data)
      } catch (error: any) {
        console.error("Lỗi khi lấy người dùng:", error)
        if (error.response?.status === 401) {
          console.error("Token không hợp lệ hoặc đã hết hạn")
          setError("Token không hợp lệ hoặc đã hết hạn")
        } else if (error.response?.status === 403) {
          console.error("Không có quyền truy cập")
          setError("Không có quyền truy cập")
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
        // console.log("Danh sách danh mục:", res.data);
        setCategories(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err))
  }, [])

  // Gọi API lấy loại danh mục
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/foodgroups")
      .then((res) => {
        // console.log("Danh sách loại danh mục:", res.data);
        setFoodGroups(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy loại danh mục:", err))
  }, [])

  // Gọi API lấy món ăn
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/foods")
      .then((res) => {
        console.log("Danh sách món ăn:", res.data.data);
        setFoods(res.data.data)
      })
      .catch((err) => console.error("Lỗi khi lấy món ăn:", err))
  }, [])

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/combos")
      .then((res) => {
        // console.log("Danh sách combo:", res.data);
        setCombos(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy combo:", err))
  }, [])

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/voucher")
      .then((res) => {
        // console.log("Danh sách voucher:", res.data);
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
        // console.log("Danh sách đơn hàng:", response.data);
        setOrders(response.data)
        setError(null)
      } catch (error: any) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error)
        setError("Lỗi khi lấy danh sách đơn hàng")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Lấy chi tiết đơn hàng
  const fetchOrderDetail = (id: number) => {
    axios
      .get(`http://127.0.0.1:8000/api/orders/${id}`)
      .then((res) => {
        // console.log("Chi tiết đơn hàng:", res.data);
        setOrderDetail(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy chi tiết đơn hàng:", err))
  }

  // Lấy tất cả order items từ TẤT CẢ đơn hàng (không chỉ active)
  const fetchAllOrderItems = async () => {
    try {
      // console.log("🔄 Bắt đầu fetch tất cả order items...")

      // Lấy TẤT CẢ đơn hàng (không filter theo status)
      const ordersResponse = await axios.get("http://127.0.0.1:8000/api/orders")
      const allOrders = ordersResponse.data

      // console.log(`📊 Tìm thấy ${allOrders.length} đơn hàng`)

      // Lấy order items từ tất cả đơn hàng
      const allOrderItems: OrderItem[] = []

      for (const order of allOrders) {
        try {
          const orderDetailResponse = await axios.get(`http://127.0.0.1:8000/api/orders/${order.id}`)
          const orderDetail = orderDetailResponse.data

          if (orderDetail.items && orderDetail.items.length > 0) {
            const itemsWithOrderInfo = orderDetail.items.map((item: any) => ({
              ...item,
              order_info: {
                id: order.id,
                customer_name: order.customer?.name || "Khách hàng",
                table_numbers: order.tables?.map((t: any) => t.table_number).join(", ") || "N/A",
                order_status: order.status,
                order_date: order.created_at,
              },
            }))
            allOrderItems.push(...itemsWithOrderInfo)
          }
        } catch (error) {
          console.error(`❌ Lỗi khi lấy chi tiết đơn hàng ${order.id}:`, error)
        }
      }

      // console.log(`✅ Đã lấy được ${allOrderItems.length} order items từ tất cả đơn hàng`)
      setOrderItems(allOrderItems)
      return allOrderItems
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách order items:", error)
      return []
    }
  }

  // Lấy order items theo order ID
  const fetchOrderItemsByOrderId = async (orderId: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/getItemsByOrderId/${orderId}`)
      // console.log("Order items theo order ID:", response.data)
      return response.data.data || []
    } catch (error) {
      console.error("Lỗi khi lấy order items theo order ID:", error)
      return []
    }
  }

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/feedbacks")
        setFeedbacks(response.data)
        // console.log("Danh sách Feedback:", response.data)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách feedback:", error)
      }
    }
    fetchFeedbacks()
  }, [])

  // Auto-fetch order items khi có orders
  useEffect(() => {
    if (orders.length > 0 && orderItems.length === 0) {
      // console.log("🚀 Auto-fetching order items...")
      fetchAllOrderItems()
    }
  }, [orders])

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
    error,
    fetchOrderDetail,
    fetchAllOrderItems,
    fetchOrderItemsByOrderId,
  }
}
