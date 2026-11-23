import { Link } from 'react-router-dom';
import { Star, Scale, Check } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/format';
import { useCatalog } from '../context/CatalogContext';
import { useCompare } from '../context/CompareContext';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { getCategoryById } = useCatalog();
  const { isCompared, toggleCompare } = useCompare();

  const category = getCategoryById(product.categoryId);
  const compared = isCompared(product.id);

  return (
    <article className="group bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to={`/products/${product.id}`}
        className="block aspect-[4/3] bg-[#F1F5F9] overflow-hidden"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          className="transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        {/* Clean unboxed metadata kicker */}
        <div className="flex items-center justify-between gap-2 text-xs text-[#64748B] mb-2">
          <span className="truncate">
            {category?.name ?? 'Essentials'} <span aria-hidden="true">·</span> {product.intendedUse}
          </span>
          {(product.studentRecommended || product.budgetFriendly) && (
            <span className="text-[11px] font-semibold text-[#2563EB] whitespace-nowrap shrink-0">
              {product.studentRecommended ? 'Student Pick' : 'Budget Friendly'}
            </span>
          )}
        </div>

        <Link to={`/products/${product.id}`} className="block mb-1.5">
          <h3 className="text-base font-semibold text-[#1E293B] group-hover:text-[#2563EB] transition-colors line-clamp-1 font-display">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-[#475569] line-clamp-2 mb-4 leading-relaxed">
          {product.shortDescription}
        </p>

        <div className="mt-auto pt-3 border-t border-[#E2E8F0] space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-lg font-bold text-[#1E293B] font-mono tabular-nums">
                {formatINR(product.price)}
              </span>
              <span className="ml-1.5 text-[11px] text-[#64748B]">Sample</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-[#1E293B] tabular-nums">
              <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-xs text-[#64748B]">({product.reviewCount})</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/products/${product.id}`}
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-150"
            >
              View Details
            </Link>
            <button
              type="button"
              onClick={() => toggleCompare(product.id)}
              aria-pressed={compared}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap border transition-colors duration-150 ${
                compared
                  ? 'bg-[#DBEAFE] border-[#93C5FD] text-[#1E293B]'
                  : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]'
              }`}
            >
              {compared ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" aria-hidden="true" />
                  <span>Compared</span>
                </>
              ) : (
                <>
                  <Scale className="w-3.5 h-3.5 text-[#475569]" aria-hidden="true" />
                  <span>Compare</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
