import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { SearchBar } from '../components/SearchBar';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { ReviewCard } from '../components/ReviewCard';

export function Home() {
  const { products, categories, reviews, getProductById, reportReview } = useCatalog();
  const [heroQuery, setHeroQuery] = useState('');
  const [heroError, setHeroError] = useState(false);
  const navigate = useNavigate();

  const handleHeroSearch = (query: string) => {
    const target = query ? `/products?q=${encodeURIComponent(query)}` : '/products';
    navigate(target);
  };

  const scrollToCategories = () => {
    const el = document.getElementById('popular-categories');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const trendingProducts = [...products]
    .sort((a, b) => b.rating * Math.log10(b.reviewCount + 10) - a.rating * Math.log10(a.reviewCount + 10))
    .slice(0, 6);

  const budgetProducts = products
    .filter((p) => p.price <= 500)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const spotlightReviews = reviews
    .filter((r) => r.status === 'approved' && !r.reported)
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold text-[#2563EB] tracking-wide">
                  University Student Buying Guide
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#1E293B] leading-[1.12] tracking-tight font-display [text-wrap:balance]">
                  Smart Shopping for Smarter Students.
                </h1>
                <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl">
                  Discover affordable, reliable, and student-recommended products all in one place.
                  Compare real specifications, benchmark INR prices, and read honest dorm and campus
                  reviews.
                </p>
              </div>

              <SearchBar
                value={heroQuery}
                onChange={setHeroQuery}
                onSubmit={handleHeroSearch}
                placeholder="Search products for student life..."
                buttonLabel="Search"
                className="max-w-xl"
              />

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold whitespace-nowrap transition-colors duration-150"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={scrollToCategories}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#1E293B] text-sm font-semibold whitespace-nowrap transition-colors duration-150"
                >
                  Explore Categories
                </button>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B]">
                <span className="tabular-nums">{products.length} Curated Student Essentials</span>
                <span aria-hidden="true">·</span>
                <span>Side-by-Side Spec Comparison</span>
                <span aria-hidden="true">·</span>
                <span>Sample INR Pricing</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] sm:min-h-[360px] rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9]">
                {!heroError ? (
                  <img
                    src="/src/assets/images/hero_student_desk_1795439010007.jpg"
                    alt="Sunlit university student desk setup with laptop stand, wireless headphones, LED study lamp, and notebooks"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-[#DBEAFE] to-[#F1F5F9] text-center">
                    <p className="text-base font-semibold text-[#1E293B]">
                      Student Desk &amp; Dorm Essentials
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section
        id="popular-categories"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-display">
              Popular Categories
            </h2>
            <p className="text-sm sm:text-base text-[#475569] mt-1">
              Browse practical gear tailored for hostels, libraries, and daily campus commutes.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
          >
            <span>View all products</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              productCount={products.filter((p) => p.categoryId === cat.id).length}
            />
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-[#FFFFFF] border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-display">
                Trending Products
              </h2>
              <p className="text-sm sm:text-base text-[#475569] mt-1">
                Highest-rated gear actively compared by university students this semester.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
            >
              <span>Browse full catalog</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Budget-Friendly Picks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-display">
              Budget-Friendly Picks
            </h2>
            <p className="text-sm sm:text-base text-[#475569] mt-1">
              Reliable campus staples priced at ₹500 or below (sample demonstration pricing).
            </p>
          </div>
          <Link
            to="/products?maxPrice=500"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
          >
            <span>See all under ₹500</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {budgetProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Student Recommendations */}
      <section className="bg-[#FFFFFF] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-display">
                Student Recommendations
              </h2>
              <p className="text-sm sm:text-base text-[#475569] mt-1">
                First-hand reviews shared by hostel residents and day scholars across Indian campuses.
              </p>
            </div>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
            >
              <span>Read more recommendations</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spotlightReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                productName={getProductById(review.productId)?.name}
                onReport={reportReview}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
