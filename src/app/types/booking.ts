/**
 * Interface cho bàn ăn
 */
export interface Table {
  table_id: number;
  table_number: string;
  max_guests: number;
  status: string;
  location?: string;
}

/**
 * Interface cho khung giờ đặt bàn
 */
export interface TimeSlot {
  time: string;
  tables: Table[];
}

/**
 * Interface cho món ăn
 */
export interface FoodItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string | { id: number; name: string };
}

/**
 * Món ăn đã chọn (đặt bàn)
 */
export interface SelectedFoodItem {
  id: number;
  food_id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

/**
 * Thông tin form đặt bàn
 */
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

/**
 * Trạng thái thông báo (popup toast)
 */
export interface NotificationState {
  message: string;
  type: "success" | "error" | "info";
  show: boolean;
}

/**
 * Dữ liệu combo đầy đủ từ server (thường cho admin hoặc gửi lên API)
 */
export interface Combo {
  id: number;
  name: string;
  image: string | null;
  description: string;
  price: string;
  status: number;
  created_at: string;
  updated_at: string;
  combo_items: {
    id: number;
    combo_id: number;
    food_id: number;
    quantity: number;
    food: {
      id: number;
      name: string;
      price: number;
    };
  }[];
}

/**
 * ComboItem: dạng rút gọn để hiển thị ở client (UI)
 */
export interface ComboItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string | null;
  items: {
    food_id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

/**
 * Combo đã chọn (khi đặt bàn)
 */
export interface SelectedComboItem extends ComboItem {
  combo_id: number;
  quantity: number;
  price: number; // Ensure it's number type
}

/**
 * Gửi dữ liệu đặt bàn về API
 */
export interface BookingRequest {
  reservation: BookingFormData;
  foods: SelectedFoodItem[];
  combos: SelectedComboItem[];
}

/**
 * Dữ liệu combo đầy đủ dùng trong wrapper handleAddCombo (client chuẩn bị gửi lên API)
 */
export interface FullComboData {
  id: number;
  name: string;
  image?: string;
  description?: string;
  price: string;
  status: number;
  created_at: string;
  updated_at: string;
  combo_items: {
    id: number;
    combo_id: number;
    food_id: number;
    quantity: number;
    food: {
      id: number;
      name: string;
      price: number;
    };
  }[];
}
