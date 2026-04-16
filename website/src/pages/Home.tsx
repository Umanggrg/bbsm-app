import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapPin, Tag, ChevronRight, Clock, Package, Zap, Star, TrendingUp } from 'lucide-react';
import { api } from '../api/client';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
      <span className="w-4 h-px bg-primary" />
      {children}
    </span>
  );
}

export default function Home() {
  const { data: promoData } = useQuery({ queryKey: ['promos'], queryFn: () => api.promotions.list() });
  const { data: storeData } = useQuery({ queryKey: ['stores'], queryFn: () => api.stores.list() });
  const { data: productData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.products.list({ featured: 'true', limit: '8' }),
  });

  const promotions = promoData?.promotions?.slice(0, 6) ?? [];
  const stores = storeData?.stores?.slice(0, 4) ?? [];
  const featuredProducts = productData?.products?.slice(0, 8) ?? [];

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-[#C05D15] clip-diagonal overflow-hidden pb-24">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern" />
        {/* Radial glow */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-black/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-10 md:pt-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-bold px-3.5 py-1.5 rounded-full mb-7 backdrop-blur-sm">
              <Star size={11} fill="currentColor" />
              Nepal's #1 Supermarket Since 1984
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Everything<br />
              <span className="text-white/75">you need,</span><br />
              one place.
            </h1>
            <p className="mt-5 text-white/70 text-base md:text-lg leading-relaxed max-w-sm">
              28 stores across Nepal. Thousands of products. Exclusive weekly deals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/stores"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/95 active:scale-95 transition-all shadow-xl shadow-black/20"
              >
                <MapPin size={16} />
                Find a Store
              </Link>
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 active:scale-95 transition-all backdrop-blur-sm"
              >
                <Tag size={16} />
                View Offers
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { value: '28', label: 'Stores Nationwide', icon: '🏪', color: 'bg-white/15' },
              { value: '100K+', label: 'Daily Customers', icon: '👥', color: 'bg-white/10' },
              { value: '40+', label: 'Years of Trust', icon: '🏆', color: 'bg-white/10' },
              { value: '5,000+', label: 'Products', icon: '📦', color: 'bg-white/15' },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.color} border border-white/20 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/20 transition-colors`}
              >
                <p className="text-3xl mb-3">{s.icon}</p>
                <p className="text-3xl font-bold text-white tracking-tight">{s.value}</p>
                <p className="text-sm text-white/60 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features strip ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-black/[0.05]">
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/[0.05]">
          {[
            { icon: MapPin, title: '28 Locations', desc: 'Stores across all major cities and provinces in Nepal', color: 'text-steel bg-steel-light' },
            { icon: Zap, title: 'Weekly Deals', desc: 'Fresh discounts every week across all categories', color: 'text-primary bg-primary-light' },
            { icon: TrendingUp, title: 'Quality Promise', desc: 'Sourced locally and internationally for the best value', color: 'text-emerald-600 bg-emerald-50' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex items-start gap-4 px-6 py-6 first:pl-0 last:pr-0 md:first:pl-0 md:last:pr-0">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="font-bold text-navy text-sm">{title}</p>
                <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Current Offers ────────────────────────────────────────────── */}
      {promotions.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-20">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <SectionLabel>Hot Deals</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">Current Offers</h2>
            </div>
            <Link
              to="/offers"
              className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group"
            >
              See all
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promotions.map((p: any) => (
              <Link
                key={p.id}
                to={`/offers/${p.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-black/[0.04] hover:-translate-y-1"
              >
                <div className="h-48 bg-primary-light flex items-center justify-center relative overflow-hidden">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-primary/15 tracking-widest">BBSM</span>
                  )}
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {p.category && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                      {p.category}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-white font-bold text-sm leading-snug drop-shadow line-clamp-2">
                      {p.title}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  {p.description && (
                    <p className="text-gray-400 text-xs line-clamp-1 flex-1 mr-3">{p.description}</p>
                  )}
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock size={10} className="text-gray-400" />
                    <p className="text-[11px] text-gray-400 font-medium">
                      Until {new Date(p.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="bg-white border-y border-black/[0.05] py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex items-end justify-between mb-10">
              <div className="space-y-2">
                <SectionLabel>Shop Now</SectionLabel>
                <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">Featured Products</h2>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group"
              >
                Browse all
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((p: any) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-black/[0.04] hover:-translate-y-0.5"
                >
                  <div className="h-36 bg-cream flex items-center justify-center relative overflow-hidden">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                      />
                    ) : (
                      <Package size={32} className="text-gray-200" />
                    )}
                    {p.is_featured && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        <Star size={7} fill="currentColor" /> Top
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-navy text-xs leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="font-bold text-primary text-sm">Rs {Number(p.price).toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400">/{p.unit}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Store Locator Strip ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <SectionLabel>Locations</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">Find Your Store</h2>
          </div>
          <Link
            to="/stores"
            className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group"
          >
            All 28 stores
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stores.map((s: any) => (
            <Link
              key={s.id}
              to="/stores"
              className="group bg-white rounded-2xl p-5 border border-black/[0.04] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-9 h-9 bg-steel-light rounded-xl flex items-center justify-center mb-4 group-hover:bg-steel group-hover:text-white transition-colors">
                <MapPin size={16} className="text-steel group-hover:text-white transition-colors" />
              </div>
              <p className="font-bold text-navy text-sm leading-snug">{s.name}</p>
              <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{s.address}</p>
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-black/[0.05]">
                <Clock size={10} className="text-gray-400 shrink-0" />
                <p className="text-[11px] text-gray-400">{s.hours}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── App Download CTA ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="relative bg-navy rounded-3xl overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 dot-pattern opacity-30" />
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-steel/20 blur-3xl" />

          <div className="relative px-8 py-14 md:px-16 md:py-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary text-xs font-bold px-3.5 py-1.5 rounded-full mb-6">
                <Zap size={11} fill="currentColor" />
                Mobile App
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 leading-tight">
                Shop BBSM<br className="hidden md:block" /> on the go
              </h2>
              <p className="text-white/50 text-base max-w-sm mx-auto mb-10 leading-relaxed">
                Browse offers, find nearby stores, and get exclusive mobile-only deals.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://apps.apple.com"
                  className="inline-flex items-center gap-2.5 bg-white text-navy px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-lg"
                >
                  📱 App Store
                </a>
                <a
                  href="https://play.google.com"
                  className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/20 active:scale-95 transition-all"
                >
                  🤖 Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
