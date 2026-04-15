/**
 * usePromotions — React Query hooks for promotions data
 *
 * Caches for 5 minutes — promotions change more frequently than stores.
 */
import { useQuery } from '@tanstack/react-query';
import { API, apiFetch } from '@/constants/Api';
import { Promotion } from '@/types';

// ── List promotions ────────────────────────────────────────────────────────
interface PromotionsResponse {
  promotions: Promotion[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export function usePromotions(category?: string, limit = 20) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  params.set('limit', String(limit));
  const url = `${API.promotions.list}?${params.toString()}`;

  return useQuery({
    queryKey: ['promotions', category ?? 'all', limit],
    queryFn: () => apiFetch<PromotionsResponse>(url),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// ── Single promotion ───────────────────────────────────────────────────────
interface PromotionResponse {
  promotion: Promotion;
}

export function usePromotion(id: string) {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: () => apiFetch<PromotionResponse>(API.promotions.detail(id)),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

// ── Categories ────────────────────────────────────────────────────────────
interface CategoriesResponse {
  categories: string[];
}

export function usePromotionCategories() {
  return useQuery({
    queryKey: ['promotions', 'categories'],
    queryFn: () => apiFetch<CategoriesResponse>(API.promotions.categories),
    staleTime: 10 * 60 * 1000,
  });
}
