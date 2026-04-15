/**
 * API configuration
 *
 * Base URL is read from EXPO_PUBLIC_API_URL env var.
 * Falls back to localhost for development.
 *
 * On a physical device during development, replace localhost with your
 * machine's local network IP address (e.g. http://192.168.1.100:4000).
 */
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:4000';

export const API = {
  baseUrl: BASE_URL,

  stores: {
    list: `${BASE_URL}/api/v1/stores`,
    provinces: `${BASE_URL}/api/v1/stores/provinces`,
    detail: (id: string) => `${BASE_URL}/api/v1/stores/${id}`,
  },

  promotions: {
    list: `${BASE_URL}/api/v1/promotions`,
    categories: `${BASE_URL}/api/v1/promotions/categories`,
    detail: (id: string) => `${BASE_URL}/api/v1/promotions/${id}`,
  },
} as const;

/** Shared fetch helper that unwraps the { success, data, message } envelope */
export async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `Request failed: ${res.status}`);
  }

  return json.data as T;
}
