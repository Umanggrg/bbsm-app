import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Tag, Star, ChevronRight } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto px-5 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
        <Link to="/" className="hover:text-navy transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-navy transition-colors">Products</Link>
        {p && (
          <>
            <ChevronRight size={14} />
            <span className="text-navy font-semibold truncate max-w-[200px]">{p.name}</span>
          </>
        )}
      </nav>

      {isLoading && (
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="h-96 bg-gray-100 rounded-3xl" />
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-12 bg-gray-100 rounded w-2/5 mt-6" />
            <div className="h-3 bg-gray-100 rounded w-full mt-4" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
        </div>
      )}

      {isError && (
        <div className="py-28 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Package size={36} className="text-gray-300" />
          </div>
          <p className="text-gray-600 font-bold text-xl">Product not found</p>
          <p className="text-gray-400 text-sm mt-2">This product may no longer be available.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            <ArrowLeft size={14} /> Back to Products
          </Link>
        </div>
      )}

      {p && (
        <div className="grid md:grid-cols-2 gap-12">

          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-cream rounded-3xl flex items-center justify-center overflow-hidden shadow-sm">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <Package size={80} className="text-gray-200" />
              )}
            </div>
            {p.is_featured && (
              <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
                <Star size={11} fill="currentColor" /> Featured
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {/* Breadcrumb category */}
            {(p.category || p.subcategory) && (
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                {p.category && <span>{p.category}</span>}
                {p.category && p.subcategory && <ChevronRight size={12} />}
                {p.subcategory && <span>{p.subcategory}</span>}
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight leading-tight">
              {p.name}
            </h1>
            {p.name_ne && (
              <p className="text-gray-400 mt-2 text-base">{p.name_ne}</p>
            )}

            {/* Price block */}
            <div className="flex items-baseline gap-2 mt-6 mb-6 pb-6 border-b border-black/[0.06]">
              <span className="text-5xl font-bold text-primary tracking-tight">
                Rs {Number(p.price).toLocaleString()}
              </span>
              <span className="text-gray-400 text-xl">/ {p.unit}</span>
            </div>

            {/* Description */}
            {p.description && (
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">About this product</p>
                <p className="text-gray-600 leading-relaxed">{p.description}</p>
              </div>
            )}

            {/* SKU chip */}
            {p.sku && (
              <div className="inline-flex items-center gap-2 self-start px-4 py-2.5 bg-cream rounded-xl border border-black/[0.06] mb-6">
                <Tag size={13} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">SKU</span>
                <span className="text-xs font-mono font-bold text-navy">{p.sku}</span>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-auto pt-6 border-t border-black/[0.06]">
              <p className="text-xs text-gray-400 leading-relaxed">
                Available at all 28 BBSM stores across Nepal. Prices may vary by location. While stocks last.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-12 pt-8 border-t border-black/[0.06]">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to all products
        </Link>
      </div>
    </div>
  );
}
