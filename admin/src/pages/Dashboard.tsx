import { useQuery } from '@tanstack/react-query';
import { Megaphone, Store, CheckCircle, Clock, TrendingUp, ArrowRight, Package } from 'lucide-react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: promoData }   = useQuery({ queryKey: ['admin-promotions'], queryFn: api.promotions.list });
  const { data: storeData }   = useQuery({ queryKey: ['admin-stores'],     queryFn: api.stores.list });

  const promotions = promoData?.promotions ?? [];
  const stores     = storeData?.stores ?? [];

  const published = promotions.filter((p) => p.is_published).length;
  const active    = promotions.filter((p) => {
    const now = new Date();
    return p.is_published && new Date(p.start_date) <= now && new Date(p.end_date) >= now;
  }).length;

  const stats = [
    { label: 'Total Stores',    value: stores.length || 28, icon: Store,       color: 'bg-blue-500',     iconBg: 'bg-blue-50',     iconColor: 'text-blue-600',    link: '/stores',     sub: 'nationwide locations' },
    { label: 'Promotions',      value: promotions.length,   icon: Megaphone,   color: 'bg-[#E07830]',    iconBg: 'bg-[#FFF2EA]',   iconColor: 'text-[#E07830]',   link: '/promotions', sub: 'total created' },
    { label: 'Published',       value: published,           icon: CheckCircle, color: 'bg-green-500',    iconBg: 'bg-green-50',    iconColor: 'text-green-600',   link: '/promotions', sub: 'live right now' },
    { label: 'Active Now',      value: active,              icon: Clock,       color: 'bg-[#D4A843]',    iconBg: 'bg-amber-50',    iconColor: 'text-amber-600',   link: '/promotions', sub: 'in date range' },
  ];

  const publishRate = promotions.length ? Math.round((published / promotions.length) * 100) : 0;

  return (
    <div className="p-6 md:p-8 max-w-7xl">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#E07830] mb-1.5">Overview</p>
          <h1 className="text-2xl font-bold text-gray-900" style={{ letterSpacing: '-0.44px' }}>Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">BBSM Official App — Content Overview</p>
        </div>
        <Link
          to="/promotions"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#E07830] text-white text-sm font-bold rounded-xl hover:bg-[#B85F20] transition-colors"
        >
          <Megaphone size={14} />
          New Promotion
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor, link, sub }) => (
          <Link
            to={link}
            key={label}
            className="group bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={iconColor} />
              </div>
              <TrendingUp size={14} className="text-gray-300 group-hover:text-[#E07830] transition-colors" />
            </div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      {/* Summary bar */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-8 flex flex-wrap gap-6 items-center">
        <div className="flex-1 min-w-[140px]">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Publish Rate</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E07830] rounded-full transition-all duration-700"
                style={{ width: `${publishRate}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-900 shrink-0">{publishRate}%</span>
          </div>
        </div>
        <div className="h-10 w-px bg-gray-100 hidden sm:block" />
        <div className="text-center">
          <p className="text-2xl font-bold text-[#E07830]">{stores.length || 28}</p>
          <p className="text-xs text-gray-400 mt-0.5">Connected stores</p>
        </div>
        <div className="h-10 w-px bg-gray-100 hidden sm:block" />
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{active}</p>
          <p className="text-xs text-gray-400 mt-0.5">Running promotions</p>
        </div>
        <div className="h-10 w-px bg-gray-100 hidden sm:block" />
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{promotions.length - published}</p>
          <p className="text-xs text-gray-400 mt-0.5">Draft promotions</p>
        </div>
      </div>

      {/* Recent promotions */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div>
            <h2 className="font-bold text-gray-900" style={{ letterSpacing: '-0.18px' }}>Recent Promotions</h2>
            <p className="text-xs text-gray-400 mt-0.5">Last {Math.min(promotions.length, 5)} promotions</p>
          </div>
          <Link
            to="/promotions"
            className="flex items-center gap-1 text-sm font-bold text-[#E07830] hover:text-[#B85F20] transition-colors group"
          >
            Manage all
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {promotions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Megaphone size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-600 font-semibold">No promotions yet</p>
            <p className="text-gray-400 text-sm mt-1">Create your first promotion to display it in the app</p>
            <Link
              to="/promotions"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#E07830] text-white text-sm font-bold rounded-xl hover:bg-[#B85F20] transition-colors"
            >
              <Megaphone size={14} />
              Create Promotion
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Title</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:table-cell">Category</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">End Date</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {promotions.slice(0, 5).map((p, i) => (
                <tr
                  key={p.id}
                  className={`hover:bg-[#FFF8F4] transition-colors ${i < promotions.slice(0,5).length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF2EA] flex items-center justify-center shrink-0">
                        <Package size={13} className="text-[#E07830]" />
                      </div>
                      <span className="font-semibold text-gray-900 line-clamp-1">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 capitalize hidden sm:table-cell">{p.category ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                    {new Date(p.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.is_published ? 'bg-green-500' : 'bg-gray-300'}`} />
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
