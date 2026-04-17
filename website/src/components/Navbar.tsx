import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, MapPin, Tag, Smartphone } from 'lucide-react';

import logo from '../assets/logo.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/products', label: 'Products' },
    { to: '/offers', label: 'Weekly Deals' },
    { to: '/stores', label: 'Find a Store' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* ── Utility bar ───────────────────────────────────────────────── */}
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-5 h-9 flex items-center justify-between">
          <p className="text-xs text-white/60 hidden sm:block">
            Nepal's Largest Supermarket — 28 Stores Nationwide
          </p>
          <div className="flex items-center gap-5 ml-auto">
            <Link to="/stores" className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
              <MapPin size={11} />
              Find a Store
            </Link>
            <Link to="/offers" className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
              <Tag size={11} />
              Weekly Ad
            </Link>
            <a href="https://apps.apple.com" className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
              <Smartphone size={11} />
              Get the App
            </a>
          </div>
        </div>
      </div>

      {/* ── Main navbar ───────────────────────────────────────────────── */}
      <div className={`border-b border-black/[0.08] transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group" onClick={() => setOpen(false)}>
            <img src={logo} alt="BBSM Logo" className="w-10 h-10 object-contain shrink-0" />
            <div className="leading-none">
              <p className="font-bold text-navy text-base tracking-wide group-hover:text-primary transition-colors">BBSM</p>
              <p className="text-[10px] text-mid-gray tracking-wide mt-0.5">Bhat-Bhateni</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    isActive ? 'text-primary bg-primary-light' : 'text-navy hover:text-primary hover:bg-primary-lighter'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3 ml-auto shrink-0">
            <a
              href="https://apps.apple.com"
              className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark active:scale-95 transition-all"
            >
              Download App
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-cream transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-b border-black/[0.08] ${open ? 'max-h-80' : 'max-h-0'}`}>
        <div className="px-5 py-3 flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'text-primary bg-primary-light' : 'text-navy hover:bg-cream'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://apps.apple.com"
            className="mt-2 flex items-center justify-center px-4 py-3 bg-primary text-white text-sm font-bold rounded-xl"
          >
            Download App
          </a>
        </div>
      </div>
    </header>
  );
}
