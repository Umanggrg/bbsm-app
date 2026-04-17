import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-5">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-14 border-b border-white/[0.08]">

          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="BBSM Logo" className="w-10 h-10 object-contain shrink-0" />
              <div>
                <p className="font-bold text-base tracking-wide">BBSM</p>
                <p className="text-[10px] text-white/40 mt-0.5">Bhat-Bhateni Supermarket</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Nepal's largest supermarket chain, established 1984. Serving over 100,000 customers daily at 28 stores nationwide.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-white/40">
                <MapPin size={13} /> <span>Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/40">
                <Phone size={13} /> <span>+977-1-4168888</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/40">
                <Mail size={13} /> <span>info@bhatbhateni.com</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-5">Shop with us</p>
            <ul className="space-y-3">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/offers', label: 'Weekly Ad' },
                { to: '/stores', label: 'Find a Store' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/55 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-5">Company</p>
            <ul className="space-y-3">
              {['About BBSM', 'Careers', 'Suppliers', 'Press'].map((label) => (
                <li key={label}>
                  {label === 'About BBSM'
                    ? <Link to="/about" className="text-sm text-white/55 hover:text-white transition-colors">{label}</Link>
                    : <span className="text-sm text-white/55">{label}</span>
                  }
                </li>
              ))}
            </ul>
          </div>

          {/* App */}
          <div className="md:col-span-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-5">More Ways to Shop</p>
            <p className="text-sm text-white/50 mb-5 leading-relaxed">
              Download our app for exclusive deals, store finder, and more.
            </p>
            <div className="flex flex-col gap-2.5">
              <a href="https://apps.apple.com" className="flex items-center gap-3 px-4 py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl transition-colors">
                <span className="text-xl">📱</span>
                <div>
                  <p className="text-[10px] text-white/40 leading-none mb-0.5">Download on the</p>
                  <p className="text-sm font-bold text-white leading-none">App Store</p>
                </div>
              </a>
              <a href="https://play.google.com" className="flex items-center gap-3 px-4 py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl transition-colors">
                <span className="text-xl">🤖</span>
                <div>
                  <p className="text-[10px] text-white/40 leading-none mb-0.5">Get it on</p>
                  <p className="text-sm font-bold text-white leading-none">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {year} Bhat-Bhateni Supermarket & Department Store Pvt. Ltd. All rights reserved.</p>
          <p>Estd. 1984 · Kathmandu, Nepal</p>
        </div>
      </div>
    </footer>
  );
}
