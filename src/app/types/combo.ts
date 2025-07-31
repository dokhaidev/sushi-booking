export interface Combo {
  id: number;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  price: number;
  image?: string;
  status: boolean;
  combo_items?: {
    id: number
    quantity: number
    food: {
      id: number
      name: string
      price: number
      image?: string
    }
  }[]
};

export interface ComboItemAdd {
  food_id: number;
  quantity: number;
}

export interface ComboAdd {
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  price: number;
  image?: File;
  status: boolean;
  items: ComboItemAdd[];
}