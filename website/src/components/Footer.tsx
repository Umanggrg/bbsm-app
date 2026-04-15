import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-24">
      <div className="max-w-6xl mx-auto px-5 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs tracking-wider">BB</span>
            </div>
            <div>
              <p className="font-bold text-sm tracking-wide">BBSM</p>
              <p className="text-[10px] text-white/50 mt-0.5">Bhat-Bhateni Supermarket</p>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Nepal's largest supermarket chain. Established 1984. 28 stores nationwide serving over 100,000 customers daily.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Explore</p>
          <ul className="space-y-3">
            {[
              { to: '/offers', label: 'Offers & Deals' },
              { to: '/stores', label: 'Find a Store' },
              { to: '/about', label: 'About BBSM' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-white/70 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* App download */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Get the App</p>
          <p className="text-sm text-white/60 mb-4">Shop, find stores, and get exclusive deals on your phone.</p>
          <div className="flex flex-col gap-2">
            <a href="https://apps.apple.com" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">
              📱 App Store
            </a>
            <a href="https://play.google.com" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">
              🤖 Google Play
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Bhat-Bhateni Supermarket & Department Store Pvt. Ltd.</p>
          <p className="text-xs text-white/40">Estd. 1984 · Kathmandu, Nepal</p>
        </div>
      </div>
    </footer>
  );
}
