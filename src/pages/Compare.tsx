import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Scale, Trash2, ArrowRight, X } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { MAX_COMPARE_ITEMS, useCompare } from '../context/CompareContext';
import { ComparisonTable } from '../components/ComparisonTable';
import { formatINR } from '../utils/format';

export function Compare() {
  const { products, getProductById } = useCatalog();
  const { compareIds, addToCompare, removeFromCompare, clearCompare } = useCompare();
  const [pickerOpen, setPickerOpen] = useState(false);

  const selectedProducts = compareIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const availableProducts = products.filter((p) => !compareIds.includes(p.id));

  const loadPresetPair = (idA: string, idB: string) => {
    clearCompare();
    addToCompare(idA);
    addToCompare(idB);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB] mb-1">
            Side-by-Side Specification Matrix
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-display">
            Compare Products
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Select 2 to 3 products to inspect price differences, specifications, and student pros and
            cons.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedProducts.length < MAX_COMPARE_ITEMS && (
            <button
              type="button"
              onClick={() => setPickerOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold whitespace-nowrap transition-colors"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add More Products ({selectedProducts.length}/3)</span>
            </button>
          )}
          {selectedProducts.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F8FAFC] text-sm font-semibold text-[#1E293B] whitespace-nowrap transition-colors"
            >
              <Trash2 className="w-4 h-4 text-[#DC2626]" aria-hidden="true" />
              <span>Clear Comparison</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Product Picker Drawer/Panel */}
      {pickerOpen && selectedProducts.length < MAX_COMPARE_ITEMS && (
        <div className="bg-[#FFFFFF] border border-[#93C5FD] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1E293B] font-display">
              Select a Product to Add ({MAX_COMPARE_ITEMS - selectedProducts.length} slot
              {MAX_COMPARE_ITEMS - selectedProducts.length === 1 ? '' : 's'} remaining)
            </h2>
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              aria-label="Close product selector"
              className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
            {availableProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  addToCompare(p.id);
                  if (compareIds.length + 1 >= MAX_COMPARE_ITEMS) {
                    setPickerOpen(false);
                  }
                }}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#DBEAFE]/25 text-left transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#1E293B] truncate">{p.name}</div>
                  <div className="text-xs text-[#64748B] font-mono tabular-nums">
                    {formatINR(p.price)} · {p.rating.toFixed(1)}★
                  </div>
                </div>
                <Plus className="w-4 h-4 text-[#2563EB] shrink-0" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State (0 selected) */}
      {selectedProducts.length === 0 && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-10 text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mx-auto">
            <Scale className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-[#1E293B] font-display">
              Your comparison table is empty
            </h2>
            <p className="text-sm text-[#475569]">
              Select 2 or 3 products from the catalog to compare features, INR prices, and student
              pros and cons side by side.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => loadPresetPair('prod-1', 'prod-13')}
              className="px-4 py-2.5 rounded-lg bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#1E293B] text-sm font-semibold transition-colors"
            >
              Try: Headphones vs Earphones
            </button>
            <button
              type="button"
              onClick={() => loadPresetPair('prod-2', 'prod-5')}
              className="px-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#1E293B] text-sm font-semibold transition-colors"
            >
              Try: Study Lamp vs Laptop Stand
            </button>
          </div>
        </div>
      )}

      {/* Single Product Warning */}
      {selectedProducts.length === 1 && (
        <div className="p-4 rounded-xl bg-[#DBEAFE]/45 border border-[#93C5FD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#1E293B]">
          <span>
            You have <strong>1 product</strong> selected. Add at least 1 more product (up to 3 total)
            to unlock difference highlighting.
          </span>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold whitespace-nowrap self-start sm:self-auto"
          >
            Select 2nd Product
          </button>
        </div>
      )}

      {/* Comparison Matrix */}
      {selectedProducts.length > 0 && (
        <ComparisonTable products={selectedProducts} onRemove={removeFromCompare} />
      )}
    </div>
  );
}
