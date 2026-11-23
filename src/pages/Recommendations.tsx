import { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { ProductCard } from '../components/ProductCard';
import { ReviewCard } from '../components/ReviewCard';

type PersonaFilter = 'all' | 'Hostel' | 'Day Scholar' | 'Coding & Labs';

export function Recommendations() {
  const { products, reviews, getProductById, reportReview } = useCatalog();
  const [persona, setPersona] = useState<PersonaFilter>('all');

  const recommendedProducts = products.filter((p) => {
    if (!p.studentRecommended && p.rating < 4.6) return false;
    if (persona === 'Hostel') return p.intendedUse === 'Hostel' || p.intendedUse === 'Study';
    if (persona === 'Day Scholar') return p.intendedUse === 'Daily Commute' || p.intendedUse === 'Study';
    if (persona === 'Coding & Labs') return p.intendedUse === 'Coding & Labs';
    return true;
  });

  const approvedReviews = reviews.filter((r) => {
    if (r.status !== 'approved' || r.reported) return false;
    if (persona === 'Hostel' || persona === 'Day Scholar') {
      return r.studentType === persona;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <p className="text-xs font-semibold text-[#2563EB] mb-1">Peer-Curated Shortlists</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-display">
            Student Recommendations
          </h1>
          <p className="text-sm sm:text-base text-[#475569] mt-1 max-w-2xl">
            Products consistently endorsed by university students based on durability, campus
            practicality, and value for money.
          </p>
        </div>

        {/* Segmented Lifestyle Filter */}
        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl"
          role="group"
          aria-label="Filter recommendations by student profile"
        >
          {(
            [
              { id: 'all', label: 'All Students' },
              { id: 'Hostel', label: 'Hostel Life' },
              { id: 'Day Scholar', label: 'Day Scholars' },
              { id: 'Coding & Labs', label: 'Coding & Labs' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPersona(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                persona === tab.id
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#475569] hover:text-[#1E293B] hover:bg-[#F8FAFC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Products Grid */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-[#1E293B] font-display">
            Top Picks ({recommendedProducts.length})
          </h2>
          <span className="text-xs text-[#64748B]">Sorted by student rating</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Verified Peer Reviews */}
      <section className="space-y-5 pt-4 border-t border-[#E2E8F0]">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B] font-display">
            Campus Stories &amp; Reviews
          </h2>
          <p className="text-sm text-[#475569] mt-1">
            Real feedback submitted by students across hostel and commuter campuses.
          </p>
        </div>

        {approvedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                productName={getProductById(review.productId)?.name}
                onReport={reportReview}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-8 text-center text-sm text-[#64748B]">
            No peer reviews match this filter yet.
          </div>
        )}
      </section>
    </div>
  );
}
