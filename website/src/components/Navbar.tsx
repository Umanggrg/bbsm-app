import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/products', label: 'Products' },
    { to: '/offers', label: 'Offers' },
    { to: '/stores', label: 'Stores' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/[0.06]">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs tracking-wider">BB</span>
          </div>
          <div>
            <p className="font-bold text-navy text-sm leading-none tracking-wide">BBSM</p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">Bhat-Bhateni</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${isActive ? 'text-primary' : 'text-gray-500 hover:text-navy'}`
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
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Download App
          </a>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-black/[0.06] px-5 py-4 flex flex-col gap-4">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? 'text-primary' : 'text-gray-600'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://apps.apple.com"
            className="inline-flex justify-center px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg"
          >
            Download App
          </a>
        </div>
      )}
    </header>
  );
}
