import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Search, X, Star, SlidersHorizontal } from 'lucide-react';
import { api } from '../api/client';

interface Product {
  id: string; name: string; name_ne: string | null; sku: string | null;
  description: string | null; category: string | null; subcategory: string | null;
  price: number; unit: string; image_url: string | null; is_featured: boolean;
}

function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      to={`/products/${p.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-black/[0.07] hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 block"
    >
      <div className="h-44 bg-cream flex items-center justify-center relative overflow-hidden">
        {p.image_url
          ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
          : <Package size={40} className="text-gray-200" />
        }
        {p.is_featured && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1">
            <Star size={8} fill="currentColor" /> Featured
          </span>
        )}
      </div>
      <div className="p-4 border-t border-black/[0.05]">
        {p.category && <p className="text-[10px] font-semibold text-mid-gray uppercase tracking-wider mb-1">{p.category}</p>}
        <p className="font-semibold text-navy text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">{p.name}</p>
        {p.name_ne && <p className="text-mid-gray text-xs mt-0.5">{p.name_ne}</p>}
        <div className="flex items-baseline gap-1 mt-3 pt-3 border-t border-black/[0.05]">
          <span className="text-base font-bold text-primary">Rs {Number(p.price).toLocaleString()}</span>
          <span className="text-xs text-mid-gray">/{p.unit}</span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse border border-black/[0.07]">
      <div className="h-44 bg-gray-100" />
      <div className="p-4 space-y-2.5 border-t border-black/[0.05]">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-5 bg-gray-100 rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') ?? '');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout((window as any).__st);
    (window as any).__st = setTimeout(() => setDebouncedSearch(val), 400);
  };

  const params: Record<string, string> = { limit: '80', offset: '0' };
  if (activeCategory) params.category = activeCategory;
  if (debouncedSearch) params.search = debouncedSearch;

  const { data: catData } = useQuery({ queryKey: ['product-categories'], queryFn: api.products.categories });
  const { data, isLoading, refetch } = useQuery({ queryKey: ['products', params], queryFn: () => api.products.list(params) });

  const products: Product[] = data?.products ?? [];
  const total: number = data?.pagination?.total ?? products.length;
  const categories: string[] = catData?.categories ?? [];
  const hasFilter = !!activeCategory || !!debouncedSearch;
  const clearAll = () => { setSearch(''); setDebouncedSearch(''); setActiveCategory(''); };

  return (
    <div className="bg-white">
      {/* Page header */}
      <div className="border-b border-black/[0.07] bg-white">
        <div className="max-w-7xl mx-auto px-5 py-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Browse</p>
          <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">Products</h1>
          <p className="text-mid-gray mt-1.5 text-sm">
            {isLoading ? 'Loading…' : `${total.toLocaleString()} products across ${categories.length} categories`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mid-gray" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-10 pr-9 py-2.5 text-sm border border-black/[0.10] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            />
            {search && (
              <button onClick={() => { setSearch(''); setDebouncedSearch(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-mid-gray hover:text-navy">
                <X size={14} />
              </button>
            )}
          </div>
          {hasFilter && (
            <button onClick={clearAll} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-mid-gray hover:text-navy border border-black/[0.10] rounded-xl bg-white transition-colors">
              <SlidersHorizontal size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory('')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!activeCategory ? 'bg-primary text-white' : 'bg-cream text-navy hover:bg-gray-200'}`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c === activeCategory ? '' : c)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${activeCategory === c ? 'bg-primary text-white' : 'bg-cream text-navy hover:bg-gray-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Active filter strip */}
        {hasFilter && !isLoading && (
          <div className="flex items-center justify-between mb-6 px-4 py-3 bg-primary-light rounded-xl border border-primary/10">
            <p className="text-sm font-semibold text-primary">
              {products.length} result{products.length !== 1 ? 's' : ''}
              {activeCategory ? ` in "${activeCategory}"` : ''}{debouncedSearch ? ` for "${debouncedSearch}"` : ''}
            </p>
            <button onClick={clearAll} className="text-xs font-bold text-primary hover:text-primary-dark">Clear ×</button>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="py-28 text-center">
            <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-5">
              <Package size={36} className="text-gray-300" />
            </div>
            <p className="text-navy font-bold text-lg">{hasFilter ? 'No products match your filters' : 'No products yet'}</p>
            <p className="text-mid-gray text-sm mt-2">{hasFilter ? 'Try adjusting your search or category.' : 'Check back soon.'}</p>
            {hasFilter
              ? <button onClick={clearAll} className="mt-6 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark">Clear filters</button>
              : <button onClick={() => refetch()} className="mt-6 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark">Retry</button>
            }
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
