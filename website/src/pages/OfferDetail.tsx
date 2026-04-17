import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight } from 'lucide-react';
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
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-black/[0.07] bg-cream">
        <nav className="max-w-7xl mx-auto px-5 h-11 flex items-center gap-2 text-xs text-mid-gray">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/offers" className="hover:text-primary transition-colors">Offers</Link>
          {p && <><ChevronRight size={12} /><span className="text-navy font-semibold truncate max-w-[200px]">{p.title}</span></>}
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-12">
        {isLoading && (
          <div className="animate-pulse space-y-6">
            <div className="h-80 bg-gray-100 rounded-2xl" />
            <div className="h-5 bg-gray-100 rounded w-1/4" />
            <div className="h-9 bg-gray-100 rounded w-3/4" />
            <div className="h-20 bg-gray-100 rounded mt-4" />
          </div>
        )}

        {isError && (
          <div className="py-28 text-center">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
              <Tag size={36} className="text-primary/40" />
            </div>
            <p className="text-navy font-bold text-xl">Offer not found</p>
            <p className="text-mid-gray text-sm mt-2">This offer may have expired or been removed.</p>
            <Link to="/offers" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark">
              <ArrowLeft size={14} /> View all offers
            </Link>
          </div>
        )}

        {p && (
          <div className="space-y-8">
            {/* Hero image */}
            <div className="relative h-64 md:h-80 bg-primary-light rounded-2xl overflow-hidden border border-black/[0.07]">
              {p.image_url
                ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><span className="text-8xl font-bold text-primary/10 select-none tracking-widest">BBSM</span></div>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {p.category && (
                <span className="absolute top-5 left-5 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                  {p.category}
                </span>
              )}
              <h1 className="absolute bottom-5 left-5 right-5 text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
                {p.title}
              </h1>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-black/[0.07] p-7 md:p-10 space-y-7">
              {p.title_ne && <p className="text-mid-gray text-lg">{p.title_ne}</p>}

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 px-5 py-4 bg-primary-light rounded-xl border border-primary/10">
                  <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-mid-gray">Valid until</p>
                    <p className="text-sm font-bold text-navy mt-0.5">{formatDate(p.end_date)}</p>
                  </div>
                </div>
                {p.start_date && (
                  <div className="flex items-center gap-4 px-5 py-4 bg-cream rounded-xl border border-black/[0.07]">
                    <div className="w-10 h-10 bg-black/[0.04] rounded-xl flex items-center justify-center shrink-0">
                      <Calendar size={18} className="text-mid-gray" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-mid-gray">Started</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formatDate(p.start_date)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {p.description && (
                <div className="pt-5 border-t border-black/[0.07]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-mid-gray mb-3">Offer Details</p>
                  <p className="text-navy/70 leading-relaxed text-sm">{p.description}</p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="px-5 py-4 bg-cream rounded-xl border border-black/[0.07] text-xs text-mid-gray leading-relaxed">
                Valid at all 28 BBSM locations across Nepal. While stocks last. BBSM reserves the right to modify or withdraw this offer at any time.
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-black/[0.07]">
          <Link to="/offers" className="inline-flex items-center gap-2 text-sm font-bold text-mid-gray hover:text-primary transition-colors group">
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to all offers
          </Link>
        </div>
      </div>
    </div>
  );
}
