// In development, Vite proxies /api → localhost:4000.
// In production on Vercel, VITE_API_BASE is set to the backend URL.
const BASE = `${import.meta.env.VITE_API_BASE ?? ''}/api/v1`;

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? `API error ${res.status}`);
  return json.data;
}

export const api = {
  promotions: {
    list: (category?: string) =>
      get(`/promotions${category ? `?category=${category}&limit=40` : '?limit=40'}`),
    categories: () => get('/promotions/categories'),
    get: (id: string) => get(`/promotions/${id}`),
  },
  stores: {
    list: (province?: string) =>
      get(`/stores${province ? `?province=${province}` : ''}`),
    provinces: () => get('/stores/provinces'),
    get: (id: string) => get(`/stores/${id}`),
  },
  products: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return get(`/products${qs}`);
    },
    categories: () => get('/products/categories'),
    get: (id: string) => get(`/products/${id}`),
  },
};
