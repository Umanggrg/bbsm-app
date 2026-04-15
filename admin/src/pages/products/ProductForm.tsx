import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { api } from '../../api/client';
import { Product } from '../../types';

interface Props {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

const UNITS = ['piece', 'kg', 'g', 'litre', 'ml', 'pack', 'dozen', 'box', 'bag'];

export default function ProductForm({ product, onClose, onSaved }: Props) {
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: '',
    name_ne: '',
    sku: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    unit: 'piece',
    image_url: '',
    is_active: true,
    is_featured: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        name_ne: product.name_ne ?? '',
        sku: product.sku ?? '',
        description: product.description ?? '',
        category: product.category ?? '',
        subcategory: product.subcategory ?? '',
        price: String(product.price),
        unit: product.unit,
        image_url: product.image_url ?? '',
        is_active: product.is_active,
        is_featured: product.is_featured,
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: (body: object) =>
      isEdit ? api.products.update(product!.id, body) : api.products.create(body),
    onSuccess: () => onSaved(),
    onError: (e: Error) => setError(e.message),
  });

  const set = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.price || isNaN(parseFloat(form.price))) { setError('Valid price is required'); return; }
    mutation.mutate({
      ...form,
      price: parseFloat(form.price),
      name_ne: form.name_ne || null,
      sku: form.sku || null,
      description: form.description || null,
      category: form.category || null,
      subcategory: form.subcategory || null,
      image_url: form.image_url || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Basmati Rice"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
            />
          </div>

          {/* Nepali name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Name (Nepali)
            </label>
            <input
              type="text"
              value={form.name_ne}
              onChange={(e) => set('name_ne', e.target.value)}
              placeholder="बासमती चामल"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              SKU
            </label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => set('sku', e.target.value)}
              placeholder="e.g. RIC-BAS-001"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
            />
            <p className="text-gray-400 text-xs mt-1">Used for CSV upserts. Must be unique if set.</p>
          </div>

          {/* Price + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Price (Rs) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Unit
              </label>
              <select
                value={form.unit}
                onChange={(e) => set('unit', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830] bg-white"
              >
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Category + Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                placeholder="e.g. Grains"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Subcategory
              </label>
              <input
                type="text"
                value={form.subcategory}
                onChange={(e) => set('subcategory', e.target.value)}
                placeholder="e.g. Rice"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder="Short product description…"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830] resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Image URL
            </label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => set('image_url', e.target.value)}
              placeholder="https://…"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
            />
            {form.image_url && (
              <img
                src={form.image_url}
                alt="preview"
                className="mt-2 w-24 h-24 rounded-lg object-cover border border-gray-100"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3 pt-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('is_active', !form.is_active)}
                className={`relative w-10 h-6 rounded-full transition-colors ${form.is_active ? 'bg-[#E07830]' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_active ? 'left-5' : 'left-1'}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Active (visible in app & website)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('is_featured', !form.is_featured)}
                className={`relative w-10 h-6 rounded-full transition-colors ${form.is_featured ? 'bg-[#E07830]' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_featured ? 'left-5' : 'left-1'}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Featured (shown on home screen)</span>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="flex-1 px-4 py-2.5 bg-[#E07830] text-white rounded-lg text-sm font-semibold hover:bg-[#B85F20] disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
