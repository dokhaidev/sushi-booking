"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface CartFood {
  food_id: number
  name: string
  jpName?: string
  price: number
  quantity: number
  image?: string
  category?: string
}

interface CartCombo {
  combo_id: number
  name: string
  price: number
  quantity: number
  image?: string | null
  items: {
    name: string
    quantity: number
  }[]
}

interface CartContextType {
  foods: CartFood[]
  combos: CartCombo[]
  addFood: (food: Omit<CartFood, "quantity">) => void
  addCombo: (combo: Omit<CartCombo, "quantity">) => void
  removeFood: (foodId: number) => void
  removeCombo: (comboId: number) => void
  updateFoodQuantity: (foodId: number, quantity: number) => void
  updateComboQuantity: (comboId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  // New booking bridge functions
  isBookingMode: boolean
  setBookingMode: (mode: boolean) => void
  syncCartToBooking: () => void
  syncBookingToCart: () => void
  redirectToBooking: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [foods, setFoods] = useState<CartFood[]>([])
  const [combos, setCombos] = useState<CartCombo[]>([])
  const [isBookingMode, setIsBookingMode] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize data from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      // Load cart data
      const savedFoods = localStorage.getItem("cart-foods")
      const savedCombos = localStorage.getItem("cart-combos")

      if (savedFoods) {
        const parsedFoods = JSON.parse(savedFoods)
        if (Array.isArray(parsedFoods)) {
          setFoods(parsedFoods)
        }
      }

      if (savedCombos) {
        const parsedCombos = JSON.parse(savedCombos)
        if (Array.isArray(parsedCombos)) {
          setCombos(parsedCombos)
        }
      }

      // Check booking mode
      const isFromBooking = sessionStorage.getItem("fromBookingPage") === "true"
      const hasBookingData =
        localStorage.getItem("booking_info") ||
        localStorage.getItem("bookingFoods") ||
        localStorage.getItem("bookingCombos")

      const currentPath = window.location.pathname
      const shouldBeInBookingMode = isFromBooking || (hasBookingData && currentPath.includes("sanpham"))

      // If in booking mode and no cart data, sync from booking
      if (shouldBeInBookingMode && foods.length === 0 && combos.length === 0) {
        syncBookingToCartInitial()
      }
    } catch (error) {
      console.error("Error initializing cart:", error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save to localStorage whenever cart changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return

    try {
      localStorage.setItem("cart-foods", JSON.stringify(foods))
    } catch (error) {
      console.error("Error saving foods to localStorage:", error)
    }
  }, [foods, isInitialized])

  useEffect(() => {
    if (!isInitialized) return

    try {
      localStorage.setItem("cart-combos", JSON.stringify(combos))
    } catch (error) {
      console.error("Error saving combos to localStorage:", error)
    }
  }, [combos, isInitialized])

