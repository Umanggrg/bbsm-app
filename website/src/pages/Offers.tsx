import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Offers() {
  const [category, setCategory] = useState<string | undefined>();

  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: api.promotions.categories });
  const { data, isLoading } = useQuery({
    queryKey: ['promotions', category],
    queryFn: () => api.promotions.list(category),
  });

  const promotions = data?.promotions ?? [];
  const categories = catData?.categories ?? [];

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Deals & Savings</p>
        <h1 className="text-4xl font-bold text-navy tracking-tight">Offers & Promotions</h1>
        <p className="text-gray-500 mt-2">
          {data?.pagination?.total ?? '—'} active offers across all BBSM stores
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setCategory(undefined)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              !category ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:text-navy border border-black/[0.06]'
            }`}
          >
            All
          </button>
          {categories.map((c: string) => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? undefined : c)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                category === c ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:text-navy border border-black/[0.06]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="py-24 text-center">
          <Tag size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-semibold">No offers in this category right now</p>
          <p className="text-gray-400 text-sm mt-1">Check back soon for new deals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {promotions.map((p: any) => (
            <Link
              key={p.id}
              to={`/offers/${p.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-black/[0.04] hover:-translate-y-0.5"
            >
              <div className="h-48 bg-primary-light flex items-center justify-center relative overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <span className="text-5xl font-bold text-primary/15 tracking-widest">BBSM</span>
                )}
                {p.category && (
                  <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {p.category}
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="font-semibold text-navy leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {p.title}
                </p>
                {p.description && (
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{p.description}</p>
                )}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-black/[0.05]">
                  <Clock size={12} className="text-gray-400" />
                  <p className="text-xs text-gray-400">
                    Until {new Date(p.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
