/** Core domain types shared across screens and components */

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
  created_at: string;
  updated_at: string;
}

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

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
