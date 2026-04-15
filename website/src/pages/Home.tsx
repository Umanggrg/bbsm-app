import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapPin, Tag, ShoppingCart, ChevronRight, Star, Clock, Package } from 'lucide-react';
import { api } from '../api/client';

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
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #fff 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-white/30">
              <Star size={12} fill="currentColor" />
              Nepal's #1 Supermarket
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Everything you need,<br />
              <span className="text-white/75">all in one place.</span>
            </h1>
            <p className="mt-5 text-white/70 text-lg leading-relaxed max-w-md">
              28 stores across Nepal. Thousands of products. Exclusive weekly deals. Serving Nepal since 1984.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/stores"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
              >
                <MapPin size={16} />
                Find a Store
              </Link>
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 text-white font-semibold rounded-xl hover:bg-white/25 transition-colors border border-white/30"
              >
                <Tag size={16} />
                View Offers
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { value: '28', label: 'Stores Nationwide', icon: '🏪' },
              { value: '100K+', label: 'Daily Customers', icon: '👥' },
              { value: '1984', label: 'Established', icon: '🏆' },
              { value: '5000+', label: 'Products', icon: '📦' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
                <p className="text-3xl mb-1">{s.icon}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-white/65 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features strip ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: MapPin, title: '28 Locations', desc: 'Stores across all major cities in Nepal' },
            { icon: Tag, title: 'Weekly Deals', desc: 'Exclusive discounts updated every week' },
            { icon: ShoppingCart, title: 'App Shopping', desc: 'Order online, pick up in-store — coming soon' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                <Icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">{title}</p>
                <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Current Offers ────────────────────────────────────────────── */}
      {promotions.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Hot Deals</p>
              <h2 className="text-3xl font-bold text-navy tracking-tight">Current Offers</h2>
            </div>
            <Link to="/offers" className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
              See all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promotions.map((p: any) => (
              <Link key={p.id} to={`/offers/${p.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-black/[0.04]">
                <div className="h-44 bg-primary-light flex items-center justify-center relative">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-primary/20 tracking-widest">BBSM</span>
                  )}
                  {p.category && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {p.category}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-navy text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {p.title}
                  </p>
                  {p.description && (
                    <p className="text-gray-400 text-xs mt-1.5 line-clamp-2">{p.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-3">
                    <Clock size={11} className="text-gray-400" />
                    <p className="text-[11px] text-gray-400">
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
        <section className="max-w-6xl mx-auto px-5 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Shop Now</p>
              <h2 className="text-3xl font-bold text-navy tracking-tight">Featured Products</h2>
            </div>
            <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
              Browse all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((p: any) => (
              <Link key={p.id} to="/products" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-black/[0.04] hover:-translate-y-0.5">
                <div className="h-36 bg-cream flex items-center justify-center relative overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Package size={32} className="text-gray-200" />
                  )}
                  {p.category && (
                    <span className="absolute top-2 left-2 bg-black/50 text-white text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {p.category}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-navy text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {p.name}
                  </p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="font-bold text-primary">Rs {Number(p.price).toLocaleString()}</span>
                    <span className="text-xs text-gray-400">/{p.unit}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Store Locator Strip ───────────────────────────────────────── */}
      <section className="bg-white border-y border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-steel mb-2">Locations</p>
              <h2 className="text-3xl font-bold text-navy tracking-tight">Find Your Store</h2>
            </div>
            <Link to="/stores" className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
              All 28 stores <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stores.map((s: any) => (
              <div key={s.id} className="bg-cream rounded-xl p-4 border border-black/[0.04]">
                <div className="w-8 h-8 bg-steel-light rounded-lg flex items-center justify-center mb-3">
                  <MapPin size={15} className="text-steel" />
                </div>
                <p className="font-semibold text-navy text-sm">{s.name}</p>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{s.address}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock size={10} className="text-gray-400" />
                  <p className="text-[11px] text-gray-400">{s.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Download CTA ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="bg-navy rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #E07830 0%, transparent 60%)' }} />
          <div className="relative">
            <div className="text-5xl mb-5">📱</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Shop BBSM on the go
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8">
              Download our app to browse offers, find nearby stores, and get exclusive mobile-only deals.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://apps.apple.com" className="inline-flex items-center gap-2.5 bg-white text-navy px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors">
                📱 Download on App Store
              </a>
              <a href="https://play.google.com" className="inline-flex items-center gap-2.5 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20">
                🤖 Get on Google Play
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
