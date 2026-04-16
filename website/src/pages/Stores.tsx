import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, Clock, Navigation, Search, X } from 'lucide-react';
import { api } from '../api/client';

export default function Stores() {
  const [province, setProvince] = useState<string | undefined>();
  const [search, setSearch] = useState('');

  const { data: provData } = useQuery({ queryKey: ['provinces'], queryFn: api.stores.provinces });
  const { data, isLoading } = useQuery({
    queryKey: ['stores', province],
    queryFn: () => api.stores.list(province),
  });

  const provinces = provData?.provinces ?? [];
  const allStores = data?.stores ?? [];
  const stores = search.trim()
    ? allStores.filter((s: any) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase())
      )
    : allStores;

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">

      {/* Header */}
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-steel">
          <span className="w-4 h-px bg-steel" />
          28 Locations
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight mt-2">Our Stores</h1>
        <p className="text-gray-500 mt-2 text-base">Find the BBSM store nearest to you</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-black/[0.08] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Province chips */}
      {provinces.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setProvince(undefined)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              !province
                ? 'bg-steel text-white shadow-sm'
                : 'bg-white text-gray-500 hover:text-navy border border-black/[0.06] hover:border-black/10'
            }`}
          >
            All Provinces
          </button>
          {provinces.map((p: string) => (
            <button
              key={p}
              onClick={() => setProvince(province === p ? undefined : p)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                province === p
                  ? 'bg-steel text-white shadow-sm'
                  : 'bg-white text-gray-500 hover:text-navy border border-black/[0.06] hover:border-black/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-400 mb-6 font-medium">
        {stores.length} store{stores.length !== 1 ? 's' : ''} found
      </p>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-black/[0.04]">
              <div className="h-5 bg-gray-100 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="py-28 text-center">
          <div className="w-20 h-20 bg-steel-light rounded-full flex items-center justify-center mx-auto mb-5">
            <MapPin size={36} className="text-steel/40" />
          </div>
          <p className="text-gray-600 font-bold text-lg">No stores found</p>
          <p className="text-gray-400 text-sm mt-2">Try a different search or province filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map((s: any) => (
            <div
              key={s.id}
              className="group bg-white rounded-2xl p-5 border border-black/[0.04] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-steel bg-steel-light px-2.5 py-1 rounded-lg">
                  {s.province}
                </span>
                {s.is_active && (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Open
                  </span>
                )}
              </div>

              <h3 className="font-bold text-navy text-base mb-3 group-hover:text-primary transition-colors">
                {s.name}
              </h3>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-start gap-2.5">
                  <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-500 leading-snug">{s.address}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={13} className="text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-500">{s.hours}</p>
                </div>
                {s.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone size={13} className="text-primary shrink-0" />
                    <a
                      href={`tel:${s.phone}`}
                      className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors"
                    >
                      {s.phone}
                    </a>
                  </div>
                )}
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-steel-light text-steel rounded-xl text-sm font-bold hover:bg-steel hover:text-white active:scale-95 transition-all"
              >
                <Navigation size={14} />
                Get Directions
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
