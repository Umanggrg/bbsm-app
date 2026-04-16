import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { api } from '../api/client';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function OfferDetail() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['promotion', id],
    queryFn: () => api.promotions.get(id!),
    enabled: !!id,
  });

  const p = data?.promotion;

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <Link
        to="/offers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to Offers
      </Link>

      {isLoading && (
        <div className="animate-pulse space-y-6">
          <div className="h-72 bg-gray-100 rounded-2xl" />
          <div className="h-7 bg-gray-100 rounded w-1/3" />
          <div className="h-10 bg-gray-100 rounded w-2/3" />
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      )}

      {isError && (
        <div className="py-24 text-center">
          <Tag size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-semibold">Offer not found</p>
          <p className="text-gray-400 text-sm mt-1">This offer may have expired or been removed</p>
          <Link to="/offers" className="mt-4 inline-block px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors">
            View all offers
          </Link>
        </div>
      )}

      {p && (
        <div className="space-y-8">
          {/* Hero image */}
          <div className="h-72 bg-primary-light rounded-2xl overflow-hidden flex items-center justify-center relative">
            {p.image_url ? (
              <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-7xl font-bold text-primary/10 tracking-widest">BBSM</span>
            )}
            {p.category && (
              <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                {p.category}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-navy tracking-tight leading-tight">{p.title}</h1>
              {p.title_ne && <p className="text-gray-400 mt-1">{p.title_ne}</p>}
            </div>

            {/* Validity */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 border border-orange-100 rounded-xl">
                <Clock size={14} className="text-primary" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Valid until</p>
                  <p className="text-sm font-bold text-navy">{formatDate(p.end_date)}</p>
                </div>
              </div>
              {p.start_date && (
                <div className="flex items-center gap-2 px-4 py-3 bg-cream border border-black/[0.06] rounded-xl">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Started</p>
                    <p className="text-sm font-bold text-navy">{formatDate(p.start_date)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {p.description && (
              <div className="pt-4 border-t border-black/[0.06]">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Offer Details</p>
                <p className="text-gray-600 leading-relaxed text-base">{p.description}</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="px-5 py-4 bg-cream rounded-xl border border-black/[0.05] text-xs text-gray-400 leading-relaxed">
              Valid at all 28 BBSM locations across Nepal. While stocks last.
              BBSM reserves the right to modify or withdraw this offer at any time.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
