export interface Food {
  id: number;
  name: string;
  name_en:string;
  jpName: string;
  description?: string;
  description_en?: string;
  price: number;
  category_id: number;
  status: boolean;
  season: string
  image?: string;
  group?:{
    id: number;
    name: string;
  }
  category?: {
    id: number;
    name: string;
  };
}

export interface FoodAdd {
  name: string;
  name_en?: string;
  category_id: number;
  group_id?: number;
  jpName?: string;
  description?: string;
  description_en?: string;
  price: number;
  image?: File;
}