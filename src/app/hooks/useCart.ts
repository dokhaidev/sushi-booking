"use client"

import { useState, useEffect } from "react"

interface CartFood {
  food_id: number
  name: string
  price: number
  quantity: number
  image?: string
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

export function useCart() {
  const [cartFoods, setCartFoods] = useState<CartFood[]>([])
  const [cartCombos, setCartCombos] = useState<CartCombo[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCartFoods = localStorage.getItem("cartFoods")
    const savedCartCombos = localStorage.getItem("cartCombos")

    if (savedCartFoods) {
      try {
        setCartFoods(JSON.parse(savedCartFoods))
      } catch (error) {
        console.error("Error parsing cart foods from localStorage:", error)
      }
    }

    if (savedCartCombos) {
      try {
        setCartCombos(JSON.parse(savedCartCombos))
      } catch (error) {
        console.error("Error parsing cart combos from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartFoods", JSON.stringify(cartFoods))
  }, [cartFoods])

  useEffect(() => {
    localStorage.setItem("cartCombos", JSON.stringify(cartCombos))
  }, [cartCombos])

  const updateFoodQuantity = (foodId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartFoods((prev) => prev.filter((f) => f.food_id !== foodId))
    } else {
      setCartFoods((prev) => prev.map((f) => (f.food_id === foodId ? { ...f, quantity } : f)))
    }
  }

  const updateComboQuantity = (comboId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartCombos((prev) => prev.filter((c) => c.combo_id !== comboId))
    } else {
      setCartCombos((prev) => prev.map((c) => (c.combo_id === comboId ? { ...c, quantity } : c)))
    }
  }

  const removeFood = (foodId: number) => {
    setCartFoods((prev) => prev.filter((f) => f.food_id !== foodId))
  }

  const removeCombo = (comboId: number) => {
    setCartCombos((prev) => prev.filter((c) => c.combo_id !== comboId))
  }

  const addFood = (food: any) => {
    setCartFoods((prev) => {
      const existingFood = prev.find((f) => f.food_id === food.id)
      if (existingFood) {
        return prev.map((f) => (f.food_id === food.id ? { ...f, quantity: f.quantity + 1 } : f))
      }
      return [
        ...prev,
        {
          food_id: food.id,
          name: food.name,
          price: Number(food.price),
          quantity: 1,
          image: food.image ? `http://localhost:8000/storage/${food.image}` : undefined,
        },
      ]
    })
  }

  const addCombo = (combo: any) => {
    setCartCombos((prev) => {
      const existingCombo = prev.find((c) => c.combo_id === combo.id)
      if (existingCombo) {
        return prev.map((c) => (c.combo_id === combo.id ? { ...c, quantity: c.quantity + 1 } : c))
      }
      return [
        ...prev,
        {
          combo_id: combo.id,
          name: combo.name,
          price: Number(combo.price),
          quantity: 1,
          image: combo.image ? `http://localhost:8000/storage/${combo.image}` : null,
          items: combo.combo_items.map((item: any) => ({
            name: item.food.name,
            quantity: item.quantity,
          })),
        },
      ]
    })
  }

  const getTotalItems = () => {
    return cartFoods.reduce((sum, f) => sum + f.quantity, 0) + cartCombos.reduce((sum, c) => sum + c.quantity, 0)
  }

  const getTotalValue = () => {
    return (
      cartFoods.reduce((sum, f) => sum + f.price * f.quantity, 0) +
      cartCombos.reduce((sum, c) => sum + c.price * c.quantity, 0)
    )
  }

  const clearCart = () => {
    setCartFoods([])
    setCartCombos([])
  }

  return {
    cartFoods,
    cartCombos,
    addFood,
    addCombo,
    updateFoodQuantity,
    updateComboQuantity,
    removeFood,
    removeCombo,
    getTotalItems,
    getTotalValue,
    clearCart,
  }
}