  // Auto-sync to booking when in booking mode (debounced)
  useEffect(() => {
    if (!isInitialized || !isBookingMode) return

    const timeoutId = setTimeout(() => {
      syncCartToBooking()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [foods, combos, isBookingMode, isInitialized])

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!isInitialized) return

      try {
        if (e.key === "cart-foods" && e.newValue) {
          const newFoods = JSON.parse(e.newValue)
          if (Array.isArray(newFoods)) {
            setFoods(newFoods)
          }
        }

        if (e.key === "cart-combos" && e.newValue) {
          const newCombos = JSON.parse(e.newValue)
          if (Array.isArray(newCombos)) {
            setCombos(newCombos)
          }
        }

        if (e.key === "fromBookingPage") {
          const isFromBooking = e.newValue === "true"
          setIsBookingMode(isFromBooking)
        }
      } catch (error) {
        console.error("Error handling storage change:", error)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [isInitialized])

  const addFood = (food: Omit<CartFood, "quantity">) => {
    setFoods((prev) => {
      const existingFood = prev.find((f) => f.food_id === food.food_id)
      if (existingFood) {
        return prev.map((f) => (f.food_id === food.food_id ? { ...f, quantity: f.quantity + 1 } : f))
      }
      return [...prev, { ...food, quantity: 1 }]
    })
  }

  const addCombo = (combo: Omit<CartCombo, "quantity">) => {
    setCombos((prev) => {
      const existingCombo = prev.find((c) => c.combo_id === combo.combo_id)
      if (existingCombo) {
        return prev.map((c) => (c.combo_id === combo.combo_id ? { ...c, quantity: c.quantity + 1 } : c))
      }
      return [...prev, { ...combo, quantity: 1 }]
    })
  }

  const removeFood = (foodId: number) => {
    setFoods((prev) => prev.filter((f) => f.food_id !== foodId))
  }

  const removeCombo = (comboId: number) => {
    setCombos((prev) => prev.filter((c) => c.combo_id !== comboId))
  }

  const updateFoodQuantity = (foodId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFood(foodId)
      return
    }
    setFoods((prev) => prev.map((f) => (f.food_id === foodId ? { ...f, quantity } : f)))
  }

  const updateComboQuantity = (comboId: number, quantity: number) => {
    if (quantity <= 0) {
      removeCombo(comboId)
      return
    }
    setCombos((prev) => prev.map((c) => (c.combo_id === comboId ? { ...c, quantity } : c)))
  }

  const clearCart = () => {
    setFoods([])
    setCombos([])
  }

  const getTotalItems = () => {
    const foodItems = foods.reduce((sum, food) => sum + food.quantity, 0)
    const comboItems = combos.reduce((sum, combo) => sum + combo.quantity, 0)
    return foodItems + comboItems
  }

  const getTotalPrice = () => {
    const foodTotal = foods.reduce((sum, food) => sum + food.price * food.quantity, 0)
    const comboTotal = combos.reduce((sum, combo) => sum + combo.price * combo.quantity, 0)
    return foodTotal + comboTotal
  }

  // Initial sync from booking to cart (without triggering saves)
  const syncBookingToCartInitial = () => {
    try {
      const bookingFoods = localStorage.getItem("bookingFoods")
      const bookingCombos = localStorage.getItem("bookingCombos")

      if (bookingFoods) {
        const parsedFoods = JSON.parse(bookingFoods)
        const cartFoods = parsedFoods.map((food: any) => ({
          food_id: food.food_id,
          name: food.name,
          jpName: food.jpName || undefined,
          price: typeof food.price === "string" ? Number.parseFloat(food.price) : food.price,
          quantity: food.quantity,
          image: food.image || undefined,
          category: food.category || undefined,
        }))
        setFoods(cartFoods)
      }

      if (bookingCombos) {
        const parsedCombos = JSON.parse(bookingCombos)
        const cartCombos = parsedCombos.map((combo: any) => ({
          combo_id: combo.combo_id,
          name: combo.name,
          price: typeof combo.price === "string" ? Number.parseFloat(combo.price) : combo.price,
          quantity: combo.quantity,
          image: combo.image || null,
          items: combo.items || [],
        }))
        setCombos(cartCombos)
      }

      console.log("Initial booking data synced to cart")
    } catch (error) {
      console.error("Error syncing booking to cart initially:", error)
    }
  }

  // Sync cart data to booking localStorage
  const syncCartToBooking = useCallback(() => {
    if (!isInitialized) return

    try {
      // Convert cart foods to booking format
      const bookingFoods = foods.map((food) => ({
        id: food.food_id,
        food_id: food.food_id,
        name: food.name,
        price: food.price,
        quantity: food.quantity,
        image: food.image || null,
        description: null,
        category: food.category || null,
        category_id: 0,
        group_id: null,
        jpName: food.jpName || null,
      }))

      // Convert cart combos to booking format
      const bookingCombos = combos.map((combo) => ({
        id: combo.combo_id,
        combo_id: combo.combo_id,
        name: combo.name,
        price: combo.price,
        quantity: combo.quantity,
        image: combo.image || null,
        description: null,
        items: combo.items.map((item) => ({
          food_id: 0,
          name: item.name,
          price: 0,
          quantity: item.quantity,
          image: null,
          description: null,
        })),
      }))

      localStorage.setItem("bookingFoods", JSON.stringify(bookingFoods))
      localStorage.setItem("bookingCombos", JSON.stringify(bookingCombos))

      console.log("Cart synced to booking:", { bookingFoods, bookingCombos })
    } catch (error) {
      console.error("Error syncing cart to booking:", error)
    }
  }, [foods, combos, isInitialized])

  // Sync booking data to cart
  const syncBookingToCart = useCallback(() => {
    try {
      const bookingFoods = localStorage.getItem("bookingFoods")
      const bookingCombos = localStorage.getItem("bookingCombos")

      if (bookingFoods) {
        const parsedFoods = JSON.parse(bookingFoods)
        const cartFoods = parsedFoods.map((food: any) => ({
          food_id: food.food_id,
          name: food.name,
          jpName: food.jpName || undefined,
          price: typeof food.price === "string" ? Number.parseFloat(food.price) : food.price,
          quantity: food.quantity,
          image: food.image || undefined,
          category: food.category || undefined,
        }))
        setFoods(cartFoods)
      }

      if (bookingCombos) {
        const parsedCombos = JSON.parse(bookingCombos)
        const cartCombos = parsedCombos.map((combo: any) => ({
          combo_id: combo.combo_id,
          name: combo.name,
          price: typeof combo.price === "string" ? Number.parseFloat(combo.price) : combo.price,
          quantity: combo.quantity,
          image: combo.image || null,
          items: combo.items || [],
        }))
        setCombos(cartCombos)
      }

      console.log("Booking synced to cart")
    } catch (error) {
      console.error("Error syncing booking to cart:", error)
    }
  }, [])

  // Redirect to booking page
  const redirectToBooking = useCallback(() => {
    sessionStorage.setItem("fromBookingPage", "true")
    syncCartToBooking()
    router.push("/dat-ban")
  }, [router, syncCartToBooking])

  // Set booking mode and mark in session storage
  const setBookingModeWithStorage = useCallback((mode: boolean) => {
    setIsBookingMode(mode)
    if (mode) {
      sessionStorage.setItem("fromBookingPage", "true")
    } else {
      sessionStorage.removeItem("fromBookingPage")
    }
  }, [])

  return (
    <CartContext.Provider
      value={{
        foods,
        combos,
        addFood,
        addCombo,
        removeFood,
        removeCombo,
        updateFoodQuantity,
        updateComboQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isBookingMode,
        setBookingMode: setBookingModeWithStorage,
        syncCartToBooking,
        syncBookingToCart,
        redirectToBooking,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
