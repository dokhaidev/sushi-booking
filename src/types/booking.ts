export interface Table {
  table_id: number;
  table_number: string;
  max_guests: number;
  status: string;
  location?: string;
}

export interface TimeSlot {
  time: string;
  tables: Table[];
}

export interface FoodItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
}

export interface SelectedFoodItem {
  food_id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface BookingFormData {
  customer_id: number;
  guest_count: number;
  reservation_date: string;
  reservation_time: string;
  payment_method: string;
  total_price: number;
  note: string;
  customer_name: string;
  customer_phone: string;
}

export interface NotificationState {
  message: string;
  type: "success" | "error" | "info";
  show: boolean;
}
