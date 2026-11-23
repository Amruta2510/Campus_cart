import { Link } from 'react-router-dom';
import { ExternalLink, Star, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/format';
import { useCatalog } from '../context/CatalogContext';
import { ProductImage } from './ProductImage';

interface ComparisonTableProps {
  products: Product[];
  onRemove: (productId: string) => void;
}

export function ComparisonTable({ products, onRemove }: ComparisonTableProps) {
  const { getCategoryById } = useCatalog();

  if (products.length === 0) return null;

  const lowestPrice = Math.min(...products.map((p) => p.price));
  const highestRating = Math.max(...products.map((p) => p.rating));

  // Collect all unique specification keys across selected products
  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specifications)))
  );

  const rowDiffers = (values: string[]) => {
    if (values.length <= 1) return false;
    return new Set(values).size > 1;
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="w-48 p-5 align-top bg-[#F8FAFC] text-xs font-semibold text-[#475569]">
                Product Overview
              </th>
              {products.map((product) => (
                <th key={product.id} className="p-5 align-top border-l border-[#E2E8F0] min-w-[220px]">
                  <div className="space-y-3">
                    <Link
                      to={`/products/${product.id}`}
                      className="block aspect-[4/3] rounded-lg overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0]"
                    >
                      <ProductImage src={product.image} alt={product.name} />
                    </Link>
                    <div>
                      <div className="text-xs font-normal text-[#64748B] mb-1">
                        {getCategoryById(product.categoryId)?.name ?? 'Essentials'}
                      </div>
                      <Link
                        to={`/products/${product.id}`}
                        className="text-base font-semibold text-[#1E293B] hover:text-[#2563EB] transition-colors font-display block"
                      >
                        {product.name}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(product.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Remove Product</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] text-sm">
            {/* Price Row */}
            <tr className={rowDiffers(products.map((p) => String(p.price))) ? 'bg-[#DBEAFE]/20' : ''}>
              <th scope="row" className="p-4 bg-[#F8FAFC] font-semibold text-[#1E293B]">
                Sample Price (INR)
              </th>
              {products.map((p) => {
                const isBest = products.length > 1 && p.price === lowestPrice;
                return (
                  <td key={p.id} className="p-4 border-l border-[#E2E8F0] font-mono tabular-nums">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-base font-bold ${
                          isBest ? 'text-[#16A34A]' : 'text-[#1E293B]'
                        }`}
                      >
                        {formatINR(p.price)}
                      </span>
                      {isBest && (
                        <span className="text-xs font-sans font-semibold text-[#16A34A]">
                          Lowest Price
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Rating Row */}
            <tr className={rowDiffers(products.map((p) => String(p.rating))) ? 'bg-[#DBEAFE]/20' : ''}>
              <th scope="row" className="p-4 bg-[#F8FAFC] font-semibold text-[#1E293B]">
                Student Rating
              </th>
              {products.map((p) => {
                const isTop = products.length > 1 && p.rating === highestRating;
                return (
                  <td key={p.id} className="p-4 border-l border-[#E2E8F0] tabular-nums">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#1E293B]">
                        <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
                        {p.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-[#64748B]">({p.reviewCount} reviews)</span>
                      {isTop && (
                        <span className="text-xs font-semibold text-[#2563EB]">Top Rated</span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Intended Use */}
            <tr className={rowDiffers(products.map((p) => p.intendedUse)) ? 'bg-[#DBEAFE]/20' : ''}>
              <th scope="row" className="p-4 bg-[#F8FAFC] font-semibold text-[#1E293B]">
                Intended Use
              </th>
              {products.map((p) => (
                <td key={p.id} className="p-4 border-l border-[#E2E8F0] text-[#475569]">
                  {p.intendedUse}
                </td>
              ))}
            </tr>

            {/* Key Summary */}
            <tr>
              <th scope="row" className="p-4 bg-[#F8FAFC] font-semibold text-[#1E293B] align-top">
                Key Features
              </th>
              {products.map((p) => (
                <td key={p.id} className="p-4 border-l border-[#E2E8F0] text-[#475569] align-top leading-relaxed">
                  {p.shortDescription}
                </td>
              ))}
            </tr>

            {/* Dynamic Specifications Matrix */}
            {allSpecKeys.map((specKey) => {
              const values = products.map((p) => p.specifications[specKey] ?? '—');
              const differs = rowDiffers(values);
              return (
                <tr key={specKey} className={differs ? 'bg-[#DBEAFE]/20' : ''}>
                  <th scope="row" className="p-4 bg-[#F8FAFC] font-medium text-[#475569]">
                    <div className="flex items-center justify-between gap-2">
                      <span>{specKey}</span>
                      {differs && (
                        <span className="text-[10px] font-semibold text-[#2563EB]">Differs</span>
                      )}
                    </div>
                  </th>
                  {products.map((p) => (
                    <td
                      key={p.id}
                      className="p-4 border-l border-[#E2E8F0] text-[#1E293B] tabular-nums"
                    >
                      {p.specifications[specKey] ?? '—'}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Advantages */}
            <tr>
              <th scope="row" className="p-4 bg-[#F8FAFC] font-semibold text-[#1E293B] align-top">
                Advantages
              </th>
              {products.map((p) => (
                <td key={p.id} className="p-4 border-l border-[#E2E8F0] align-top">
                  <ul className="space-y-1.5">
                    {p.advantages.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#1E293B]">
                        <CheckCircle2
                          className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Disadvantages */}
            <tr>
              <th scope="row" className="p-4 bg-[#F8FAFC] font-semibold text-[#1E293B] align-top">
                Disadvantages
              </th>
              {products.map((p) => (
                <td key={p.id} className="p-4 border-l border-[#E2E8F0] align-top">
                  <ul className="space-y-1.5">
                    {p.disadvantages.map((dis, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#475569]">
                        <AlertCircle
                          className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{dis}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* External Retailer Action */}
            <tr>
              <th scope="row" className="p-4 bg-[#F8FAFC] font-semibold text-[#1E293B]">
                External Store
              </th>
              {products.map((p) => (
                <td key={p.id} className="p-4 border-l border-[#E2E8F0]">
                  <a
                    href={p.externalRetailer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold whitespace-nowrap transition-colors"
                  >
                    <span>Visit {p.externalRetailer.name}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
