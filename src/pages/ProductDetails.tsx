import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Scale,
  Star,
  Info,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/format';
import { ProductImage } from '../components/ProductImage';
import { ReviewCard } from '../components/ReviewCard';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const {
    getProductById,
    getCategoryById,
    getApprovedReviewsForProduct,
    reviews,
    submitReview,
    reportReview,
  } = useCatalog();
  const { isCompared, toggleCompare } = useCompare();
  const { user, isAuthenticated } = useAuth();

  const product = id ? getProductById(id) : undefined;

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmittedNotice, setReviewSubmittedNotice] = useState(false);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#1E293B] font-display">Product not found</h1>
        <p className="text-sm text-[#475569]">
          This product may have been removed or the URL is incorrect.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const category = getCategoryById(product.categoryId);
  const approvedReviews = getApprovedReviewsForProduct(product.id);
  const userPendingReviews = user
    ? reviews.filter(
        (r) => r.productId === product.id && r.userId === user.id && r.status === 'pending'
      )
    : [];
  const compared = isCompared(product.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    if (!user) return;
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      setReviewError('Please add both a short headline and your experience with this product.');
      return;
    }

    submitReview({
      productId: product.id,
      userId: user.id,
      authorName: user.fullName,
      university: user.university,
      studentType: user.studentType,
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
    });

    setReviewTitle('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSubmittedNotice(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748B]">
        <Link to="/" className="hover:text-[#2563EB]">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        {category ? (
          <>
            <Link to={`/products?category=${category.slug}`} className="hover:text-[#2563EB]">
              {category.name}
            </Link>
            <span aria-hidden="true">/</span>
          </>
        ) : null}
        <span className="text-[#1E293B] font-medium truncate">{product.name}</span>
      </nav>

      {/* Primary Contiguous Product Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Product Image */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden aspect-[4/3]">
          <ProductImage src={product.image} alt={product.name} />
        </div>

        {/* Product Info & Actions */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
              <span>{category?.name ?? 'Essentials'}</span>
              <span aria-hidden="true">·</span>
              <span>Intended for {product.intendedUse}</span>
              {product.studentRecommended && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#2563EB]">Student Recommended</span>
                </>
              )}
              {product.budgetFriendly && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#16A34A]">Budget Friendly</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-display">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <div>
                <span className="text-3xl font-bold text-[#1E293B] font-mono tabular-nums">
                  {formatINR(product.price)}
                </span>
                <span className="ml-2 text-xs text-[#64748B]">Sample Demo Price</span>
              </div>

              <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1E293B] tabular-nums">
                <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-xs font-normal text-[#64748B]">
                  ({product.reviewCount} student ratings)
                </span>
              </div>
            </div>
          </div>

          <p className="text-base text-[#475569] leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={product.externalRetailer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold whitespace-nowrap transition-colors"
            >
              <span>Visit Store ({product.externalRetailer.name})</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => toggleCompare(product.id)}
              aria-pressed={compared}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold whitespace-nowrap border transition-colors ${
                compared
                  ? 'bg-[#DBEAFE] border-[#93C5FD] text-[#1E293B]'
                  : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC]'
              }`}
            >
              {compared ? (
                <>
                  <Check className="w-4 h-4 text-[#16A34A]" aria-hidden="true" />
                  <span>Added to Compare</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4 text-[#475569]" aria-hidden="true" />
                  <span>Compare Product</span>
                </>
              )}
            </button>
          </div>

          {compared && (
            <div className="text-xs text-[#2563EB] font-medium">
              <Link to="/compare" className="hover:underline">
                Open side-by-side comparison table &rarr;
              </Link>
            </div>
          )}

          <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569]">
            <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              CampusCart is a student shopping information guide. All purchases take place on external
              retailer websites, and prices shown are sample benchmarks.
            </p>
          </div>
        </div>
      </div>

      {/* Specifications, Advantages, Disadvantages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Specifications */}
        <section className="lg:col-span-6 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6">
          <h2 className="text-lg font-bold text-[#1E293B] font-display mb-4">
            Key Specifications
          </h2>
          <dl className="divide-y divide-[#E2E8F0] text-sm">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="py-3 flex items-center justify-between gap-4">
                <dt className="text-[#64748B] font-medium">{key}</dt>
                <dd className="text-[#1E293B] font-semibold text-right tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Pros & Cons */}
        <div className="lg:col-span-6 space-y-6">
          <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#1E293B] font-display mb-3">
              Student Advantages
            </h2>
            <ul className="space-y-2.5">
              {product.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-[#1E293B]">
                  <CheckCircle2
                    className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#1E293B] font-display mb-3">
              Points to Consider (Disadvantages)
            </h2>
            <ul className="space-y-2.5">
              {product.disadvantages.map((dis, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-[#475569]">
                  <AlertCircle
                    className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{dis}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Student Reviews & Review Submission */}
      <section className="space-y-6 pt-4 border-t border-[#E2E8F0]">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B] font-display">Student Reviews</h2>
          <p className="text-sm text-[#475569] mt-1">
            Verified peer feedback from hostel and day-scholar students.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {userPendingReviews.map((pending) => (
              <div
                key={pending.id}
                className="bg-[#DBEAFE]/35 border border-[#93C5FD] rounded-xl p-4 text-sm space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1E293B]">{pending.title}</span>
                  <span className="text-xs font-semibold text-[#2563EB]">
                    Pending Admin Approval
                  </span>
                </div>
                <p className="text-[#475569]">{pending.comment}</p>
              </div>
            ))}

            {approvedReviews.length > 0 ? (
              approvedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} onReport={reportReview} />
              ))
            ) : (
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-8 text-center text-sm text-[#64748B]">
                No published student reviews for this item yet. Be the first to share your
                experience!
              </div>
            )}
          </div>

          {/* Submit Review Form */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#1E293B] font-display">
              Share Your Student Review
            </h3>

            {isAuthenticated && user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewSubmittedNotice && (
                  <div className="p-3 rounded-lg bg-[#DCFCE7] border border-[#86EFAC] text-xs font-medium text-[#166534]">
                    Thank you! Your review has been submitted and queued for admin moderation.
                  </div>
                )}

                {reviewError && (
                  <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-xs font-medium text-[#991B1B]">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setReviewRating(num)}
                        aria-label={`Rate ${num} out of 5 stars`}
                        className={`p-2 rounded-lg border transition-colors ${
                          reviewRating >= num
                            ? 'bg-[#DBEAFE] border-[#93C5FD] text-[#1E293B]'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            reviewRating >= num ? 'fill-[#F59E0B] text-[#F59E0B]' : ''
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-mono tabular-nums text-[#475569]">
                      {reviewRating}/5
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="review-title"
                    className="block text-xs font-semibold text-[#475569] mb-1.5"
                  >
                    Review Headline
                  </label>
                  <input
                    id="review-title"
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g., Great battery life for library days"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="review-comment"
                    className="block text-xs font-semibold text-[#475569] mb-1.5"
                  >
                    Your Experience
                  </label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Mention durability, hostel or commute suitability, and value for money..."
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="text-xs text-[#64748B]">
                  Posting as <span className="font-semibold text-[#1E293B]">{user.fullName}</span> (
                  {user.university})
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[#475569]">
                  Sign in with your student account to share a review and help fellow students decide.
                </p>
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
                >
                  Login to Write a Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
