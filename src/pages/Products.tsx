import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, PackageSearch } from 'lucide-react';
import { SortOption } from '../types';
import { useCatalog } from '../context/CatalogContext';
import { SearchBar } from '../components/SearchBar';
import { FilterSidebar, ProductFilterState } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';

const DEFAULT_FILTERS: ProductFilterState = {
  categorySlug: 'all',
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  intendedUse: 'All',
};

export function Products() {
  const { products, categories, getCategoryBySlug } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');
  const [filters, setFilters] = useState<ProductFilterState>({
    ...DEFAULT_FILTERS,
    categorySlug: searchParams.get('category') ?? 'all',
    maxPrice: searchParams.get('maxPrice') ?? '',
  });

  // Keep state synced when navigating via Navbar/Category links
  useEffect(() => {
    const catParam = searchParams.get('category') ?? 'all';
    const qParam = searchParams.get('q') ?? '';
    const maxParam = searchParams.get('maxPrice') ?? '';
    setSearchQuery(qParam);
    setFilters((prev) => ({
      ...prev,
      categorySlug: catParam,
      maxPrice: maxParam,
    }));
  }, [searchParams]);

  const activeCategory =
    filters.categorySlug !== 'all' ? getCategoryBySlug(filters.categorySlug) : undefined;

  const handleReset = () => {
    setSearchQuery('');
    setFilters(DEFAULT_FILTERS);
    setSearchParams({});
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const next = new URLSearchParams(searchParams);
    if (val.trim()) next.set('q', val);
    else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const handleFilterChange = (nextFilters: ProductFilterState) => {
    setFilters(nextFilters);
    const next = new URLSearchParams();
    if (searchQuery.trim()) next.set('q', searchQuery.trim());
    if (nextFilters.categorySlug !== 'all') next.set('category', nextFilters.categorySlug);
    if (nextFilters.maxPrice) next.set('maxPrice', nextFilters.maxPrice);
    setSearchParams(next, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const minP = filters.minPrice !== '' ? Number(filters.minPrice) : null;
    const maxP = filters.maxPrice !== '' ? Number(filters.maxPrice) : null;

    const list = products.filter((p) => {
      if (activeCategory && p.categoryId !== activeCategory.id) return false;
      if (minP !== null && !Number.isNaN(minP) && p.price < minP) return false;
      if (maxP !== null && !Number.isNaN(maxP) && p.price > maxP) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      if (filters.intendedUse !== 'All' && p.intendedUse !== filters.intendedUse) return false;
      if (q) {
        const haystack = `${p.name} ${p.shortDescription} ${p.description} ${p.intendedUse}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'recent':
          return b.addedAt.localeCompare(a.addedAt);
        case 'rating-desc':
        default:
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
      }
    });
  }, [products, activeCategory, filters, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header Banner */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#2563EB] mb-1">
              Student Product Discovery
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-display">
              {activeCategory ? activeCategory.name : 'All Student Products'}
            </h1>
            <p className="text-sm text-[#475569] mt-1 max-w-2xl">
              {activeCategory
                ? activeCategory.description
                : 'Explore verified student essentials with sample INR benchmark pricing and side-by-side comparison.'}
            </p>
          </div>
          <p className="text-xs text-[#64748B] tabular-nums shrink-0">
            Showing {filteredProducts.length} of {products.length} sample products
          </p>
        </div>

        {/* Search & Sort Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-2">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search headphones, study lamp, backpack, calculator..."
            className="flex-1 max-w-xl"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-sm font-semibold text-[#1E293B]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <label htmlFor="sort-select" className="text-xs font-medium text-[#64748B] whitespace-nowrap">
                Sort by
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full sm:w-48 px-3 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="rating-desc">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mx-auto">
                <PackageSearch className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-[#1E293B] font-display">
                  No matching products found
                </h2>
                <p className="text-sm text-[#475569] max-w-md mx-auto">
                  Try widening your budget range, clearing the search keywords, or resetting your
                  category filters.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0F172A]/40 lg:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Product filters"
        >
          <div className="w-full max-w-xs bg-[#F8FAFC] h-full overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#1E293B] font-display">Filter Products</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-2 rounded-lg text-[#475569] hover:bg-[#E2E8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              categories={categories}
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-3 rounded-lg bg-[#2563EB] text-white text-sm font-semibold"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
