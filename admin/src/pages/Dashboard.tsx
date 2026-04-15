import { useQuery } from '@tanstack/react-query';
import { Megaphone, Store, CheckCircle, Clock } from 'lucide-react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: promoData } = useQuery({ queryKey: ['admin-promotions'], queryFn: api.promotions.list });
  const { data: storeData } = useQuery({ queryKey: ['admin-stores'], queryFn: api.stores.list });

  const promotions = promoData?.promotions ?? [];
  const stores = storeData?.stores ?? [];

  const published = promotions.filter((p) => p.is_published).length;
  const active = promotions.filter((p) => {
    const now = new Date();
    return p.is_published && new Date(p.start_date) <= now && new Date(p.end_date) >= now;
  }).length;

  const stats = [
    { label: 'Total Stores', value: stores.length || 28, icon: Store, color: 'bg-blue-500', link: '/stores' },
    { label: 'Total Promotions', value: promotions.length, icon: Megaphone, color: 'bg-[#E07830]', link: '/promotions' },
    { label: 'Published', value: published, icon: CheckCircle, color: 'bg-green-500', link: '/promotions' },
    { label: 'Active Now', value: active, icon: Clock, color: 'bg-[#D4A843]', link: '/promotions' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">BBSM Official App — Content Overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color, link }) => (
          <Link to={link} key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={20} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent promotions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Promotions</h2>
          <Link to="/promotions" className="text-sm text-[#E07830] font-semibold hover:underline">
            Manage all →
          </Link>
        </div>

        {promotions.length === 0 ? (
          <div className="py-16 text-center">
            <Megaphone size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No promotions yet</p>
            <p className="text-gray-400 text-sm mt-1">Create your first promotion to display it in the app</p>
            <Link
              to="/promotions"
              className="inline-block mt-4 px-5 py-2 bg-[#E07830] text-white text-sm font-semibold rounded-lg hover:bg-[#B85F20] transition-colors"
            >
              Create Promotion
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">End Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {promotions.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{p.title}</td>
                  <td className="px-6 py-3 text-gray-500 capitalize">{p.category ?? '—'}</td>
                  <td className="px-6 py-3 text-gray-500">{new Date(p.end_date).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      p.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
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
