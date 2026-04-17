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
    <div className="flex h-screen bg-[#F5F5F7]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1D1D1F] flex flex-col shrink-0 shadow-[2px_0_12px_rgba(0,0,0,0.15)]">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/[0.08]">
          <p className="text-white font-bold text-xl" style={{ letterSpacing: '-0.44px' }}>BBSM</p>
          <p className="text-white/40 text-xs mt-0.5 tracking-wide">Admin Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#E07830] text-white shadow-[rgba(224,120,48,0.4)_0px_4px_12px]'
                    : 'text-white/60 hover:bg-white/[0.08] hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/[0.08]">
          <p className="text-white/30 text-xs tracking-wide">Phase 1 MVP</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
