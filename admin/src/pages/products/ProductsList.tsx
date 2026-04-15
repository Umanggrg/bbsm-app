import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Upload, Search, X, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../api/client';
import { Product } from '../../types';
import ProductForm from './ProductForm';

export default function ProductsList() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [csvResult, setCsvResult] = useState<{ inserted: number; updated: number; errors: string[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (categoryFilter) params.category = categoryFilter;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', params],
    queryFn: () => api.products.list(params),
  });
  const { data: catData } = useQuery({
    queryKey: ['admin-product-categories'],
    queryFn: api.products.categories,
  });

  const products = data?.products ?? [];
  const categories = catData?.categories ?? [];
  const total = data?.total ?? 0;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.products.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      setDeleteTarget(null);
    },
  });

  const csvMutation = useMutation({
    mutationFn: (file: File) => api.products.csvUpload(file),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['admin-product-categories'] });
      setCsvResult(result);
    },
  });

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvResult(null);
      csvMutation.mutate(file);
    }
    e.target.value = '';
  };

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setFormOpen(true); };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">{total} total</p>
        </div>
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCsvChange} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={csvMutation.isPending}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Upload size={16} />
            {csvMutation.isPending ? 'Uploading...' : 'CSV Upload'}
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#E07830] text-white text-sm font-semibold rounded-lg hover:bg-[#B85F20] transition-colors"
          >
            <Plus size={16} /> New Product
          </button>
        </div>
      </div>

      {/* CSV Result Banner */}
      {csvResult && (
        <div className={`mb-5 rounded-xl border p-4 flex items-start gap-3 ${
          csvResult.errors.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
        }`}>
          {csvResult.errors.length > 0
            ? <AlertCircle size={18} className="text-yellow-500 mt-0.5 shrink-0" />
            : <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />}
          <div className="flex-1 text-sm">
            <p className="font-semibold text-gray-800">
              CSV processed — {csvResult.inserted} inserted, {csvResult.updated} updated
              {csvResult.errors.length > 0 && `, ${csvResult.errors.length} errors`}
            </p>
            {csvResult.errors.length > 0 && (
              <ul className="mt-1.5 space-y-0.5 text-yellow-700">
                {csvResult.errors.map((e, i) => <li key={i}>• {e}</li>)}
              </ul>
            )}
          </div>
          <button onClick={() => setCsvResult(null)} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830] bg-white text-gray-700"
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || categoryFilter) && (
          <button
            onClick={() => { setSearch(''); setCategoryFilter(''); }}
            className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">Loading…</div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || categoryFilter ? 'Try clearing your filters' : 'Click "New Product" or upload a CSV'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">SKU</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-300 text-xs font-bold">
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        {p.name_ne && <p className="text-gray-400 text-xs mt-0.5">{p.name_ne}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.sku ?? '—'}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700 capitalize">{p.category ?? '—'}</div>
                    {p.subcategory && <div className="text-gray-400 text-xs">{p.subcategory}</div>}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Rs {Number(p.price).toLocaleString()}
                    <span className="font-normal text-gray-400 text-xs ml-1">/{p.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {p.is_featured && (
                        <span className="inline-flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FFF2EA] text-[#E07830]">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
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
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Form */}
      {formOpen && (
        <ProductForm
          product={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            qc.invalidateQueries({ queryKey: ['admin-products'] });
            qc.invalidateQueries({ queryKey: ['admin-product-categories'] });
          }}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">
              "<span className="font-semibold text-gray-700">{deleteTarget.name}</span>" will be permanently deleted.
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
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
