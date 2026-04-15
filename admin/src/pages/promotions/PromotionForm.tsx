import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { api } from '../../api/client';
import { Promotion } from '../../types';

interface FormData {
  title: string;
  title_ne: string;
  description: string;
  image_url: string;
  category: string;
  tier_target: string;
  start_date: string;
  end_date: string;
  is_published: boolean;
}

interface Props {
  promotion: Promotion | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = ['grocery', 'electronics', 'fashion', 'home', 'health', 'bakery', 'dairy', 'beverages', 'seasonal', 'other'];

function toDatetimeLocal(iso: string) {
  return iso ? iso.slice(0, 16) : '';
}

export default function PromotionForm({ promotion, onClose, onSaved }: Props) {
  const isEdit = !!promotion;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      title_ne: '',
      description: '',
      image_url: '',
      category: '',
      tier_target: '',
      start_date: '',
      end_date: '',
      is_published: false,
    },
  });

  useEffect(() => {
    if (promotion) {
      reset({
        title: promotion.title,
        title_ne: promotion.title_ne ?? '',
        description: promotion.description ?? '',
        image_url: promotion.image_url ?? '',
        category: promotion.category ?? '',
        tier_target: promotion.tier_target ?? '',
        start_date: toDatetimeLocal(promotion.start_date),
        end_date: toDatetimeLocal(promotion.end_date),
        is_published: promotion.is_published,
      });
    }
  }, [promotion, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const body = {
        ...data,
        tier_target: data.tier_target || null,
        category: data.category || null,
        image_url: data.image_url || null,
        title_ne: data.title_ne || null,
        description: data.description || null,
      };
      return isEdit
        ? api.promotions.update(promotion!.id, body)
        : api.promotions.create(body);
    },
    onSuccess: onSaved,
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50">
      <div className="bg-white h-full w-full max-w-lg shadow-2xl flex flex-col overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900 text-lg">
            {isEdit ? 'Edit Promotion' : 'New Promotion'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-6 py-5 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. Dashain Special — 20% off groceries"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Title Nepali */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Title (Nepali) <span className="text-gray-400 font-normal">optional</span>
            </label>
            <input
              {...register('title_ne')}
              placeholder="दशैं स्पेशल..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Details about the promotion..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830] resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Image URL <span className="text-gray-400 font-normal">optional</span>
            </label>
            <input
              {...register('image_url')}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
            />
          </div>

          {/* Category + Tier */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select
                {...register('category')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830] bg-white"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Tier</label>
              <select
                {...register('tier_target')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830] bg-white"
              >
                <option value="">All customers</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
          </div>

          {/* Start + End dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                {...register('start_date', { required: 'Required' })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                {...register('end_date', { required: 'Required' })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07830]/30 focus:border-[#E07830]"
              />
            </div>
          </div>

          {/* Published toggle */}
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
            <input type="checkbox" {...register('is_published')} className="w-4 h-4 accent-[#E07830]" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Publish immediately</p>
              <p className="text-xs text-gray-500">Visible in the app as soon as Start Date is reached</p>
            </div>
          </label>

          {mutation.isError && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
              {(mutation.error as Error).message}
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="flex-1 px-4 py-2.5 bg-[#E07830] text-white rounded-lg text-sm font-semibold hover:bg-[#B85F20] disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Promotion'}
          </button>
        </div>
      </div>
    </div>
  );
}
