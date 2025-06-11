export interface Food {
  id: number;
  name: string;
  jpName: string;
  description?: string;
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