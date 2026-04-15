import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Store, Package } from 'lucide-react';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/promotions', label: 'Promotions', icon: Megaphone },
  { to: '/stores', label: 'Stores', icon: Store },
  { to: '/products', label: 'Products', icon: Package },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-[#E07830] flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/20">
          <p className="text-white font-bold text-xl tracking-widest">BBSM</p>
          <p className="text-white/60 text-xs mt-0.5">Admin Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-white text-[#E07830]'
                    : 'text-white/80 hover:bg-white/15 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/20">
          <p className="text-white/50 text-xs">Phase 1 MVP</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
