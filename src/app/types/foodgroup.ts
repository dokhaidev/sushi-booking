export interface Group {
    id: number;
    name: string;
    category?: {
        id: number;
        name: string;
    };
    status?: number; // 1: hiển thị, 0: ẩn
}

export interface FoodGroupAdd {
  name: string;
  category_id: number;
  status?: number; // 1: hiển thị, 0: ẩn
}