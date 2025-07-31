export interface Order {
  id: number;
  customer_id: number;
  total_price: number;
  status: string;
  payment_method: string;
  note?: string;
  reservation_dates?: string[];
  reservation_times?: string[];
  created_at: string;
  updated_at: string;
  customer?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  tables?: {
    id: number;
    table_number: string;
    max_guests: number;
  }[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  food_id?: number;
  combo_id?: number;
  quantity: number;
  price: number;
  status: string;
  created_at?: string;
  food?: {
    id: number;
    name: string;
    image?: string;
  };
  combo?: {
    id: number;
    name: string;
    image?: string;
  };
  order_info?: {
    id: number
    customer_name: string
    table_numbers: string
    order_status: string // Status of the parent order
    order_date: string // created_at of the parent order
    reservation_date?: string // Specific reservation date from order_tables
    reservation_time?: string // Specific reservation time from order_tables
  }
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

// Thêm enum cho status
export enum OrderItemStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  SERVED = "served",
  DONE = "done",
  CANCELLED = "cancelled",
}

// Mapping status tiếng Việt
export const ORDER_ITEM_STATUS_LABELS = {
  [OrderItemStatus.PENDING]: "Chờ xử lý",
  [OrderItemStatus.PREPARING]: "Đang chuẩn bị",
  [OrderItemStatus.SERVED]: "Đã phục vụ",
  [OrderItemStatus.DONE]: "Hoàn thành",
  [OrderItemStatus.CANCELLED]: "Đã hủy",
}

// Mapping màu sắc cho status
export const ORDER_ITEM_STATUS_COLORS = {
  [OrderItemStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrderItemStatus.PREPARING]: "bg-blue-100 text-blue-800",
  [OrderItemStatus.SERVED]: "bg-green-100 text-green-800",
  [OrderItemStatus.DONE]: "bg-gray-100 text-gray-800",
  [OrderItemStatus.CANCELLED]: "bg-red-100 text-red-800",
}