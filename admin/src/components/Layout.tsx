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
      <aside className="w-60 bg-[#1D1D1F] flex flex-col shrink-0 shadow-[2px_0_20px_rgba(0,0,0,0.2)]">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E07830] rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-black tracking-wider">B</span>
            </div>
            <div>
              <p className="text-white font-bold text-base tracking-wide">BBSM</p>
              <p className="text-white/35 text-[10px] mt-0 tracking-wide">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#E07830] text-white shadow-[rgba(224,120,48,0.35)_0px_4px_16px]'
                    : 'text-white/55 hover:bg-white/[0.07] hover:text-white/90'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-white/[0.04]">
            <div className="w-2 h-2 rounded-full bg-[#E07830] animate-pulse" />
            <p className="text-white/40 text-xs font-medium tracking-wide">Phase 1 — Live</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-[#F5F5F7]">
        {children}
      </main>
    </div>
  );
}
