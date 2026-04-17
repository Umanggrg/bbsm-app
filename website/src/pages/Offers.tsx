import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Offers() {
  const [category, setCategory] = useState<string | undefined>();

  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: api.promotions.categories });
  const { data, isLoading } = useQuery({ queryKey: ['promotions', category], queryFn: () => api.promotions.list(category) });

  const promotions = data?.promotions ?? [];
  const categories = catData?.categories ?? [];
  const total = data?.pagination?.total ?? promotions.length;

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-black/[0.07]">
        <div className="max-w-7xl mx-auto px-5 py-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Deals & Savings</p>
          <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">Weekly Ad & Offers</h1>
          <p className="text-mid-gray mt-1.5 text-sm">
            {isLoading ? 'Loading…' : `${total} active offer${total !== 1 ? 's' : ''} across all BBSM stores`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Category chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setCategory(undefined)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!category ? 'bg-primary text-white' : 'bg-cream text-navy hover:bg-gray-200'}`}
            >
              All
            </button>
            {categories.map((c: string) => (
              <button
                key={c}
                onClick={() => setCategory(category === c ? undefined : c)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${category === c ? 'bg-primary text-white' : 'bg-cream text-navy hover:bg-gray-200'}`}
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
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-black/[0.07]">
                <div className="h-48 bg-gray-100" />
                <div className="p-4 space-y-2 border-t border-black/[0.05]">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : promotions.length === 0 ? (
          <div className="py-28 text-center">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
              <Tag size={36} className="text-primary/40" />
            </div>
            <p className="text-navy font-bold text-lg">No offers in this category right now</p>
            <p className="text-mid-gray text-sm mt-2">Check back soon for new deals</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promotions.map((p: any) => (
              <Link
                key={p.id}
                to={`/offers/${p.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-black/[0.07] hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="h-52 bg-primary-light relative overflow-hidden flex items-center justify-center">
                  {p.image_url
                    ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                    : <span className="text-6xl font-bold text-primary/10 select-none tracking-widest">BBSM</span>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  {p.category && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {p.category}
                    </span>
                  )}
                  <p className="absolute bottom-3 left-4 right-4 text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow">
                    {p.title}
                  </p>
                </div>
                <div className="px-4 py-3 border-t border-black/[0.05] flex items-center justify-between">
                  {p.description && (
                    <p className="text-mid-gray text-xs line-clamp-1 flex-1 mr-3">{p.description}</p>
                  )}
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock size={10} className="text-mid-gray" />
                    <p className="text-[11px] text-mid-gray">Until {formatDate(p.end_date)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
