import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
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
        <p className="text-xs font-bold uppercase tracking-widest text-steel mb-2">28 Locations</p>
        <h1 className="text-4xl font-bold text-navy tracking-tight">Our Stores</h1>
        <p className="text-gray-500 mt-2">Find the BBSM store nearest to you</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by store name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white border border-black/[0.08] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Province chips */}
      {provinces.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setProvince(undefined)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              !province ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:text-navy border border-black/[0.06]'
            }`}
          >
            All Provinces
          </button>
          {provinces.map((p: string) => (
            <button
              key={p}
              onClick={() => setProvince(province === p ? undefined : p)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                province === p ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:text-navy border border-black/[0.06]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-400 mb-6">{stores.length} store{stores.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="py-24 text-center">
          <MapPin size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-semibold">No stores found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map((s: any) => (
            <div key={s.id} className="bg-white rounded-2xl p-5 border border-black/[0.04] shadow-sm hover:shadow-md transition-shadow">
              {/* Province badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-steel bg-steel-light px-2.5 py-1 rounded-md">
                  {s.province}
                </span>
                {s.is_active && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Open
                  </span>
                )}
              </div>

              <h3 className="font-bold text-navy text-base mb-3">{s.name}</h3>

              <div className="space-y-2">
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
                    <a href={`tel:${s.phone}`} className="text-sm text-primary font-semibold hover:text-primary-dark">
                      {s.phone}
                    </a>
                  </div>
                )}
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-steel-light text-steel rounded-xl text-sm font-semibold hover:bg-steel hover:text-white transition-colors"
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
