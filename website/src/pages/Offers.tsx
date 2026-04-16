import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Tag, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Offers() {
  const [category, setCategory] = useState<string | undefined>();

  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: api.promotions.categories });
  const { data, isLoading } = useQuery({
    queryKey: ['promotions', category],
    queryFn: () => api.promotions.list(category),
  });

  const promotions = data?.promotions ?? [];
  const categories = catData?.categories ?? [];
  const total = data?.pagination?.total ?? promotions.length;

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">

      {/* Header */}
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
          <span className="w-4 h-px bg-primary" />
          Deals & Savings
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight mt-2">Offers & Promotions</h1>
        <p className="text-gray-500 mt-2 text-base">
          {isLoading ? 'Loading…' : `${total} active offer${total !== 1 ? 's' : ''} across all BBSM stores`}
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setCategory(undefined)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              !category
                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                : 'bg-white text-gray-500 hover:text-navy border border-black/[0.06] hover:border-black/10'
            }`}
          >
            All
          </button>
          {categories.map((c: string) => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? undefined : c)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                category === c
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'bg-white text-gray-500 hover:text-navy border border-black/[0.06] hover:border-black/10'
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
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-black/[0.04]">
              <div className="h-52 bg-gray-100" />
              <div className="p-5 space-y-2.5">
                <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                <div className="h-3 bg-gray-100 rounded-lg w-full" />
                <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="py-28 text-center">
          <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
            <Tag size={36} className="text-primary/40" />
          </div>
          <p className="text-gray-600 font-bold text-lg">No offers in this category right now</p>
          <p className="text-gray-400 text-sm mt-2">Check back soon for new deals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {promotions.map((p: any) => (
            <Link
              key={p.id}
              to={`/offers/${p.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-black/[0.04] hover:-translate-y-1"
            >
              {/* Image hero */}
              <div className="h-52 bg-primary-light flex items-center justify-center relative overflow-hidden">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <span className="text-6xl font-bold text-primary/10 tracking-widest select-none">BBSM</span>
                )}
                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Category badge */}
                {p.category && (
                  <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                    {p.category}
                  </span>
                )}

                {/* Title overlaid on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-base leading-snug line-clamp-2 drop-shadow">
                    {p.title}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 py-3.5">
                {p.description && (
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-3">{p.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-400 font-medium">
                      Until {formatDate(p.end_date)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    View <Zap size={10} fill="currentColor" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
