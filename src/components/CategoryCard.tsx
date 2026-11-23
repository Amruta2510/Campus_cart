import { Link } from 'react-router-dom';
import { Laptop, BookOpen, BedDouble, Sparkles, Backpack, ArrowRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  productCount: number;
}

const ICON_MAP = {
  Laptop,
  BookOpen,
  BedDouble,
  Sparkles,
  Backpack,
};

export function CategoryCard({ category, productCount }: CategoryCardProps) {
  const Icon = ICON_MAP[category.iconName] ?? Backpack;

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5 hover:border-[#93C5FD] hover:shadow-sm"
    >
      <div>
        <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-4">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-[#1E293B] group-hover:text-[#2563EB] transition-colors font-display mb-1">
          {category.name}
        </h3>
        <p className="text-sm text-[#475569] line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-medium text-[#64748B]">
        <span className="tabular-nums">{productCount} products</span>
        <ArrowRight
          className="w-4 h-4 text-[#2563EB] transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
