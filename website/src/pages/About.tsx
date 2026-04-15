export default function About() {
  const milestones = [
    { year: '1984', title: 'Founded', desc: 'Bhat-Bhateni opened its first store in Kathmandu.' },
    { year: '2000', title: 'Expansion', desc: 'Grew to multiple locations across the Bagmati province.' },
    { year: '2010', title: 'Nationwide', desc: 'Expanded to all major cities and provinces of Nepal.' },
    { year: '2024', title: 'Digital', desc: 'Launched the BBSM mobile app and online presence.' },
  ];

  const values = [
    { emoji: '🤝', title: 'Community First', desc: 'Deeply rooted in Nepali culture and committed to serving local communities.' },
    { emoji: '🌿', title: 'Fresh Quality', desc: 'Sourcing the freshest produce and highest-quality products for every customer.' },
    { emoji: '💰', title: 'Best Value', desc: 'Competitive pricing and weekly promotions to make quality accessible to all.' },
    { emoji: '🏪', title: 'Convenience', desc: '28 stores nationwide so you\'re never far from a Bhat-Bhateni.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Est. 1984</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
            Nepal's Most Loved Supermarket
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            For over 40 years, Bhat-Bhateni has been the trusted shopping destination for millions of Nepali families. We're more than a supermarket — we're part of Nepal's story.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '40+', label: 'Years of Service' },
            { value: '28', label: 'Stores Nationwide' },
            { value: '100K+', label: 'Daily Customers' },
            { value: '5,000+', label: 'Products' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Our Beliefs</p>
          <h2 className="text-3xl font-bold text-navy tracking-tight">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl p-6 border border-black/[0.04] shadow-sm">
              <p className="text-3xl mb-4">{v.emoji}</p>
              <p className="font-bold text-navy mb-2">{v.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white border-y border-black/[0.06]">
        <div className="max-w-3xl mx-auto px-5 py-16">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Our Journey</p>
            <h2 className="text-3xl font-bold text-navy tracking-tight">40 Years of Growth</h2>
          </div>
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-xs">{m.year}</span>
                  </div>
                  {i < milestones.length - 1 && <div className="flex-1 w-px bg-black/[0.06] mt-3" />}
                </div>
                <div className="pb-8">
                  <p className="font-bold text-navy">{m.title}</p>
                  <p className="text-gray-500 text-sm mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 py-16 text-center">
        <h2 className="text-3xl font-bold text-navy tracking-tight mb-4">Visit Us Today</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">With 28 locations across Nepal, there's always a Bhat-Bhateni near you.</p>
        <a href="/stores" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
          Find Your Store
        </a>
      </section>
    </div>
  );
}
