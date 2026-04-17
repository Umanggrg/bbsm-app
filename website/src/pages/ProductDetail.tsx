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
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-black/[0.07] bg-cream">
        <nav className="max-w-7xl mx-auto px-5 h-11 flex items-center gap-2 text-xs text-mid-gray">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          {p && <><ChevronRight size={12} /><span className="text-navy font-semibold truncate max-w-[200px]">{p.name}</span></>}
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-12">
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-gray-100 rounded-2xl" />
            <div className="space-y-4 pt-2">
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-8 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-12 bg-gray-100 rounded w-2/5 mt-6" />
              <div className="h-3 bg-gray-100 rounded w-full mt-4" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          </div>
        )}

        {isError && (
          <div className="py-28 text-center">
            <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-5">
              <Package size={36} className="text-gray-300" />
            </div>
            <p className="text-navy font-bold text-xl">Product not found</p>
            <Link to="/products" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark">
              <ArrowLeft size={14} /> Back to Products
            </Link>
          </div>
        )}

        {p && (
          <div className="grid md:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square bg-cream rounded-2xl border border-black/[0.07] flex items-center justify-center overflow-hidden">
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  : <Package size={80} className="text-gray-200" />
                }
              </div>
              {p.is_featured && (
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Star size={11} fill="currentColor" /> Featured
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {(p.category || p.subcategory) && (
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-mid-gray mb-4">
                  {p.category && <span>{p.category}</span>}
                  {p.category && p.subcategory && <ChevronRight size={12} />}
                  {p.subcategory && <span>{p.subcategory}</span>}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight leading-tight">{p.name}</h1>
              {p.name_ne && <p className="text-mid-gray mt-2 text-base">{p.name_ne}</p>}

              <div className="flex items-baseline gap-2 mt-7 mb-7 pb-7 border-b border-black/[0.07]">
                <span className="text-5xl font-bold text-primary tracking-tight">Rs {Number(p.price).toLocaleString()}</span>
                <span className="text-mid-gray text-xl">/ {p.unit}</span>
              </div>

              {p.description && (
                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-mid-gray mb-2">About this product</p>
                  <p className="text-navy/70 leading-relaxed text-sm">{p.description}</p>
                </div>
              )}

              {p.sku && (
                <div className="inline-flex items-center gap-2 self-start px-4 py-2.5 bg-cream rounded-xl border border-black/[0.07] mb-6">
                  <Tag size={13} className="text-mid-gray" />
                  <span className="text-xs text-mid-gray">SKU</span>
                  <span className="text-xs font-mono font-bold text-navy">{p.sku}</span>
                </div>
              )}

              <p className="text-xs text-mid-gray mt-auto pt-6 border-t border-black/[0.07] leading-relaxed">
                Available at all 28 BBSM stores across Nepal. Prices may vary by location. While stocks last.
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-black/[0.07]">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-mid-gray hover:text-primary transition-colors group">
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to all products
          </Link>
        </div>
      </div>
    </div>
  );
}
