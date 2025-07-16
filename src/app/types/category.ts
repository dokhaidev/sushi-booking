export interface Category {
  id: number;
  name: string;
  description?: string;
  status: number;
}

export interface CategoryAdd {
  name: string;
  description?: string;
}