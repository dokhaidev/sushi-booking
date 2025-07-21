"use client"
import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import TitleDesc from "../../../components/ui/titleDesc"
import { Card, CardContent, CardHeader } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/button"
import Calendar from "../../../components/ui/Calendar"
import {
  Plus,
  FileText,
  BarChart2,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  CalendarIcon,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Star,
  Utensils,
} from "lucide-react"
import Link from "next/link"
import { useFetch } from "@/src/app/hooks/useFetch"

interface DashboardStats {
  statOrder: number
  statTotal: number
  statCustomer: number
}

export default function TongQuan() {
  const { orders, customers, foods, feedbacks } = useFetch()
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    statOrder: 0,
    statTotal: 0,
    statCustomer: 0,
  })
  const [loading, setLoading] = useState(true)

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/statsDashbroad")
        setDashboardStats(response.data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  // Calculate today's statistics
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)

    const todayOrders = orders.filter((order) => order.created_at?.slice(0, 10) === today)

    const todayRevenue = todayOrders
      .filter((order) => order.status === "success")
      .reduce((sum, order) => sum + Number(order.total_price || 0), 0)

    const todayCustomers = customers.filter((customer) => customer.created_at?.slice(0, 10) === today).length

    const pendingOrders = orders.filter((order) => order.status === "pending").length
    const confirmedOrders = orders.filter((order) => order.status === "confirmed").length

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      todayCustomers,
      pendingOrders,
      confirmedOrders,
    }
  }, [orders, customers])

  // Get recent orders (last 5)
  const recentOrders = useMemo(() => {
    return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
  }, [orders])

  // Get recent feedbacks
  const recentFeedbacks = useMemo(() => {
    return feedbacks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3)
  }, [feedbacks])

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return 0
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0)
    return (totalRating / feedbacks.length).toFixed(1)
  }, [feedbacks])

  // Get status info
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

  // Statistics cards data
  const statisticsCards = [
    {
      title: "Đơn hàng hôm nay",
      value: todayStats.todayOrders,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Doanh thu hôm nay",
      value: `${todayStats.todayRevenue.toLocaleString()} ₫`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      change: "+8%",
      changeType: "increase",
    },
    {
      title: "Khách hàng mới",
      value: todayStats.todayCustomers,
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      change: "+5%",
      changeType: "increase",
    },
    {
      title: "Đánh giá trung bình",
      value: `${averageRating}/5`,
      icon: <Star className="w-6 h-6" />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      change: "+0.2",
      changeType: "increase",
    },
  ]

  // Quick stats cards
  const quickStatsCards = [
    {
      title: "Chờ xử lý",
      value: todayStats.pendingOrders,
      icon: <Clock className="w-5 h-5" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Đã xác nhận",
      value: todayStats.confirmedOrders,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Tổng món ăn",
      value: foods.length,
      icon: <Utensils className="w-5 h-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tổng khách hàng",
      value: customers.length,
      icon: <Users className="w-5 h-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="col-span-12">
        <TitleDesc
          title="Tổng quan hệ thống"
          description={`Chào mừng trở lại! Hôm nay là ${new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}
          className="mb-6"
        />
      </div>

      {/* Main Statistics Cards */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statisticsCards.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center">
                    <TrendingUp
                      className={`w-4 h-4 mr-1 ${stat.changeType === "increase" ? "text-green-500" : "text-red-500"}`}
                    />
                    <span
                      className={`text-sm font-medium ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">so với hôm qua</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="col-span-12 lg:col-span-8">
        <Card className="shadow-md">
          <CardHeader header="Thống kê nhanh" className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800">Thống kê nhanh</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStatsCards.map((stat, index) => (
                <div key={index} className={`${stat.bgColor} p-4 rounded-lg border border-opacity-20`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <div className="col-span-12 lg:col-span-4">
        <Card className="shadow-md">
          <CardHeader header="Lịch làm việc" className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800">Lịch làm việc</span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Calendar />
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="col-span-12 lg:col-span-8">
        <Card className="shadow-md">
          <CardHeader header="Đơn hàng gần đây" className="flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800">Đơn hàng gần đây</span>
            </div>
            <Link
              href="/quan-tri/quan-ly/don-hang"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, idx) => {
                      const statusInfo = getStatusInfo(order.status)
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.customer?.name || "Khách vãng lai"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleString("vi-VN")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {Number(order.total_price).toLocaleString()} ₫
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}
                            >
                              {statusInfo.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Chưa có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications & Quick Actions */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        {/* Notifications */}
        <Card className="shadow-md">
          <CardHeader header="Thông báo hệ thống" className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800">Thông báo</span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Đơn hàng chờ xử lý</p>
                  <p className="text-xs text-yellow-700 mt-1">Có {todayStats.pendingOrders} đơn hàng đang chờ xử lý</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Đơn hàng mới</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Có {todayStats.confirmedOrders} đơn hàng đã được xác nhận hôm nay
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Star className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Đánh giá mới</p>
                  <p className="text-xs text-green-700 mt-1">Có {feedbacks.length} đánh giá từ khách hàng</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-md">
          <CardHeader header="Thao tác nhanh" className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800">Thao tác nhanh</span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <Link href="/quan-tri/quan-ly/thuc-don">
                <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
                  <Utensils className="w-4 h-4" />
                  <span className="text-sm">Thêm món</span>
                </Button>
              </Link>

              <Link href="/quan-tri/quan-ly/don-hang">
                <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md">
                  <BarChart2 className="w-4 h-4" />
                  <span className="text-sm">Báo cáo</span>
                </Button>
              </Link>

              <Link href="/quan-tri/quan-ly/don-hang">
                <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Tạo đơn</span>
                </Button>
              </Link>

              <Link href="/quan-tri/quan-ly/nguoi-dung">
                <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Khách hàng</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedbacks */}
      <div className="col-span-12">
        <Card className="shadow-md">
          <CardHeader header="Đánh giá gần đây" className="flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800">Đánh giá gần đây</span>
            </div>
            <Link
              href="/quan-tri/quan-ly/phan-hoi"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            {recentFeedbacks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentFeedbacks.map((feedback, index) => (
                  <div key={feedback.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: feedback.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({feedback.rating}/5)</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{feedback.comment || "Không có bình luận"}</p>
                    <div className="mt-2 text-xs text-gray-500">Đơn hàng #{feedback.order_id}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Chưa có đánh giá nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
