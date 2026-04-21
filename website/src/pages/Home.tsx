import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  MapPin, ChevronRight, Clock, Package, Star,
  Wheat, Milk, Wine, Sparkles, ShoppingBag, Soup, Apple, Cookie,
  Smartphone, ShieldCheck, Zap,
} from 'lucide-react';
import { api } from '../api/client';
import { useScrollRevealAll } from '../hooks/useScrollReveal';

/* ── Department tiles ──────────────────────────────────────────────────── */
const departments = [
  { label: 'Grains & Pulses', icon: Wheat,       color: 'bg-amber-50 text-amber-700',  ring: 'hover:ring-amber-200' },
  { label: 'Dairy',           icon: Milk,        color: 'bg-sky-50 text-sky-700',      ring: 'hover:ring-sky-200' },
  { label: 'Beverages',       icon: Wine,        color: 'bg-purple-50 text-purple-700',ring: 'hover:ring-purple-200' },
  { label: 'Snacks',          icon: Cookie,      color: 'bg-orange-50 text-orange-700',ring: 'hover:ring-orange-200' },
  { label: 'Personal Care',   icon: Sparkles,    color: 'bg-rose-50 text-rose-700',    ring: 'hover:ring-rose-200' },
  { label: 'Spices & Condiments', icon: Soup,    color: 'bg-red-50 text-red-700',      ring: 'hover:ring-red-200' },
  { label: 'Oil & Ghee',      icon: Apple,       color: 'bg-yellow-50 text-yellow-700',ring: 'hover:ring-yellow-200' },
  { label: 'Household',       icon: ShoppingBag, color: 'bg-green-50 text-green-700',  ring: 'hover:ring-green-200' },
];

const stats = [
  { value: '28',    label: 'Stores Nationwide', sub: 'All major cities' },
  { value: '100K+', label: 'Daily Customers',   sub: 'Across Nepal' },
  { value: '40+',   label: 'Years Serving Nepal',sub: 'Since 1984' },
  { value: '5,000+',label: 'Products',          sub: 'All categories' },
];

const features = [
  { icon: ShieldCheck, label: 'Quality Guaranteed',  desc: 'Every product hand-picked and quality-checked before it reaches our shelves.', color: 'bg-green-50 text-green-600' },
  { icon: Zap,         label: 'Fresh Every Day',     desc: 'Produce restocked daily. Find the freshest groceries at every BBSM location.', color: 'bg-amber-50 text-amber-600' },
  { icon: Smartphone,  label: 'Shop Anytime',        desc: 'Browse 5,000+ products online, save your list, and walk in ready to shop.', color: 'bg-sky-50 text-sky-600' },
];

