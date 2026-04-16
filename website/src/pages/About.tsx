import { Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';

const milestones = [
  { year: '1984', title: 'Founded', desc: 'Bhat-Bhateni opened its first store in Kathmandu, revolutionising the Nepali retail experience.' },
  { year: '2000', title: 'Expansion', desc: 'Grew to multiple locations across the Bagmati province to serve a growing customer base.' },
  { year: '2010', title: 'Nationwide', desc: 'Expanded to all major cities and provinces, becoming Nepal\'s largest supermarket chain.' },
  { year: '2024', title: 'Digital Era', desc: 'Launched the BBSM mobile app and digital presence to bring Bhat-Bhateni online.' },
];

const values = [
  { emoji: '🤝', title: 'Community First', desc: 'Deeply rooted in Nepali culture and committed to serving local communities for over 40 years.' },
  { emoji: '🌿', title: 'Fresh Quality', desc: 'Sourcing the freshest produce and highest-quality products from trusted local and international suppliers.' },
  { emoji: '💰', title: 'Best Value', desc: 'Competitive pricing and weekly promotions so quality is always accessible to every family.' },
  { emoji: '🏪', title: 'True Convenience', desc: '28 stores nationwide so you\'re never far from a Bhat-Bhateni.' },
];

const stats = [
  { value: '40+', label: 'Years of Service', sub: 'Est. 1984' },
  { value: '28', label: 'Stores Nationwide', sub: 'All major cities' },
  { value: '100K+', label: 'Daily Customers', sub: 'Across Nepal' },
  { value: '5,000+', label: 'Products', sub: 'Curated for you' },
];

export default function About() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-steel/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-5 py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary mb-6">
            <span className="w-4 h-px bg-primary" />
            Est. 1984
            <span className="w-4 h-px bg-primary" />
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Nepal's Most<br />
            <span className="text-primary">Loved</span> Supermarket
          </h1>
          <p className="text-white/55 text-lg leading-relaxed max-w-2xl mx-auto">
            For over 40 years, Bhat-Bhateni has been the trusted shopping destination for millions of Nepali families. We're more than a supermarket — we're part of Nepal's story.
          </p>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-black/[0.05]">
        <div className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-black/[0.04]">
          {stats.map((s) => (
            <div key={s.label} className="bg-white text-center py-8 px-4">
              <p className="text-4xl font-bold text-primary tracking-tight">{s.value}</p>
              <p className="text-sm font-semibold text-navy mt-1">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
            <span className="w-4 h-px bg-primary" />
            Our Beliefs
            <span className="w-4 h-px bg-primary" />
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mt-3">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => (
            <div
              key={v.title}
              className="group bg-white rounded-2xl p-7 border border-black/[0.04] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{}}

            >
              <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary transition-colors text-2xl">
                {v.emoji}
              </div>
              <p className="font-bold text-navy text-base mb-2">{v.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-black/[0.05]">
        <div className="max-w-3xl mx-auto px-5 py-20">
          <div className="mb-14 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
              <span className="w-4 h-px bg-primary" />
              Our Journey
              <span className="w-4 h-px bg-primary" />
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mt-3">40 Years of Growth</h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-black/[0.06]" />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-8 group">
                  {/* Year bubble */}
                  <div className="relative z-10 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary-light border-2 border-white shadow-sm flex items-center justify-center group-hover:bg-primary transition-colors">
                      <span className="text-primary font-bold text-[11px] group-hover:text-white transition-colors">{m.year}</span>
                    </div>
                  </div>
                  <div className="pt-2 pb-4">
                    <p className="font-bold text-navy text-lg">{m.title}</p>
                    <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-steel-light rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin size={28} className="text-steel" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mb-4">Visit Us Today</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            With 28 locations across Nepal, there's always a Bhat-Bhateni near you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/stores"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark active:scale-95 transition-all shadow-lg shadow-primary/25"
            >
              Find Your Store
              <ChevronRight size={16} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-navy font-bold rounded-xl border border-black/[0.08] hover:bg-cream active:scale-95 transition-all"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
