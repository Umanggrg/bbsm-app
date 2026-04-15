export interface Promotion {
  id: string;
  title: string;
  title_ne: string | null;
  description: string | null;
  description_ne: string | null;
  image_url: string | null;
  category: string | null;
  tier_target: 'silver' | 'gold' | 'platinum' | null;
  start_date: string;
  end_date: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  province: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  manager_name: string;
  is_active: boolean;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  name_ne: string | null;
  sku: string | null;
  description: string | null;
  category: string | null;
  subcategory: string | null;
  price: number;
  unit: string;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
