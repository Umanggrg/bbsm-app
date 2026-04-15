/**
 * useStores — React Query hooks for store data
 *
 * Caches store data for 10 minutes (stores change infrequently).
 * Handles loading and error states automatically.
 */
import { useQuery } from '@tanstack/react-query';
import { API, apiFetch } from '@/constants/Api';
import { Store } from '@/types';

// ── List all stores ────────────────────────────────────────────────────────
interface StoresResponse {
  stores: Store[];
  total: number;
}

export function useStores(province?: string) {
  const url = province
    ? `${API.stores.list}?province=${encodeURIComponent(province)}`
    : API.stores.list;

  return useQuery({
    queryKey: ['stores', province ?? 'all'],
    queryFn: () => apiFetch<StoresResponse>(url),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// ── Single store ───────────────────────────────────────────────────────────
interface StoreResponse {
  store: Store;
}

export function useStore(id: string) {
  return useQuery({
    queryKey: ['store', id],
    queryFn: () => apiFetch<StoreResponse>(API.stores.detail(id)),
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
}

// ── Province list ──────────────────────────────────────────────────────────
interface ProvincesResponse {
  provinces: string[];
}

export function useProvinces() {
  return useQuery({
    queryKey: ['stores', 'provinces'],
    queryFn: () => apiFetch<ProvincesResponse>(API.stores.provinces),
    staleTime: 30 * 60 * 1000, // 30 minutes — provinces almost never change
  });
}
