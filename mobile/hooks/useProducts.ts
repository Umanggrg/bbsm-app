import { useQuery } from '@tanstack/react-query';
import { API, apiFetch } from '@/constants/Api';

interface Product {
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
  is_featured: boolean;
}

interface ProductsResponse {
  products: Product[];
  pagination: { total: number; limit: number; offset: number; hasMore: boolean };
}

interface ProductResponse {
  product: Product;
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => apiFetch<ProductResponse>(API.products.detail(id)),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useProductList(category?: string, search?: string, limit = 80) {
  const params = new URLSearchParams({ limit: String(limit), offset: '0' });
  if (category) params.set('category', category);
  if (search) params.set('search', search);

  return useQuery({
    queryKey: ['products', category ?? 'all', search ?? '', limit],
    queryFn: () => apiFetch<ProductsResponse>(`${API.products.list}?${params}`),
    staleTime: 5 * 60 * 1000,
  });
}
