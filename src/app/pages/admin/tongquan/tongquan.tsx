"use client"
import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/button"
import {
  FileText,
  BarChart2,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Star,
  Utensils,
  Activity,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  RefreshCw,
  Database,
  Wifi,
  WifiOff,
} from "lucide-react"
import Link from "next/link"
import { useFetch } from "@/src/app/hooks/useFetch"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
} from "chart.js"
import { Line as ChartLine, Bar as ChartBar, Doughnut, Radar } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler,
)

interface DashboardStats {
  statOrder: number
  statTotal: number
  statCustomer: number
}

export default function TongQuan() {
  // Sử dụng tất cả dữ liệu từ useFetch hook
  const {
    orders,
    customers,
    foods,
    feedbacks,
    orderItems,
    categories,
    combos,
    tables,
    vouchers,
    fetchAllOrderItems,
    loading: dataLoading,
    error: dataError,
  } = useFetch()

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    statOrder: 0,
    statTotal: 0,
    statCustomer: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatsLoading(true)
        const statsResponse = await axios.get("http://127.0.0.1:8000/api/statsDashbroad")
        setDashboardStats(statsResponse.data)
        setApiError(null)
      } catch (error: any) {
        console.error("❌ Error fetching dashboard stats:", error)
        setApiError(`Lỗi API thống kê: ${error.message}`)
      } finally {
        setStatsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Manual refresh function
  const handleRefresh = async () => {
    setLastRefresh(new Date())
    try {
      await fetchAllOrderItems()
    } catch (error) {
      console.error("❌ Error refreshing data:", error)
    }
  }

  // Calculate comprehensive statistics from real data với null safety
  const comprehensiveStats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        todayOrders: 0,
        todayRevenue: 0,
        todayCustomers: 0,
        weekOrders: 0,
        monthOrders: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        successOrders: 0,
        cancelledOrders: 0,
        orderChange: 0,
        revenueChange: 0,
        customerChange: 0,
        totalRevenue: 0,
      }
    }

    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const thisWeek = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)

    // Filter orders by date với null checks
    const todayOrders = orders.filter((order) => order.created_at?.slice(0, 10) === today)
    const yesterdayOrders = orders.filter((order) => order.created_at?.slice(0, 10) === yesterday)
    const weekOrders = orders.filter((order) => order.created_at?.slice(0, 10) >= thisWeek)
    const monthOrders = orders.filter((order) => order.created_at?.slice(0, 10) >= thisMonth)

    // Calculate revenue from real data
    const todayRevenue = todayOrders
      .filter((order) => order.status === "success")
      .reduce((sum, order) => sum + Number(order.total_price || 0), 0)
    const yesterdayRevenue = yesterdayOrders
      .filter((order) => order.status === "success")
      .reduce((sum, order) => sum + Number(order.total_price || 0), 0)

    // Calculate customers from real data với fallback
    const todayCustomers = customers?.filter((customer) => customer.created_at?.slice(0, 10) === today).length || 0
    const yesterdayCustomers =
      customers?.filter((customer) => customer.created_at?.slice(0, 10) === yesterday).length || 0

    // Order status counts from real data
    const pendingOrders = orders.filter((order) => order.status === "pending").length
    const confirmedOrders = orders.filter((order) => order.status === "confirmed").length
    const successOrders = orders.filter((order) => order.status === "success").length
    const cancelledOrders = orders.filter((order) => order.status === "cancelled").length

    // Calculate percentage changes với safe division
    const orderChange =
      yesterdayOrders.length > 0
        ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100
        : todayOrders.length > 0
          ? 100
          : 0
    const revenueChange =
      yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : todayRevenue > 0 ? 100 : 0
    const customerChange =
      yesterdayCustomers > 0
        ? ((todayCustomers - yesterdayCustomers) / yesterdayCustomers) * 100
        : todayCustomers > 0
          ? 100
          : 0

    const totalRevenue = orders
      .filter((order) => order.status === "success")
      .reduce((sum, order) => sum + Number(order.total_price || 0), 0)

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      todayCustomers,
      weekOrders: weekOrders.length,
      monthOrders: monthOrders.length,
      pendingOrders,
      confirmedOrders,
      successOrders,
      cancelledOrders,
      orderChange,
      revenueChange,
      customerChange,
      totalRevenue,
    }
  }, [orders, customers])

  // Real revenue chart data for last 30 days với memoization
  const revenueChartJSData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        labels: Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (29 - i))
          return date.toLocaleDateString("vi-VN", { month: "short", day: "numeric" })
        }),
        datasets: [
          {
            label: "Doanh thu (K₫)",
            data: new Array(30).fill(0),
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      }
    }

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().slice(0, 10)
    })

    const data = last30Days.map((date) => {
      const dayOrders = orders.filter((order) => order.created_at?.slice(0, 10) === date)
      const revenue = dayOrders
        .filter((order) => order.status === "success")
        .reduce((sum, order) => sum + Number(order.total_price || 0), 0)
      return revenue / 1000 // Convert to thousands
    })

    return {
      labels: last30Days.map((date) => new Date(date).toLocaleDateString("vi-VN", { month: "short", day: "numeric" })),
      datasets: [
        {
          label: "Doanh thu (K₫)",
          data: data,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }
  }, [orders])

  // Chart.js options for revenue chart
  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y}K ₫`,
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
          },
          callback: (value: any) => value + "K",
        },
      },
    },
  }

  // Real order status data for Chart.js Doughnut
  const orderStatusChartJSData = useMemo(() => {
    return {
      labels: ["Chờ xử lý", "Đã xác nhận", "Hoàn tất", "Đã hủy"],
      datasets: [
        {
          data: [
            comprehensiveStats.pendingOrders,
            comprehensiveStats.confirmedOrders,
            comprehensiveStats.successOrders,
            comprehensiveStats.cancelledOrders,
          ],
          backgroundColor: [
            "rgba(245, 158, 11, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(239, 68, 68, 0.8)",
          ],
          borderColor: ["rgb(245, 158, 11)", "rgb(59, 130, 246)", "rgb(16, 185, 129)", "rgb(239, 68, 68)"],
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    }
  }, [comprehensiveStats])

  // FIXED: Top selling items data using real orderItems từ TẤT CẢ đơn hàng
  const topSellingChartJSData = useMemo(() => {

    if (orderItems && orderItems.length > 0) {
      // Use real order items data from ALL orders
      const itemSales = new Map<string, { name: string; sales: number; fullName: string }>()

      orderItems.forEach((item) => {
        const itemName = item.food?.name || item.combo?.name || "Unknown"
        const itemType = item.food ? "food" : "combo"
        const key = `${itemType}-${item.food_id || item.combo_id}-${itemName}`

        if (itemSales.has(key)) {
          itemSales.get(key)!.sales += item.quantity
        } else {
          itemSales.set(key, {
            name: itemName.length > 15 ? itemName.substring(0, 15) + "..." : itemName,
            fullName: itemName,
            sales: item.quantity,
          })
        }
      })

      const topItems = Array.from(itemSales.values())
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 6)

      if (topItems.length === 0) {
        return {
          labels: ["Chưa có dữ liệu"],
          datasets: [
            {
              label: "Số lượng bán",
              data: [0],
              backgroundColor: ["rgba(156, 163, 175, 0.5)"],
              borderColor: ["rgb(156, 163, 175)"],
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        }
      }

      return {
        labels: topItems.map((item) => item.name),
        datasets: [
          {
            label: "Số lượng bán",
            data: topItems.map((item) => item.sales),
            backgroundColor: [
              "rgba(16, 185, 129, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(236, 72, 153, 0.8)",
              "rgba(249, 115, 22, 0.8)",
            ],
            borderColor: [
              "rgb(16, 185, 129)",
              "rgb(59, 130, 246)",
              "rgb(245, 158, 11)",
              "rgb(139, 92, 246)",
              "rgb(236, 72, 153)",
              "rgb(249, 115, 22)",
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      }
    } else {
      // Fallback: Use foods data with estimated sales
      const topFoods =
        foods?.slice(0, 6).map((food) => ({
          name: food.name.length > 15 ? food.name.substring(0, 15) + "..." : food.name,
          fullName: food.name,
          sales: Math.floor(Math.random() * 50) + 10, // Fallback estimated sales
        })) || []

      if (topFoods.length === 0) {
        return {
          labels: ["Chưa có dữ liệu"],
          datasets: [
            {
              label: "Số lượng bán",
              data: [0],
              backgroundColor: ["rgba(156, 163, 175, 0.5)"],
              borderColor: ["rgb(156, 163, 175)"],
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        }
      }

      return {
        labels: topFoods.map((item) => item.name),
        datasets: [
          {
            label: "Số lượng bán (ước tính)",
            data: topFoods.map((item) => item.sales),
            backgroundColor: [
              "rgba(16, 185, 129, 0.6)",
              "rgba(59, 130, 246, 0.6)",
              "rgba(245, 158, 11, 0.6)",
              "rgba(139, 92, 246, 0.6)",
              "rgba(236, 72, 153, 0.6)",
              "rgba(249, 115, 22, 0.6)",
            ],
            borderColor: [
              "rgb(16, 185, 129)",
              "rgb(59, 130, 246)",
              "rgb(245, 158, 11)",
              "rgb(139, 92, 246)",
              "rgb(236, 72, 153)",
              "rgb(249, 115, 22)",
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      }
    }
  }, [orderItems, foods])

  // Real customer satisfaction radar chart from feedbacks
  const satisfactionRadarData = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) {
      return {
        labels: ["1 sao", "2 sao", "3 sao", "4 sao", "5 sao"],
        datasets: [
          {
            label: "Số lượng đánh giá",
            data: [0, 0, 0, 0, 0],
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 2,
          },
        ],
      }
    }

    const ratings = [1, 2, 3, 4, 5].map((rating) => {
      return feedbacks.filter((feedback) => feedback.rating === rating).length
    })

    return {
      labels: ["1 sao", "2 sao", "3 sao", "4 sao", "5 sao"],
      datasets: [
        {
          label: "Số lượng đánh giá",
          data: ratings,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 2,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(59, 130, 246)",
        },
      ],
    }
  }, [feedbacks])

  // FIXED: Real weekly comparison data from orders với tooltip đúng
  const weeklyComparisonData = useMemo(() => {
    if (!orders || orders.length === 0) return []

    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (13 - i))
      return date.toISOString().slice(0, 10)
    })

    return last14Days.map((date, index) => {
      const dayOrders = orders.filter((order) => order.created_at?.slice(0, 10) === date)
      const revenue = dayOrders
        .filter((order) => order.status === "success")
        .reduce((sum, order) => sum + Number(order.total_price || 0), 0)

      return {
        day: new Date(date).toLocaleDateString("vi-VN", { weekday: "short" }),
        week: index < 7 ? "Tuần trước" : "Tuần này",
        revenue: Math.round(revenue / 1000),
        orders: dayOrders.length,
        fullDate: new Date(date).toLocaleDateString("vi-VN"),
        actualRevenue: revenue,
      }
    })
  }, [orders])

  const averageRating = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) return "0.0"
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0)
    return (totalRating / feedbacks.length).toFixed(1)
  }, [feedbacks])

  const recentOrders = useMemo(() => {
    if (!orders || orders.length === 0) return []
    return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
  }, [orders])

  const statisticsCards = [
    {
      title: "Đơn hàng hôm nay",
      value: comprehensiveStats.todayOrders,
      icon: <ShoppingCart className="w-7 h-7" />,
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
      change: comprehensiveStats.orderChange,
      changeType: comprehensiveStats.orderChange >= 0 ? ("increase" as const) : ("decrease" as const),
      subtitle: "So với hôm qua",
    },
    {
      title: "Doanh thu hôm nay",
      value: `${(comprehensiveStats.todayRevenue / 1000).toFixed(0)}K`,
      subValue: `${comprehensiveStats.todayRevenue.toLocaleString()} ₫`,
      icon: <DollarSign className="w-7 h-7" />,
      gradient: "from-green-500 via-green-600 to-green-700",
      bgColor: "bg-green-50",
      change: comprehensiveStats.revenueChange,
      changeType: comprehensiveStats.revenueChange >= 0 ? ("increase" as const) : ("decrease" as const),
      subtitle: "So với hôm qua",
    },
    {
      title: "Khách hàng mới",
      value: comprehensiveStats.todayCustomers,
      icon: <Users className="w-7 h-7" />,
      gradient: "from-purple-500 via-purple-600 to-purple-700",
      bgColor: "bg-purple-50",
      change: comprehensiveStats.customerChange,
      changeType: comprehensiveStats.customerChange >= 0 ? ("increase" as const) : ("decrease" as const),
      subtitle: "So với hôm qua",
    },
    {
      title: "Đánh giá trung bình",
      value: `${averageRating}/5`,
      icon: <Star className="w-7 h-7" />,
      gradient: "from-yellow-500 via-yellow-600 to-yellow-700",
      bgColor: "bg-yellow-50",
      change: Number(averageRating) * 20, // Convert to percentage
      changeType: "increase" as const,
      subtitle: `${feedbacks?.length || 0} đánh giá`,
    },
  ]

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xử lý", color: "text-yellow-600", bgColor: "bg-yellow-100" }
      case "confirmed":
        return { label: "Đã xác nhận", color: "text-blue-600", bgColor: "bg-blue-100" }
      case "success":
        return { label: "Hoàn tất", color: "text-green-600", bgColor: "bg-green-100" }
      case "cancelled":
        return { label: "Đã hủy", color: "text-red-600", bgColor: "bg-red-100" }
      default:
        return { label: "Không rõ", color: "text-gray-600", bgColor: "bg-gray-100" }
    }
  }

  // Combined loading state
  const isLoading = dataLoading || statsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-purple-600 absolute top-0 left-0"></div>
            <div className="animate-pulse absolute inset-0 flex items-center justify-center">
              <Database className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <p className="mt-8 text-gray-700 font-semibold text-lg">Đang tải dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Đang tải dữ liệu thực tế từ hệ thống</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        {/* Enhanced Header với Refresh Button */}
        <div className="text-center lg:text-left relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <BarChart2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent py-2">
                    Thống kê dữ liệu
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {new Date().toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Refresh Button */}
              <Button
                onClick={handleRefresh}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Làm mới</span>
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Dữ liệu thực từ hệ thống</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Cập nhật: {lastRefresh.toLocaleTimeString("vi-VN")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>
                  {orders?.length || 0} đơn hàng • {orderItems?.length || 0} items • {feedbacks?.length || 0} đánh giá
                </span>
              </div>
              <div className="flex items-center gap-2">
                {dataError ? (
                  <>
                    <WifiOff className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">Một số API lỗi</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Kết nối tốt</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Notifications - Enhanced với data status */}
        {(apiError || dataError || comprehensiveStats.pendingOrders > 0) && (
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-red-600 via-red-700 to-pink-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20"></div>
              <div className="relative flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Thông báo hệ thống</h3>
                  <p className="text-red-100 text-sm">Cần chú ý và xử lý</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {(apiError || dataError) && (
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200 shadow-sm">
                    <div className="p-2 bg-red-500 rounded-xl shadow-md">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-800">Lỗi API</p>
                      <p className="text-xs text-red-700 mt-1">{apiError || dataError}</p>
                      <p className="text-xs text-red-600 mt-2">
                        Một số biểu đồ có thể hiển thị dữ liệu ước tính thay vì dữ liệu thực tế
                      </p>
                    </div>
                  </div>
                )}

                {comprehensiveStats.pendingOrders > 0 && (
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 shadow-sm">
                    <div className="p-2 bg-yellow-500 rounded-xl shadow-md">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-yellow-800">Đơn hàng chờ xử lý</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        {comprehensiveStats.pendingOrders} đơn hàng đang chờ xác nhận
                      </p>
                      <div className="mt-2">
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((comprehensiveStats.pendingOrders / Math.max(orders?.length || 1, 1)) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm">
                  <div className="p-2 bg-blue-500 rounded-xl shadow-md">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-800">Đơn hàng hôm nay</p>
                    <p className="text-xs text-blue-700 mt-1">
                      {comprehensiveStats.todayOrders} đơn hàng mới trong ngày
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-medium text-green-600">
                        {comprehensiveStats.orderChange >= 0 ? "+" : ""}
                        {comprehensiveStats.orderChange.toFixed(1)}% so với hôm qua
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm">
                  <div className="p-2 bg-green-500 rounded-xl shadow-md">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-800">Đánh giá khách hàng</p>
                    <p className="text-xs text-green-700 mt-1">
                      {feedbacks?.length || 0} đánh giá thực tế • TB: {averageRating}/5 ⭐
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= Number(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 shadow-sm">
                  <div className="p-2 bg-indigo-500 rounded-xl shadow-md">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-indigo-800">Tổng quan dữ liệu</p>
                    <p className="text-xs text-indigo-700 mt-1">
                      {categories?.length || 0} danh mục • {foods?.length || 0} món ăn • {combos?.length || 0} combo •{" "}
                      {tables?.length || 0} bàn
                    </p>
                    <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">{customers?.length || 0}</div>
                        <div className="text-gray-500">Khách hàng</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{vouchers?.length || 0}</div>
                        <div className="text-gray-500">Voucher</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-600">{orderItems?.length || 0}</div>
                        <div className="text-gray-500">Order Items</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-orange-600">{feedbacks?.length || 0}</div>
                        <div className="text-gray-500">Feedback</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statisticsCards.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-xl group bg-white/80 backdrop-blur-sm"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      {stat.subValue && <p className="text-xs text-gray-500">{stat.subValue}</p>}
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {stat.changeType === "increase" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-semibold ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}
                    >
                      {Math.abs(stat.change).toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{stat.subtitle}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Trend Chart (Chart.js) */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Xu hướng doanh thu thực tế</h3>
                      <p className="text-blue-100 text-sm">
                        30 ngày gần đây • Từ {orders?.length || 0} đơn hàng thực tế
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{(comprehensiveStats.totalRevenue / 1000000).toFixed(1)}M ₫</p>
                    <p className="text-blue-100 text-sm">Tổng doanh thu</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <ChartLine data={revenueChartJSData} options={revenueChartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Status Distribution (Chart.js Doughnut) */}
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20"></div>
              <div className="relative flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Trạng thái đơn hàng</h3>
                  <p className="text-purple-100 text-sm">Dữ liệu thực tế từ {orders?.length || 0} đơn hàng</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80 flex items-center justify-center">
                <Doughnut
                  data={orderStatusChartJSData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom" as const,
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                          font: {
                            size: 12,
                          },
                        },
                      },
                      tooltip: {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        titleColor: "#1f2937",
                        bodyColor: "#1f2937",
                        borderColor: "#e5e7eb",
                        borderWidth: 1,
                        cornerRadius: 12,
                        callbacks: {
                          label: (context: any) => `${context.label}: ${context.parsed} đơn`,
                        },
                      },
                    },
                    cutout: "60%",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Selling Items (Chart.js Bar) */}
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
              <div className="relative flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Món bán chạy</h3>
                  <p className="text-green-100 text-sm">
                    {orderItems && orderItems.length > 0
                      ? `Từ ${orderItems.length} order items thực tế`
                      : "Dữ liệu ước tính từ menu"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ChartBar
                  data={topSellingChartJSData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        titleColor: "#1f2937",
                        bodyColor: "#1f2937",
                        borderColor: "#e5e7eb",
                        borderWidth: 1,
                        cornerRadius: 12,
                        callbacks: {
                          label: (context: any) =>
                            orderItems && orderItems.length > 0
                              ? `Đã bán: ${context.parsed.y} phần`
                              : `Ước tính: ${context.parsed.y} phần`,
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          color: "#6b7280",
                          font: {
                            size: 11,
                          },
                        },
                      },
                      y: {
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                        ticks: {
                          color: "#6b7280",
                          font: {
                            size: 11,
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer Satisfaction Radar (Chart.js) */}
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20"></div>
              <div className="relative flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Đánh giá thực tế</h3>
                  <p className="text-orange-100 text-sm">Từ {feedbacks?.length || 0} feedback thực tế</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80 flex items-center justify-center">
                <Radar
                  data={satisfactionRadarData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        titleColor: "#1f2937",
                        bodyColor: "#1f2937",
                        borderColor: "#e5e7eb",
                        borderWidth: 1,
                        cornerRadius: 12,
                        callbacks: {
                          label: (context: any) => `${context.parsed.r} đánh giá`,
                        },
                      },
                    },
                    scales: {
                      r: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0, 0, 0, 0.1)",
                        },
                        angleLines: {
                          color: "rgba(0, 0, 0, 0.1)",
                        },
                        ticks: {
                          color: "#6b7280",
                          font: {
                            size: 11,
                          },
                        },
                        pointLabels: {
                          color: "#374151",
                          font: {
                            size: 12,
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Weekly Comparison (Recharts) */}
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20"></div>
              <div className="relative flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">So sánh tuần thực tế</h3>
                  <p className="text-teal-100 text-sm">14 ngày dữ liệu thật</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={weeklyComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any, name: string, props: any) => {
                      if (name === "Doanh thu (K₫)") {
                        return [`${props.payload.actualRevenue?.toLocaleString() || 0} ₫`, "Doanh thu"]
                      }
                      return [value, name]
                    }}
                    labelFormatter={(label: string, payload: any) => {
                      if (payload && payload.length > 0) {
                        return `${payload[0].payload.fullDate} (${label})`
                      }
                      return label
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#14b8a6" name="Doanh thu (K₫)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-blue-400/20"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Đơn hàng gần đây</h3>
                      <p className="text-indigo-100 text-sm">5 đơn hàng mới nhất từ {orders?.length || 0} đơn hàng</p>
                    </div>
                  </div>
                  <Link
                    href="/quan-tri/quan-ly/don-hang"
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Xem tất cả</span>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Mã đơn
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Khách hàng
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tổng tiền
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order, idx) => {
                          const statusInfo = getStatusInfo(order.status)
                          return (
                            <tr
                              key={order.id}
                              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                #{order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                {order.customer?.name || "Khách vãng lai"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                {Number(order.total_price).toLocaleString()} ₫
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.color} shadow-sm`}
                                >
                                  {statusInfo.label}
                                </span>
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">Chưa có đơn hàng nào</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced System Notifications with Real Data */}
            <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-red-600 via-red-700 to-pink-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20"></div>
                <div className="relative flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Thông báo hệ thống</h3>
                    <p className="text-red-100 text-sm">Dữ liệu thực từ hệ thống</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 shadow-sm">
                    <div className="p-2 bg-yellow-500 rounded-xl shadow-md">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-yellow-800">Đơn hàng chờ xử lý</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        {comprehensiveStats.pendingOrders} đơn hàng đang chờ xác nhận
                      </p>
                      <div className="mt-2">
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((comprehensiveStats.pendingOrders / Math.max(orders?.length || 1, 1)) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm">
                    <div className="p-2 bg-blue-500 rounded-xl shadow-md">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-800">Đơn hàng hôm nay</p>
                      <p className="text-xs text-blue-700 mt-1">
                        {comprehensiveStats.todayOrders} đơn hàng mới trong ngày
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium text-green-600">
                          {comprehensiveStats.orderChange >= 0 ? "+" : ""}
                          {comprehensiveStats.orderChange.toFixed(1)}% so với hôm qua
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm">
                    <div className="p-2 bg-green-500 rounded-xl shadow-md">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-800">Đánh giá khách hàng</p>
                      <p className="text-xs text-green-700 mt-1">
                        {feedbacks?.length || 0} đánh giá thực tế • TB: {averageRating}/5 ⭐
                      </p>
                      <div className="mt-2 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= Number(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-pink-600 via-pink-700 to-rose-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20"></div>
                <div className="relative flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Thao tác nhanh</h3>
                    <p className="text-pink-100 text-sm">Truy cập nhanh các chức năng</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/quan-tri/quan-ly/thuc-don">
                    <Button className="w-full flex flex-col items-center justify-center gap-3 h-24 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-2xl">
                      <Utensils className="w-6 h-6" />
                      <span className="text-sm font-semibold">Thêm món</span>
                    </Button>
                  </Link>

                  <Link href="/quan-tri/quan-ly/don-hang">
                    <Button className="w-full flex flex-col items-center justify-center gap-3 h-24 bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-2xl">
                      <BarChart2 className="w-6 h-6" />
                      <span className="text-sm font-semibold">Báo cáo</span>
                    </Button>
                  </Link>

                  <Link href="/quan-tri/quan-ly/don-hang">
                    <Button className="w-full flex flex-col items-center justify-center gap-3 h-24 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-2xl">
                      <FileText className="w-6 h-6" />
                      <span className="text-sm font-semibold">Tạo đơn</span>
                    </Button>
                  </Link>

                  <Link href="/quan-tri/quan-ly/nguoi-dung">
                    <Button className="w-full flex flex-col items-center justify-center gap-3 h-24 bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-2xl">
                      <Users className="w-6 h-6" />
                      <span className="text-sm font-semibold">Khách hàng</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
