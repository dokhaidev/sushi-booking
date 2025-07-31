"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  Search,
  Star,
  Sparkles,
  Crown,
  Gift,
  ChevronLeft,
  ChevronRight,
  Filter,
  ShoppingCart,
  Menu,
  Home,
  Phone,
  MapPin,
} from "lucide-react"
import { useCart } from "@/src/app/context/CartContext"
import CartNotification from "@/src/app/components/Cart/CartNotification"
import SimplifiedCartSidebar from "@/src/app/components/Cart/CartSidebar"

interface Category {
  id: number
  name: string
}

interface Food {
  id: number
  name: string
  jpName: string
  description: string
  price: string
  image: string | null
  category: Category
}

interface ComboItem {
  id: number
  quantity: number
  food: {
    id: number
    name: string
    jpName: string | null
    image: string | null
    description: string
    price: string
  }
}

interface Combo {
  id: number
  name: string
  description: string
  price: string
  image: string | null
  status: number
  combo_items: ComboItem[]
}

export default function SushiProductPageImproved() {
  const router = useRouter()
  const {
    foods: cartFoods,
    combos: cartCombos,
    addFood,
    addCombo,
    updateFoodQuantity,
    updateComboQuantity,
    removeFood,
    removeCombo,
    getTotalItems,
    isBookingMode,
    redirectToBooking,
    syncCartToBooking,
  } = useCart()

  const [categories, setCategories] = useState<Category[]>([])
  const [allFoods, setAllFoods] = useState<Food[]>([])
  const [combos, setCombos] = useState<Combo[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentComboSlide, setCurrentComboSlide] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationItem, setNotificationItem] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const itemsPerPage = 6

  // Sync cart to booking when component mounts if in booking mode
  useEffect(() => {
    if (isBookingMode) {
      syncCartToBooking()
    }
  }, [isBookingMode, syncCartToBooking])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [categoriesRes, foodsRes, combosRes] = await Promise.all([
          axios.get("http://localhost:8000/api/category"),
          axios.get("http://localhost:8000/api/foods"),
          axios.get("http://localhost:8000/api/combos"),
        ])

        setCategories(categoriesRes.data)

        let foodsData: Food[] = []
        if (foodsRes.data?.data && Array.isArray(foodsRes.data.data)) {
          foodsData = foodsRes.data.data as Food[]
        } else if (Array.isArray(foodsRes.data)) {
          foodsData = foodsRes.data as Food[]
        }
        setAllFoods(foodsData.sort((a, b) => b.id - a.id))

        if (Array.isArray(combosRes.data?.data)) {
          setCombos(combosRes.data.data)
        } else if (Array.isArray(combosRes.data)) {
          setCombos(combosRes.data)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Client-side filtering and pagination
  const { filteredFoods, paginatedFoods, totalPages, totalItems } = useMemo(() => {
    let filtered = allFoods

    if (selectedCategory) {
      filtered = allFoods.filter((food) => food.category?.id === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (food) =>
          (food.name?.toLowerCase() ?? "").includes(query) ||
          (food.jpName?.toLowerCase() ?? "").includes(query) ||
          (food.description?.toLowerCase() ?? "").includes(query),
      )
    }

    const totalItemsCount = filtered.length
    const totalPagesCount = Math.ceil(totalItemsCount / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage)

    return {
      filteredFoods: filtered,
      paginatedFoods: paginated,
      totalPages: totalPagesCount,
      totalItems: totalItemsCount,
    }
  }, [allFoods, selectedCategory, searchQuery, currentPage, itemsPerPage])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  // Handle add food to cart
  const handleAddFood = (food: Food) => {
    const cartFood = {
      food_id: food.id,
      name: food.name,
      jpName: food.jpName,
      price: Number.parseFloat(food.price),
      image: food.image || undefined,
      category: food.category?.name,
    }

    addFood(cartFood)
    setNotificationItem(food.name)
    setShowNotification(true)

    // Auto-sync to booking if in booking mode
    if (isBookingMode) {
      setTimeout(() => {
        syncCartToBooking()
      }, 100)
    }
  }

  // Handle add combo to cart
  const handleAddCombo = (combo: Combo) => {
    const cartCombo = {
      combo_id: combo.id,
      name: combo.name,
      price: Number.parseFloat(combo.price),
      image: combo.image,
      items: combo.combo_items.map((item) => ({
        name: item.food.name,
        quantity: item.quantity,
      })),
    }

    addCombo(cartCombo)
    setNotificationItem(combo.name)
    setShowNotification(true)

    // Auto-sync to booking if in booking mode
    if (isBookingMode) {
      setTimeout(() => {
        syncCartToBooking()
      }, 100)
    }
  }

  // Slider navigation
  const nextComboSlide = () => {
    setCurrentComboSlide((prev) => (prev + 1) % combos.length)
  }

  const prevComboSlide = () => {
    setCurrentComboSlide((prev) => (prev - 1 + combos.length) % combos.length)
  }

  // Calculate original price for combo
  const calculateOriginalPrice = (combo: Combo) => {
    return combo.combo_items.reduce((total, item) => {
      return total + Number(item.food.price) * item.quantity
    }, 0)
  }

  // Handle proceed to reservation
  const handleProceedToReservation = () => {
    redirectToBooking()
  }

  // Cart button component
  const CartButton = ({ onClick, itemCount }: { onClick: () => void; itemCount: number }) => (
    <button
      onClick={onClick}
      className="relative bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          {itemCount > 99 ? "99+" : itemCount}
        </div>
      )}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {itemCount > 0 ? `${itemCount} món trong giỏ` : "Giỏ hàng trống"}
      </div>
    </button>
  )

  return (
    <div className="min-h-screen bg-[#F8F1E9] relative overflow-hidden">
      {/* Cart Notification */}
      <CartNotification
        show={showNotification}
        itemName={notificationItem}
        onClose={() => setShowNotification(false)}
      />

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <CartButton onClick={() => setIsCartOpen(true)} itemCount={getTotalItems()} />
      </div>

      {/* Cart Sidebar */}
      <SimplifiedCartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        foods={cartFoods}
        combos={cartCombos}
        onUpdateFoodQuantity={updateFoodQuantity}
        onUpdateComboQuantity={updateComboQuantity}
        onRemoveFood={removeFood}
        onRemoveCombo={removeCombo}
        onProceedToReservation={handleProceedToReservation}
        isBookingMode={isBookingMode}
      />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-[#A68345] to-[#BD944A]"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-r from-[#BD944A] to-[#A68345]"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 rounded-full bg-gradient-to-r from-[#A68345] to-[#BD944A]"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 rounded-full bg-gradient-to-r from-[#BD944A] to-[#A68345]"></div>
      </div>

      {/* Premium Combos Slider Section */}
      {combos.length > 0 && (
        <div id="combos-section" className="relative z-10 px-4 my-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8 text-[#A68345]" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#A68345] to-[#BD944A] bg-clip-text text-transparent">
                  PREMIUM COMBOS
                </h2>
                <Crown className="w-8 h-8 text-[#BD944A]" />
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-[#A68345] to-[#BD944A] mx-auto rounded-full"></div>
            </div>

            <div className="relative">
              {combos.length > 1 && (
                <>
                  <button
                    onClick={prevComboSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#A68345]" />
                  </button>
                  <button
                    onClick={nextComboSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5 text-[#A68345]" />
                  </button>
                </>
              )}

              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentComboSlide * 100}%)` }}
                >
                  {combos.map((combo) => {
                    const originalPrice = calculateOriginalPrice(combo)
                    const savings = originalPrice - Number(combo.price)
                    return (
                      <div key={combo.id} className="w-full flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-2">
                          <div className="flex flex-col md:flex-row h-[700px]">
                            <div className="md:w-[60%] p-8 flex flex-col justify-between">
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white px-3 py-1 rounded-full flex items-center gap-1">
                                    <Gift className="w-4 h-4" />
                                    <span className="font-bold text-xs">COMBO</span>
                                  </div>
                                  <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                  </div>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">{combo.name}</h3>
                              </div>

                              <div className="mb-4">
                                <p className="text-gray-600 text-lg leading-relaxed">{combo.description}</p>
                              </div>

                              <div className="mb-4 flex-1">
                                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                  <Star className="w-5 h-5 text-[#A68345]" />
                                  Combo bao gồm:
                                </h4>
                                <div className="h-64 overflow-hidden">
                                  <div
                                    className={`gap-3 h-full ${
                                      combo.combo_items.length <= 3 ? "grid grid-cols-1" : "grid grid-cols-2"
                                    }`}
                                  >
                                    {combo.combo_items.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 h-fit"
                                      >
                                        <div className="bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                          {item.quantity}
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                          <img
                                            src={item.food.image || "/placeholder.svg?height=48&width=48"}
                                            alt={item.food.name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-gray-900 truncate">{item.food.name}</p>
                                          {item.food.jpName && (
                                            <p className="text-sm text-[#A68345] truncate">{item.food.jpName}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4">
                                <div className="bg-gradient-to-r from-[#A68345]/10 to-[#BD944A]/10 rounded-2xl p-6 text-center">
                                  <p className="text-lg text-gray-600 mb-2">Giá combo</p>
                                  <span className="text-5xl font-bold bg-gradient-to-r from-[#A68345] to-[#BD944A] bg-clip-text text-transparent">
                                    {Number(combo.price).toLocaleString("vi-VN")}₫
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleAddCombo(combo)}
                                className="w-full bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                              >
                                <Crown className="w-6 h-6" />
                                Thêm Combo - {Number(combo.price).toLocaleString("vi-VN")}₫
                              </button>
                            </div>

                            <div className="md:w-[40%] relative">
                              <div className="h-64 md:h-full relative overflow-hidden md:rounded-r-2xl">
                                <img
                                  src={combo.image || "/placeholder.svg?height=600&width=400"}
                                  alt={combo.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10"></div>
                                <div className="absolute top-6 right-6">
                                  <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                                    Tiết kiệm {savings.toLocaleString("vi-VN")}₫
                                  </div>
                                </div>
                                <div className="absolute bottom-6 left-6">
                                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-gray-800">
                                    {combo.combo_items.length} món ăn
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {combos.length > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  {combos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentComboSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentComboSlide
                          ? "bg-gradient-to-r from-[#A68345] to-[#BD944A] scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div id="products-section" className="relative z-10 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#A68345] to-[#BD944A] bg-clip-text text-transparent mb-4">
              SUSHI MENU
            </h2>
            <p className="text-lg text-gray-600">寿司メニュー</p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#A68345] to-[#BD944A] mx-auto rounded-full mt-4"></div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-[#A68345]/20 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#A68345]" />
                    Bộ lọc
                  </h3>
                  {(selectedCategory || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategory(null)
                        setSearchQuery("")
                      }}
                      className="text-sm text-[#A68345] hover:text-[#BD944A] font-medium"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#A68345]" />
                    Tìm kiếm
                  </h4>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A68345] w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tìm sushi... 🍣"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-[#A68345]/30 focus:border-[#A68345] focus:outline-none bg-white/90 backdrop-blur-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#A68345]" />
                    Danh mục ({categories.length})
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                        selectedCategory === null
                          ? "bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white shadow-lg"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span className="font-medium">Tất cả danh mục</span>
                      <span className="float-right text-sm opacity-75">({allFoods.length})</span>
                    </button>
                    {categories.map((category) => {
                      const categoryCount = allFoods.filter((food) => food.category?.id === category.id).length
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                            selectedCategory === category.id
                              ? "bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white shadow-lg"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span className="font-medium">{category.name}</span>
                          <span className="float-right text-sm opacity-75">({categoryCount})</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#A68345] border-t-transparent"></div>
                  <div className="ml-4 text-gray-600">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="text-gray-600">
                      {totalItems > 0 ? (
                        <>
                          Hiển thị{" "}
                          <span className="font-semibold text-[#A68345]">{(currentPage - 1) * itemsPerPage + 1}</span> -{" "}
                          <span className="font-semibold text-[#A68345]">
                            {Math.min(currentPage * itemsPerPage, totalItems)}
                          </span>{" "}
                          trong tổng số <span className="font-semibold text-[#A68345]">{totalItems}</span> sản phẩm
                        </>
                      ) : (
                        "Không tìm thấy sản phẩm nào"
                      )}
                    </div>
                    {totalPages > 1 && (
                      <div className="text-sm text-gray-500">
                        Trang {currentPage} / {totalPages}
                      </div>
                    )}
                  </div>

                  {paginatedFoods.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
                      {paginatedFoods.map((food, index) => (
                        <div
                          key={food.id}
                          className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-[#A68345]/10 hover:border-[#A68345]/30"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={food.image || "/placeholder.svg?height=200&width=300"}
                              alt={food.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-3 left-3">
                              <span className="bg-white/90 backdrop-blur-sm text-[#A68345] px-2 py-1 rounded-full text-xs font-medium">
                                {food.category?.name}
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#A68345] transition-colors">
                              {food.name}
                            </h3>
                            <p className="text-[#A68345] font-medium mb-2 text-sm">{food.jpName}</p>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{food.description}</p>

                            <div className="flex items-center justify-between mb-4">
                              <span className="text-2xl font-bold bg-gradient-to-r from-[#A68345] to-[#BD944A] bg-clip-text text-transparent">
                                {Number(food.price).toLocaleString("vi-VN")}₫
                              </span>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={() => handleAddFood(food)}
                              className="w-full bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white py-2.5 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                              Thêm vào giỏ hàng
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 bg-gradient-to-r from-[#A68345] to-[#BD944A] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy sushi nào</h3>
                      <p className="text-gray-500 mb-4">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn</p>
                      <button
                        onClick={() => {
                          setSelectedCategory(null)
                          setSearchQuery("")
                        }}
                        className="bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                      >
                        Xóa tất cả bộ lọc
                      </button>
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          currentPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-[#A68345] hover:bg-gradient-to-r hover:from-[#A68345] hover:to-[#BD944A] hover:text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        ← Trước
                      </button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white shadow-lg scale-110"
                                : "bg-white text-[#A68345] hover:bg-gray-50 shadow-md hover:shadow-lg"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          currentPage === totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-[#A68345] hover:bg-gradient-to-r hover:from-[#A68345] hover:to-[#BD944A] hover:text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        Sau →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
