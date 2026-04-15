import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { api } from '../../api/client';
import { Promotion } from '../../types';
import PromotionForm from './PromotionForm';

export default function PromotionsList() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ['admin-promotions'], queryFn: api.promotions.list });
  const promotions = data?.promotions ?? [];

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.promotions.togglePublish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-promotions'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.promotions.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-promotions'] }); setDeleteTarget(null); },
  });

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (p: Promotion) => { setEditing(p); setFormOpen(true); };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-500 mt-1">{promotions.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E07830] text-white text-sm font-semibold rounded-lg hover:bg-[#B85F20] transition-colors"
        >
          <Plus size={16} /> New Promotion
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">Loading...</div>
        ) : promotions.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500 font-medium">No promotions yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "New Promotion" to create one</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Tier</th>
                <th className="px-6 py-3 text-left">Dates</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {promotions.map((p) => {
                const now = new Date();
                const isLive = p.is_published && new Date(p.start_date) <= now && new Date(p.end_date) >= now;
                const isExpired = new Date(p.end_date) < now;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{p.title}</p>
                      {p.description && <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{p.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{p.category ?? '—'}</td>
                    <td className="px-6 py-4">
                      {p.tier_target ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          p.tier_target === 'platinum' ? 'bg-indigo-100 text-indigo-700' :
                          p.tier_target === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{p.tier_target}</span>
                      ) : <span className="text-gray-400">All</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      <div>{new Date(p.start_date).toLocaleDateString()}</div>
                      <div>→ {new Date(p.end_date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isLive ? 'bg-green-100 text-green-700' :
                        isExpired ? 'bg-red-100 text-red-500' :
                        p.is_published ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {isLive ? 'Live' : isExpired ? 'Expired' : p.is_published ? 'Scheduled' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleMutation.mutate(p.id)}
                          title={p.is_published ? 'Unpublish' : 'Publish'}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          {p.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit form modal */}
      {formOpen && (
        <PromotionForm
          promotion={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => { setFormOpen(false); qc.invalidateQueries({ queryKey: ['admin-promotions'] }); }}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Promotion?</h3>
            <p className="text-gray-500 text-sm mb-6">
              "<span className="font-semibold text-gray-700">{deleteTarget.title}</span>" will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
