export interface FoodItem {
  id: number
  name: string
  description?: string | null
  price: string | number // Changed from number to string | number
  image?: string | null
  category?: {
    id: number
    name: string
    description: string | null
    status: number
    created_at: string
    updated_at: string
  }
  category_id: number
  group_id: number | null
  jpName: string | null
  status: number
  created_at: string
  updated_at: string
}

export interface SelectedFoodItem {
  id: number
  name: string
  price: number // Keep as number since this is processed data
  quantity: number
  image?: string | null
  description?: string | null
  food_id: number
  category_id: number
  group_id: number | null
  jpName: string | null
}

export interface Category {
  id: number
  name: string
  description: string | null
  status: number
  created_at: string
  updated_at: string
}

export interface FoodSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  foods: FoodItem[]
  selectedFoods: SelectedFoodItem[]
  activeFoodCategory: string
  setActiveFoodCategory: (category: string) => void
  onAddFood: (food: FoodItem) => void
  onRemoveFood: (foodId: number) => void
  onQuantityChange: (foodId: number, quantity: number) => void
  totalPrice: number
  isLoading: boolean
  categories: Category[]
}
