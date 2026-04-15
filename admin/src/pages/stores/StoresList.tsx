import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { api } from '../../api/client';
import { Store } from '../../types';

interface FormData {
  name: string;
  address: string;
  province: string;
  phone: string;
  hours: string;
  lat: string;
  lng: string;
  manager_name: string;
  is_active: boolean;
}

export default function StoresList() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Store | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ['admin-stores'], queryFn: api.stores.list });
  const stores = data?.stores ?? [];

  const { register, handleSubmit, reset } = useForm<FormData>();

  const openEdit = (store: Store) => {
    setEditing(store);
    reset({
      name: store.name,
      address: store.address,
      province: store.province,
      phone: store.phone,
      hours: store.hours,
      lat: String(store.lat),
      lng: String(store.lng),
      manager_name: store.manager_name,
      is_active: store.is_active,
    });
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      api.stores.update(editing!.id, { ...data, lat: parseFloat(data.lat), lng: parseFloat(data.lng) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-stores'] }); setEditing(null); },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
        <p className="text-gray-500 mt-1">All {stores.length || 28} BBSM locations</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Store</th>
                <th className="px-6 py-3 text-left">Province</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Hours</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stores.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate max-w-xs">{s.address}</p>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{s.province}</td>
                  <td className="px-6 py-3 text-gray-500">{s.phone || '—'}</td>
                  <td className="px-6 py-3 text-gray-500 text-xs">{s.hours}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => openEdit(s)}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit slide-in panel */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50">
          <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <div>
                <h2 className="font-bold text-gray-900">Edit Store</h2>
                <p className="text-gray-400 text-xs mt-0.5">{editing.name}</p>
              </div>
              <button onClick={() => setEditing(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <form className="flex-1 px-6 py-5 space-y-4">
              {[
                { name: 'name', label: 'Store Name', required: true },
                { name: 'address', label: 'Address', required: true },
                { name: 'province', label: 'Province', required: true },
                { name: 'phone', label: 'Phone' },
                { name: 'hours', label: 'Hours', required: true },
                { name: 'manager_name', label: 'Manager Name' },
              ].map(({ name, label, required }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    {...register(name as keyof FormData)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Latitude</label>
                  <input {...register('lat')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Longitude</label>
                  <input {...register('lng')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('is_active')} className="w-4 h-4 accent-[#E07830]" />
                <span className="text-sm font-semibold text-gray-700">Store is active</span>
              </label>

              {mutation.isError && (
                <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                  {(mutation.error as Error).message}
                </p>
              )}
            </form>

            <div className="px-6 py-4 border-t flex gap-3 sticky bottom-0 bg-white">
              <button onClick={() => setEditing(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSubmit((d) => mutation.mutate(d))}
                disabled={mutation.isPending}
                className="flex-1 px-4 py-2.5 bg-[#E07830] text-white rounded-lg text-sm font-semibold hover:bg-[#B85F20] disabled:opacity-50 transition-colors"
              >
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
