import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/products', label: 'Products' },
    { to: '/offers', label: 'Offers' },
    { to: '/stores', label: 'Stores' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-black/[0.06]'
          : 'bg-white/90 backdrop-blur border-b border-black/[0.06]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-xs tracking-widest drop-shadow-sm">BB</span>
            </div>
          </div>
          <div className="leading-none">
            <p className="font-bold text-navy text-[15px] tracking-wide group-hover:text-primary transition-colors">
              BBSM
            </p>
            <p className="text-[10px] text-gray-400 tracking-wide mt-0.5">Bhat-Bhateni</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary bg-primary-light'
                    : 'text-gray-500 hover:text-navy hover:bg-black/[0.04]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://apps.apple.com"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark active:scale-95 transition-all shadow-sm shadow-primary/30"
          >
            <ShoppingBag size={14} />
            Download App
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-black/[0.05] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} className="text-navy" /> : <Menu size={20} className="text-navy" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-black/[0.06] px-5 py-4 flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-primary bg-primary-light'
                    : 'text-gray-600 hover:text-navy hover:bg-black/[0.04]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://apps.apple.com"
            className="mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            <ShoppingBag size={14} />
            Download App
          </a>
        </div>
      </div>
    </header>
  );
}
