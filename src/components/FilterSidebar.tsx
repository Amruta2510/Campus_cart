import { Category, IntendedUse } from '../types';

export interface ProductFilterState {
  categorySlug: string;
  minPrice: string;
  maxPrice: string;
  minRating: number;
  intendedUse: IntendedUse | 'All';
}

interface FilterSidebarProps {
  categories: Category[];
  filters: ProductFilterState;
  onChange: (next: ProductFilterState) => void;
  onReset: () => void;
}

const INTENDED_USES: Array<IntendedUse | 'All'> = [
  'All',
  'Study',
  'Hostel',
  'Daily Commute',
  'Coding & Labs',
  'Self-Care',
];

export function FilterSidebar({
  categories,
  filters,
  onChange,
  onReset,
}: FilterSidebarProps) {
  const applyBudgetPreset = (max: string) => {
    onChange({ ...filters, minPrice: '', maxPrice: max });
  };

  return (
    <aside className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <h2 className="text-base font-semibold text-[#1E293B] font-display">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-[#2563EB] hover:underline"
        >
          Reset all
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-semibold text-[#475569]">Category</h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onChange({ ...filters, categorySlug: 'all' })}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              filters.categorySlug === 'all'
                ? 'bg-[#DBEAFE] text-[#1E293B] font-semibold'
                : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ ...filters, categorySlug: cat.slug })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.categorySlug === cat.slug
                  ? 'bg-[#DBEAFE] text-[#1E293B] font-semibold'
                  : 'text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
        <h3 className="text-xs font-semibold text-[#475569]">Price Range (INR)</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="min-price" className="block text-[11px] text-[#64748B] mb-1">
              Min (₹)
            </label>
            <input
              id="min-price"
              type="number"
              min={0}
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
              className="w-full px-2.5 py-1.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] font-mono tabular-nums focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="block text-[11px] text-[#64748B] mb-1">
              Max (₹)
            </label>
            <input
              id="max-price"
              type="number"
              min={0}
              placeholder="2000"
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
              className="w-full px-2.5 py-1.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] font-mono tabular-nums focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => applyBudgetPreset('399')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              filters.maxPrice === '399'
                ? 'bg-[#DBEAFE] border-[#93C5FD] text-[#1E293B]'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:text-[#1E293B]'
            }`}
          >
            Under ₹400
          </button>
          <button
            type="button"
            onClick={() => applyBudgetPreset('500')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              filters.maxPrice === '500'
                ? 'bg-[#DBEAFE] border-[#93C5FD] text-[#1E293B]'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:text-[#1E293B]'
            }`}
          >
            Under ₹500
          </button>
          <button
            type="button"
            onClick={() => applyBudgetPreset('1000')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              filters.maxPrice === '1000'
                ? 'bg-[#DBEAFE] border-[#93C5FD] text-[#1E293B]'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:text-[#1E293B]'
            }`}
          >
            Under ₹1,000
          </button>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2.5 pt-4 border-t border-[#E2E8F0]">
        <h3 className="text-xs font-semibold text-[#475569]">Minimum Rating</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 4.0, 4.5, 4.7].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange({ ...filters, minRating: rating })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-colors ${
                filters.minRating === rating
                  ? 'bg-[#DBEAFE] border-[#93C5FD] text-[#1E293B] font-semibold'
                  : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              {rating === 0 ? 'All Ratings' : `${rating.toFixed(1)}★ & up`}
            </button>
          ))}
        </div>
      </div>

      {/* Intended Use */}
      <div className="space-y-2.5 pt-4 border-t border-[#E2E8F0]">
        <h3 className="text-xs font-semibold text-[#475569]">Intended Use</h3>
        <div className="space-y-1">
          {INTENDED_USES.map((use) => (
            <button
              key={use}
              type="button"
              onClick={() => onChange({ ...filters, intendedUse: use })}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filters.intendedUse === use
                  ? 'bg-[#DBEAFE] text-[#1E293B] font-semibold'
                  : 'text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              {use === 'All' ? 'All Campus Uses' : use}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
