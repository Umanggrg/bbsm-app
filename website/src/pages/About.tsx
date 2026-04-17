import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Users, Store, Package, Clock } from 'lucide-react';

const milestones = [
  { year: '1984', title: 'Founded', desc: 'First Bhat-Bhateni store opened in Kathmandu, setting a new standard for Nepali retail.' },
  { year: '2000', title: 'Expansion', desc: 'Grew to multiple locations across Bagmati province to meet growing demand.' },
  { year: '2010', title: 'Nationwide', desc: 'Expanded to all major cities and provinces — Nepal\'s largest supermarket chain.' },
  { year: '2024', title: 'Digital Era', desc: 'Launched the BBSM mobile app and online presence to serve customers everywhere.' },
];

const values = [
  { icon: Users, title: 'Community First', desc: 'Deeply rooted in Nepali culture, serving local communities for over 40 years.', color: 'bg-blue-50 text-blue-700' },
  { icon: Package, title: 'Fresh Quality', desc: 'Only the best — sourced from trusted local and international suppliers.', color: 'bg-green-50 text-green-700' },
  { icon: Store, title: 'True Convenience', desc: '28 stores nationwide — there\'s always a Bhat-Bhateni near you.', color: 'bg-orange-50 text-orange-700' },
  { icon: Clock, title: 'Best Value', desc: 'Competitive pricing and weekly promotions for every family\'s budget.', color: 'bg-purple-50 text-purple-700' },
];

const stats = [
  { value: '40+', label: 'Years of Service' },
  { value: '28', label: 'Stores Nationwide' },
  { value: '100K+', label: 'Daily Customers' },
  { value: '5,000+', label: 'Products' },
];

export default function About() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(224,120,48,0.15),transparent_65%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Est. 1984</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
              Nepal's Most Trusted<br />Supermarket Chain
            </h1>
            <p className="text-white/55 text-base md:text-lg leading-relaxed">
              For over 40 years, Bhat-Bhateni has been where Nepali families shop. We're more than a supermarket — we're part of Nepal's everyday life.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-black/[0.07]">
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`py-8 px-6 text-center ${i < stats.length - 1 ? 'border-r border-black/[0.07]' : ''}`}>
              <p className="text-4xl font-bold text-primary tracking-tight">{s.value}</p>
              <p className="text-sm font-semibold text-navy mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Our Beliefs</p>
          <h2 className="text-2xl md:text-3xl font-bold text-navy tracking-tight">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-black/[0.07] hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${color}`}>
                <Icon size={22} />
              </div>
              <p className="font-bold text-navy mb-2">{title}</p>
              <p className="text-sm text-mid-gray leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-cream border-y border-black/[0.07]">
        <div className="max-w-3xl mx-auto px-5 py-16">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Our Journey</p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy tracking-tight">40 Years of Growth</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-black/[0.07]" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-7 group">
                  <div className="relative z-10 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-white border-2 border-black/[0.07] flex items-center justify-center shadow-sm group-hover:border-primary group-hover:bg-primary-light transition-all">
                      <span className="text-[11px] font-bold text-primary">{m.year}</span>
                    </div>
                  </div>
                  <div className="pt-2.5 pb-6">
                    <p className="font-bold text-navy">{m.title}</p>
                    <p className="text-mid-gray text-sm mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-14 h-14 bg-steel-light rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin size={24} className="text-steel" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-navy tracking-tight mb-3">Visit Us Today</h2>
          <p className="text-mid-gray mb-8 text-sm leading-relaxed">
            With 28 locations across Nepal, there's always a Bhat-Bhateni near you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/stores" className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark active:scale-95 transition-all text-sm shadow-sm">
              Find Your Store <ChevronRight size={15} />
            </Link>
            <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3 bg-cream text-navy font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all text-sm">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
