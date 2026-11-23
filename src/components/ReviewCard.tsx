import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flag, Star } from 'lucide-react';
import { Review } from '../types';
import { formatDate } from '../utils/format';

interface ReviewCardProps {
  review: Review;
  productName?: string;
  onReport?: (reviewId: string, reason: string) => void;
}

export function ReviewCard({ review, productName, onReport }: ReviewCardProps) {
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState('Off-topic or promotional content');
  const [reportedDone, setReportedDone] = useState(Boolean(review.reported));

  const handleReportSubmit = () => {
    onReport?.(review.id, reason);
    setReporting(false);
    setReportedDone(true);
  };

  return (
    <article className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between gap-4">
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            {productName && (
              <Link
                to={`/products/${review.productId}`}
                className="text-xs font-semibold text-[#2563EB] hover:underline block mb-1"
              >
                {productName}
              </Link>
            )}
            <h4 className="text-base font-semibold text-[#1E293B] font-display">
              {review.title}
            </h4>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-[#1E293B] tabular-nums shrink-0">
            <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
            <span>{review.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-sm text-[#475569] leading-relaxed">{review.comment}</p>
      </div>

      <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
        <div>
          <span className="font-semibold text-[#1E293B]">{review.authorName}</span>
          <span aria-hidden="true"> · </span>
          <span>{review.university}</span>
          <span aria-hidden="true"> · </span>
          <span>{review.studentType}</span>
          <span aria-hidden="true"> · </span>
          <span className="tabular-nums">{formatDate(review.createdAt)}</span>
        </div>

        {onReport && !reportedDone && (
          <button
            type="button"
            onClick={() => setReporting((prev) => !prev)}
            className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#1E293B] transition-colors"
          >
            <Flag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Report</span>
          </button>
        )}

        {reportedDone && (
          <span className="text-xs font-medium text-[#D97706]">Flagged for admin review</span>
        )}
      </div>

      {reporting && (
        <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row gap-2">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            aria-label="Report reason"
            className="flex-1 px-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B]"
          >
            <option value="Off-topic or promotional content">Off-topic or promotional content</option>
            <option value="Inaccurate product details">Inaccurate product details</option>
            <option value="Inappropriate language">Inappropriate language</option>
          </select>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReportSubmit}
              className="px-3 py-1.5 rounded-lg bg-[#1E293B] text-white text-xs font-semibold hover:bg-[#0F172A]"
            >
              Submit Report
            </button>
            <button
              type="button"
              onClick={() => setReporting(false)}
              className="px-2.5 py-1.5 rounded-lg text-xs text-[#475569] hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
