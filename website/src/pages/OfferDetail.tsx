import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight, Zap } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-5 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
        <Link to="/" className="hover:text-navy transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/offers" className="hover:text-navy transition-colors">Offers</Link>
        {p && (
          <>
            <ChevronRight size={14} />
            <span className="text-navy font-semibold truncate max-w-[200px]">{p.title}</span>
          </>
        )}
      </nav>

      {isLoading && (
        <div className="animate-pulse space-y-6">
          <div className="h-80 bg-gray-100 rounded-3xl" />
          <div className="h-5 bg-gray-100 rounded w-1/4" />
          <div className="h-9 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-20 bg-gray-100 rounded mt-4" />
        </div>
      )}

      {isError && (
        <div className="py-28 text-center">
          <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
            <Tag size={36} className="text-primary/40" />
          </div>
          <p className="text-gray-600 font-bold text-xl">Offer not found</p>
          <p className="text-gray-400 text-sm mt-2">This offer may have expired or been removed.</p>
          <Link
            to="/offers"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            <ArrowLeft size={14} /> View all offers
          </Link>
        </div>
      )}

      {p && (
        <div className="space-y-10">

          {/* Hero image */}
          <div className="relative h-72 md:h-96 bg-primary-light rounded-3xl overflow-hidden shadow-sm">
            {p.image_url ? (
              <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl font-bold text-primary/10 tracking-widest select-none">BBSM</span>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Category badge */}
            {p.category && (
              <span className="absolute top-5 left-5 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-md">
                {p.category}
              </span>
            )}

            {/* Title on image */}
            <div className="absolute bottom-5 left-5 right-5">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
                {p.title}
              </h1>
            </div>
          </div>

          {/* Content card */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-black/[0.04] shadow-sm space-y-8">

            {/* Nepali title if present */}
            {p.title_ne && (
              <p className="text-gray-400 text-lg -mt-2">{p.title_ne}</p>
            )}

            {/* Validity dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 px-5 py-4 bg-orange-50 border border-orange-100 rounded-2xl">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Valid until</p>
                  <p className="text-sm font-bold text-navy mt-0.5">{formatDate(p.end_date)}</p>
                </div>
              </div>
              {p.start_date && (
                <div className="flex items-center gap-4 px-5 py-4 bg-cream border border-black/[0.06] rounded-2xl">
                  <div className="w-10 h-10 bg-black/[0.04] rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Started</p>
                    <p className="text-sm font-bold text-navy mt-0.5">{formatDate(p.start_date)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {p.description && (
              <div className="pt-6 border-t border-black/[0.06]">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={14} className="text-primary" fill="currentColor" />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Offer Details</p>
                </div>
                <p className="text-gray-600 leading-relaxed text-base">{p.description}</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="px-5 py-4 bg-cream rounded-2xl border border-black/[0.05] text-xs text-gray-400 leading-relaxed">
              Valid at all 28 BBSM locations across Nepal. While stocks last. BBSM reserves the right to modify or withdraw this offer at any time without prior notice.
            </div>
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-10 pt-8 border-t border-black/[0.06]">
        <Link
          to="/offers"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to all offers
        </Link>
      </div>
    </div>
  );
}
