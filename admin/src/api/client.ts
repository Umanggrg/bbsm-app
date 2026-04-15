// In development, Vite proxies /api → localhost:4000.
// In production on Vercel, VITE_API_BASE is set to the backend URL.
const BASE = `${import.meta.env.VITE_API_BASE ?? ''}/api/v1/admin`;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? 'Request failed');
  return json.data as T;
}

export const api = {
  // Promotions
  promotions: {
    list: () => request<{ promotions: import('../types').Promotion[] }>('/promotions'),
    create: (body: object) => request('/promotions', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: object) => request(`/promotions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    togglePublish: (id: string) => request(`/promotions/${id}/publish`, { method: 'PATCH' }),
    delete: (id: string) => request(`/promotions/${id}`, { method: 'DELETE' }),
  },
  // Stores
  stores: {
    list: () => request<{ stores: import('../types').Store[] }>('/stores'),
    update: (id: string, body: object) => request(`/stores/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  },
  // Products
  products: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ products: import('../types').Product[]; total: number }>(`/products${qs}`);
    },
    categories: () => request<{ categories: string[] }>('/products/categories'),
    create: (body: object) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: object) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),
    csvUpload: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return fetch(`${BASE}/products/csv`, { method: 'POST', body: form })
        .then(r => r.json())
        .then(j => { if (!j.success) throw new Error(j.message ?? 'Upload failed'); return j.data; });
    },
  },
};
