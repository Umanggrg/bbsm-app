import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white mt-24 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-steel/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.08]">

          {/* Brand column */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-xs tracking-widest">BB</span>
                </div>
              </div>
              <div>
                <p className="font-bold text-base tracking-wide">BBSM</p>
                <p className="text-[11px] text-white/40 mt-0.5 tracking-wide">Bhat-Bhateni Supermarket</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Nepal's largest supermarket chain. Established 1984. Serving over 100,000 customers daily across 28 stores.
            </p>
            {/* Contact snippets */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-white/40">
                <MapPin size={13} className="shrink-0" />
                <span>Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/40">
                <Phone size={13} className="shrink-0" />
                <span>+977-1-4168888</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/40">
                <Mail size={13} className="shrink-0" />
                <span>info@bhatbhateni.com</span>
              </div>
            </div>
          </div>

          {/* Nav columns */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-5">Explore</p>
            <ul className="space-y-3">
              {[
                { to: '/products', label: 'Products' },
                { to: '/offers', label: 'Offers & Deals' },
                { to: '/stores', label: 'Find a Store' },
                { to: '/about', label: 'About BBSM' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-5">Company</p>
            <ul className="space-y-3">
              {[
                { label: 'Careers' },
                { label: 'Suppliers' },
                { label: 'Press' },
                { label: 'Privacy Policy' },
              ].map(({ label }) => (
                <li key={label}>
                  <span className="text-sm text-white/55 cursor-default">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* App download */}
          <div className="md:col-span-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-5">Get the App</p>
            <p className="text-sm text-white/50 mb-5 leading-relaxed">
              Shop, browse offers, and find your nearest store — all from your phone.
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://apps.apple.com"
                className="flex items-center gap-3 px-4 py-3 bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl text-sm font-semibold transition-all group"
              >
                <span className="text-xl">📱</span>
                <div>
                  <p className="text-[10px] text-white/40 leading-none mb-0.5">Download on the</p>
                  <p className="text-white text-sm font-bold leading-none">App Store</p>
                </div>
              </a>
              <a
                href="https://play.google.com"
                className="flex items-center gap-3 px-4 py-3 bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl text-sm font-semibold transition-all group"
              >
                <span className="text-xl">🤖</span>
                <div>
                  <p className="text-[10px] text-white/40 leading-none mb-0.5">Get it on</p>
                  <p className="text-white text-sm font-bold leading-none">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {year} Bhat-Bhateni Supermarket & Department Store Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-white/25">Estd. 1984 · Kathmandu, Nepal</p>
        </div>
      </div>
    </footer>
  );
}