/* ── Section heading ───────────────────────────────────────────────────── */
function SectionHead({ label, title, link, linkLabel }: {
  label: string; title: string; link?: string; linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">{label}</p>
        <h2 className="text-2xl md:text-3xl font-bold text-navy" style={{ letterSpacing: '-0.44px' }}>{title}</h2>
      </div>
      {link && (
        <Link to={link} className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group shrink-0">
          {linkLabel ?? 'See all'}
          <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  useScrollRevealAll();

  const { data: promoData }   = useQuery({ queryKey: ['promos'],            queryFn: () => api.promotions.list() });
  const { data: storeData }   = useQuery({ queryKey: ['stores'],            queryFn: () => api.stores.list() });
  const { data: productData } = useQuery({ queryKey: ['featured-products'], queryFn: () => api.products.list({ featured: 'true', limit: '8' }) });

  const promotions     = promoData?.promotions?.slice(0, 3) ?? [];
  const stores         = storeData?.stores?.slice(0, 3) ?? [];
  const featuredProducts = productData?.products?.slice(0, 8) ?? [];

  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Floating orbs */}
        <div className="orb w-96 h-96 bg-white/10 top-[-80px] right-[-60px] animate-float" />
        <div className="orb w-64 h-64 bg-white/8 bottom-[-40px] left-[10%] animate-float-slow" />
        <div className="orb w-48 h-48 bg-orange-300/20 top-[30%] right-[20%] animate-float" style={{ animationDelay: '2s' }} />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div className="max-w-7xl mx-auto px-5 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center relative z-10">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6 animate-fade-up">
              <Star size={11} fill="currentColor" />
              Nepal's #1 Supermarket Since 1984
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.06]" style={{ letterSpacing: '-0.44px', animationDelay: '0.05s' }}>
              Fresh deals,<br />
              <span className="relative">
                every week.
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/30 rounded-full" />
              </span>
            </h1>

            <p className="mt-5 text-white/70 text-base md:text-lg leading-relaxed max-w-sm animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Shop 5,000+ products at any of our 28 stores across Nepal — or browse online, anytime.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/95 active:scale-95 transition-all shadow-lg text-sm hover:-translate-y-0.5"
              >
                View Weekly Ad
              </Link>
              <Link
                to="/stores"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 active:scale-95 transition-all text-sm"
              >
                <MapPin size={15} />
                Find a Store
              </Link>
            </div>
          </div>

          {/* Right: stats grid (desktop only) */}
          <div className="hidden md:grid grid-cols-2 gap-3">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/15 transition-colors animate-fade-up"
                style={{ animationDelay: `${0.1 + i * 0.07}s` }}
              >
                <p className="text-3xl font-bold text-white tracking-tight">{s.value}</p>
                <p className="text-sm font-semibold text-white/80 mt-1">{s.label}</p>
                <p className="text-xs text-white/45 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar (mobile-visible) ────────────────────────────────────── */}
      <section className="bg-navy">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.08] rounded-2xl overflow-hidden">
            {stats.map((s) => (
              <div key={s.label} className="bg-navy px-5 py-5 text-center md:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary tracking-tight">{s.value}</p>
                <p className="text-xs font-semibold text-white/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Department ────────────────────────────────────────────── */}
      <section className="border-b border-black/[0.07] bg-white">
        <div className="max-w-7xl mx-auto px-5 py-12">
          <div className="reveal">
            <SectionHead label="Browse" title="Shop by Department" link="/products" linkLabel="All products" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 [&::-webkit-scrollbar]:hidden">
            {departments.map(({ label, icon: Icon, color, ring }, i) => (
              <Link
                key={label}
                to={`/products?category=${encodeURIComponent(label)}`}
                className="group flex flex-col items-center gap-2.5 py-4 shrink-0 w-20 reveal"
                style={{ transitionDelay: `${i * 0.04}s` }}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color} group-hover:scale-110 transition-all duration-200 shadow-card ring-2 ring-transparent ${ring} group-hover:shadow-md`}>
                  <Icon size={22} />
                </div>
                <p className="text-center text-[11px] font-semibold text-navy leading-tight line-clamp-2 w-full group-hover:text-primary transition-colors">{label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Weekly Deals ──────────────────────────────────────────────────── */}
      {promotions.length > 0 && (
        <section className="bg-cream border-b border-black/[0.07]">
          <div className="max-w-7xl mx-auto px-5 py-14">
            <div className="reveal">
              <SectionHead label="This Week" title="Weekly Ad & Deals" link="/offers" linkLabel="See all deals" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {promotions.map((p: any, i: number) => (
                <Link
                  key={p.id}
                  to={`/offers/${p.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-200 reveal"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="h-48 bg-primary-light relative overflow-hidden flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-5xl font-bold text-primary/10 select-none tracking-widest">BBSM</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    {p.category && (
                      <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                        {p.category}
                      </span>
                    )}
                    <p className="absolute bottom-3 left-4 right-4 text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow-sm">
                      {p.title}
                    </p>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className="text-mid-gray" />
                      <p className="text-xs text-mid-gray">
                        Until {new Date(p.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary group-hover:gap-1.5 flex items-center gap-1 transition-all">
                      View deal <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="bg-white border-b border-black/[0.07]">
          <div className="max-w-7xl mx-auto px-5 py-14">
            <div className="reveal">
              <SectionHead label="Top Picks" title="Featured Products" link="/products" linkLabel="Browse all" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((p: any, i: number) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-200 reveal"
                  style={{ transitionDelay: `${i * 0.05}s` }}
                >
                  <div className="h-40 bg-cream flex items-center justify-center relative overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Package size={36} className="text-gray-200" />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-navy text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg">
                        View details
                      </span>
                    </div>
                    {p.is_featured && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-0.5">
                        <Star size={7} fill="currentColor" /> Top Pick
                      </span>
                    )}
                  </div>
                  <div className="p-3 border-t border-black/[0.05]">
                    <p className="font-semibold text-navy text-xs leading-snug line-clamp-2 group-hover:text-primary transition-colors">{p.name}</p>
                    {p.category && <p className="text-[9px] font-bold text-primary/70 uppercase tracking-wide mt-1">{p.category}</p>}
                    <p className="font-bold text-primary text-sm mt-2">
                      Rs {Number(p.price).toLocaleString()}
                      <span className="text-[10px] text-mid-gray font-normal ml-1">/{p.unit}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why BBSM ──────────────────────────────────────────────────────── */}
      <section className="bg-cream border-b border-black/[0.07]">
        <div className="max-w-7xl mx-auto px-5 py-14">
          <div className="reveal text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Why BBSM</p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy" style={{ letterSpacing: '-0.44px' }}>Nepal's most trusted supermarket</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, label, desc, color }, i) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-7 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-navy text-base mb-2" style={{ letterSpacing: '-0.18px' }}>{label}</h3>
                <p className="text-sm text-mid-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Find a Store ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-black/[0.07]">
        <div className="max-w-7xl mx-auto px-5 py-14">
          <div className="reveal">
            <SectionHead label="Locations" title="Nearest BBSM Stores" link="/stores" linkLabel="All 28 stores" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {stores.map((s: any, i: number) => (
              <Link
                key={s.id}
                to={`/stores/${s.id}`}
                className="group bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-200 reveal"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-steel bg-steel-light px-2.5 py-1 rounded-md">
                    {s.province}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse-soft" /> Open
                  </span>
                </div>
                <h3 className="font-bold text-navy text-sm group-hover:text-primary transition-colors">{s.name}</h3>
                <p className="text-xs text-mid-gray mt-1.5 line-clamp-2 leading-relaxed">{s.address}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Clock size={10} className="text-mid-gray shrink-0" />
                  <p className="text-xs text-mid-gray">{s.hours}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  View store <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Banner ────────────────────────────────────────────────────── */}
      <section className="bg-navy relative overflow-hidden">
        {/* Floating orbs */}
        <div className="orb w-80 h-80 bg-primary/20 top-[-60px] right-[-40px] animate-float" />
        <div className="orb w-56 h-56 bg-orange-400/10 bottom-[-40px] left-[5%] animate-float-slow" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="reveal">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Mobile App</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight" style={{ letterSpacing: '-0.44px' }}>
              Shop BBSM<br className="hidden md:block" /> on the go.
            </h2>
            <p className="text-white/50 mt-3 text-sm max-w-xs leading-relaxed">
              Browse deals, scan barcodes, find stores, and save your shopping list — all from your phone.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 reveal reveal-delay-2">
            <a
              href="https://apps.apple.com"
              className="flex items-center gap-3 px-5 py-3.5 bg-white/10 border border-white/15 rounded-xl hover:bg-white/18 hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-xl shrink-0">📱</div>
              <div>
                <p className="text-[10px] text-white/40 leading-none mb-0.5">Download on the</p>
                <p className="text-sm font-bold text-white group-hover:text-white/90">App Store</p>
              </div>
            </a>
            <a
              href="https://play.google.com"
              className="flex items-center gap-3 px-5 py-3.5 bg-white/10 border border-white/15 rounded-xl hover:bg-white/18 hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-xl shrink-0">🤖</div>
              <div>
                <p className="text-[10px] text-white/40 leading-none mb-0.5">Get it on</p>
                <p className="text-sm font-bold text-white group-hover:text-white/90">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
