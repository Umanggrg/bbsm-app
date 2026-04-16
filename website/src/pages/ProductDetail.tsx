import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Tag, Star } from 'lucide-react';
import { api } from '../api/client';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.products.get(id!),
    enabled: !!id,
  });

  const p = data?.product;

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to Products
      </Link>

      {isLoading && (
        <div className="animate-pulse space-y-6">
          <div className="h-80 bg-gray-100 rounded-2xl" />
          <div className="h-8 bg-gray-100 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-16 bg-gray-100 rounded" />
        </div>
      )}

      {isError && (
        <div className="py-24 text-center">
          <Package size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-semibold">Product not found</p>
          <Link to="/products" className="mt-4 inline-block px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors">
            Back to Products
          </Link>
        </div>
      )}

      {p && (
        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="h-80 bg-cream rounded-2xl flex items-center justify-center overflow-hidden relative">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <Package size={72} className="text-gray-200" />
            )}
            {p.is_featured && (
              <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Star size={10} fill="currentColor" /> Featured
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {/* Category breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {p.category && <span>{p.category}</span>}
              {p.subcategory && <><span>›</span><span>{p.subcategory}</span></>}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-navy tracking-tight leading-tight">{p.name}</h1>
              {p.name_ne && <p className="text-gray-400 mt-1">{p.name_ne}</p>}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 py-4 border-y border-black/[0.06]">
              <span className="text-4xl font-bold text-primary">
                Rs {Number(p.price).toLocaleString()}
              </span>
              <span className="text-gray-400 text-lg">/ {p.unit}</span>
            </div>

            {/* Description */}
            {p.description && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Details</p>
                <p className="text-gray-600 leading-relaxed">{p.description}</p>
              </div>
            )}

            {/* SKU */}
            {p.sku && (
              <div className="flex items-center gap-2 px-4 py-3 bg-cream rounded-xl border border-black/[0.05]">
                <Tag size={13} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">SKU:</span>
                <span className="text-xs font-mono font-semibold text-navy">{p.sku}</span>
              </div>
            )}

            <p className="text-xs text-gray-400">
              Available at all 28 BBSM stores across Nepal. While stocks last.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
