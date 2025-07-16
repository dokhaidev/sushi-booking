export interface Feedback {
  id: number
  customer_id: number
  order_id: number
  rating: number
  comment: string | null
  "admin-reply": string | null // Backend uses 'admin-reply'
  created_at: string
  updated_at: string
  // Thêm các trường quan hệ nếu backend trả về (ví dụ: customer, order)
  customer?: {
    id: number
    name: string
    // ...
  }
  order?: {
    id: number
    // ...
  }
}
