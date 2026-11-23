import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldAlert,
  X,
} from 'lucide-react';
import { Category, IntendedUse, Product, ReviewStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { formatDate, formatINR } from '../utils/format';

type AdminTab = 'products' | 'categories' | 'reviews' | 'reported';

const INTENDED_USES: IntendedUse[] = [
  'Study',
  'Hostel',
  'Daily Commute',
  'Coding & Labs',
  'Self-Care',
];

interface ProductFormState {
  name: string;
  categoryId: string;
  price: string;
  shortDescription: string;
  description: string;
  intendedUse: IntendedUse;
  image: string;
  retailerName: string;
  retailerUrl: string;
  studentRecommended: boolean;
  budgetFriendly: boolean;
  specKey1: string;
  specVal1: string;
  specKey2: string;
  specVal2: string;
  advantage1: string;
  disadvantage1: string;
}

export function AdminDashboard() {
  const { isAdmin, allUsers } = useAuth();
  const {
    products,
    categories,
    reviews,
    getCategoryById,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    moderateReview,
    dismissReport,
    deleteReview,
    resetDemoCatalog,
  } = useCatalog();

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [reviewFilter, setReviewFilter] = useState<ReviewStatus | 'all'>('all');
  const [adminMessage, setAdminMessage] = useState<string | null>(null);

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>({
    name: '',
    categoryId: categories[0]?.id ?? 'cat-electronics',
    price: '499',
    shortDescription: '',
    description: '',
    intendedUse: 'Study',
    image: '/src/assets/images/prod_study_lamp_1795439010390.jpg',
    retailerName: 'Amazon India',
    retailerUrl: 'https://www.amazon.in/',
    studentRecommended: true,
    budgetFriendly: true,
    specKey1: 'Material',
    specVal1: 'ABS / Alloy',
    specKey2: 'Warranty',
    specVal2: '1 Year',
    advantage1: 'Affordable student pricing',
    disadvantage1: 'Basic packaging',
  });

  // Category state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState<Category['iconName']>('Backpack');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-[#1E293B] font-display">
          Admin Access Restricted
        </h1>
        <p className="text-sm text-[#475569]">
          This moderation console is restricted to administrator accounts. Please sign in with the
          demo admin credentials on the Login page to inspect admin tools.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-lg bg-[#2563EB] text-white text-sm font-semibold"
          >
            Login as Admin
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#1E293B] text-sm font-semibold"
          >
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;
  const reportedReviews = reviews.filter((r) => Boolean(r.reported));

  const notify = (msg: string) => {
    setAdminMessage(msg);
    window.setTimeout(() => setAdminMessage(null), 3500);
  };

  const openAddProductModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      categoryId: categories[0]?.id ?? 'cat-electronics',
      price: '499',
      shortDescription: '',
      description: '',
      intendedUse: 'Study',
      image: '/src/assets/images/prod_study_lamp_1795439010390.jpg',
      retailerName: 'Amazon India',
      retailerUrl: 'https://www.amazon.in/',
      studentRecommended: false,
      budgetFriendly: true,
      specKey1: 'Material',
      specVal1: 'Standard',
      specKey2: 'Warranty',
      specVal2: '1 Year',
      advantage1: 'Reliable daily student utility',
      disadvantage1: 'Limited color options',
    });
    setProductModalOpen(true);
  };

  const openEditProductModal = (p: Product) => {
    const specEntries = Object.entries(p.specifications);
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      categoryId: p.categoryId,
      price: String(p.price),
      shortDescription: p.shortDescription,
      description: p.description,
      intendedUse: p.intendedUse,
      image: p.image,
      retailerName: p.externalRetailer.name,
      retailerUrl: p.externalRetailer.url,
      studentRecommended: Boolean(p.studentRecommended),
      budgetFriendly: Boolean(p.budgetFriendly),
      specKey1: specEntries[0]?.[0] ?? 'Material',
      specVal1: specEntries[0]?.[1] ?? '',
      specKey2: specEntries[1]?.[0] ?? 'Warranty',
      specVal2: specEntries[1]?.[1] ?? '',
      advantage1: p.advantages[0] ?? '',
      disadvantage1: p.disadvantages[0] ?? '',
    });
    setProductModalOpen(true);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = Math.max(1, Number(productForm.price) || 499);
    const specs: Record<string, string> = {};
    if (productForm.specKey1.trim() && productForm.specVal1.trim()) {
      specs[productForm.specKey1.trim()] = productForm.specVal1.trim();
    }
    if (productForm.specKey2.trim() && productForm.specVal2.trim()) {
      specs[productForm.specKey2.trim()] = productForm.specVal2.trim();
    }

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name.trim(),
        categoryId: productForm.categoryId,
        price: parsedPrice,
        shortDescription: productForm.shortDescription.trim(),
        description: productForm.description.trim() || productForm.shortDescription.trim(),
        intendedUse: productForm.intendedUse,
        image: productForm.image.trim(),
        studentRecommended: productForm.studentRecommended,
        budgetFriendly: parsedPrice <= 500 || productForm.budgetFriendly,
        specifications: specs,
        advantages: productForm.advantage1.trim() ? [productForm.advantage1.trim()] : [],
        disadvantages: productForm.disadvantage1.trim() ? [productForm.disadvantage1.trim()] : [],
        externalRetailer: {
          name: productForm.retailerName.trim() || 'Amazon India',
          url: productForm.retailerUrl.trim() || 'https://www.amazon.in/',
        },
      });
      notify(`Updated "${productForm.name.trim()}".`);
    } else {
      addProduct({
        name: productForm.name.trim(),
        categoryId: productForm.categoryId,
        price: parsedPrice,
        shortDescription: productForm.shortDescription.trim(),
        description: productForm.description.trim() || productForm.shortDescription.trim(),
        intendedUse: productForm.intendedUse,
        image: productForm.image.trim() || 'svg:laptop-stand',
        studentRecommended: productForm.studentRecommended,
        budgetFriendly: parsedPrice <= 500 || productForm.budgetFriendly,
        specifications: specs,
        advantages: productForm.advantage1.trim() ? [productForm.advantage1.trim()] : [],
        disadvantages: productForm.disadvantage1.trim() ? [productForm.disadvantage1.trim()] : [],
        externalRetailer: {
          name: productForm.retailerName.trim() || 'Amazon India',
          url: productForm.retailerUrl.trim() || 'https://www.amazon.in/',
        },
      });
      notify(`Added "${productForm.name.trim()}" to catalog.`);
    }
    setProductModalOpen(false);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName, newCategoryDesc || 'Curated campus essentials.', newCategoryIcon);
    notify(`Category "${newCategoryName.trim()}" created.`);
    setNewCategoryName('');
    setNewCategoryDesc('');
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    const ok = deleteCategory(catId);
    if (!ok) {
      notify(`Cannot delete "${catName}" because it still contains products.`);
      return;
    }
    notify(`Deleted category "${catName}".`);
  };

  const filteredReviews =
    reviewFilter === 'all' ? reviews : reviews.filter((r) => r.status === reviewFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB] mb-1">Admin Operations Console</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-display">
            CampusCart Admin Dashboard
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Manage student product listings, categories, review approvals, and flagged content.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetDemoCatalog();
            notify('Sample catalog and reviews restored to defaults.');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-semibold text-[#475569] whitespace-nowrap self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {adminMessage && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-[#DBEAFE] border border-[#93C5FD] text-sm font-medium text-[#1E293B]"
        >
          {adminMessage}
        </div>
      )}

      {/* 4 KPI Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-[#64748B]">Total Users</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-mono tabular-nums mt-1">
            {allUsers.length}
          </div>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-[#64748B]">Total Products</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-mono tabular-nums mt-1">
            {products.length}
          </div>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-[#64748B]">Total Reviews</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-mono tabular-nums mt-1">
            {reviews.length}
          </div>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-[#64748B]">Pending Reviews</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#2563EB] font-mono tabular-nums mt-1">
            {pendingReviewsCount}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3">
        {(
          [
            { id: 'products', label: `Products (${products.length})` },
            { id: 'categories', label: `Categories (${categories.length})` },
            { id: 'reviews', label: `Student Reviews (${reviews.length})` },
            { id: 'reported', label: `Reported Content (${reportedReviews.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] hover:text-[#1E293B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PRODUCTS */}
      {activeTab === 'products' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1E293B] font-display">Product Catalog</h2>
            <button
              type="button"
              onClick={openAddProductModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-semibold text-[#475569]">
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Intended Use</th>
                    <th className="p-3.5 text-right">Sample Price</th>
                    <th className="p-3.5 text-right">Rating</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8FAFC]">
                      <td className="p-3.5 font-semibold text-[#1E293B]">{p.name}</td>
                      <td className="p-3.5 text-[#475569]">
                        {getCategoryById(p.categoryId)?.name ?? 'Uncategorized'}
                      </td>
                      <td className="p-3.5 text-[#475569]">{p.intendedUse}</td>
                      <td className="p-3.5 text-right font-mono tabular-nums font-semibold text-[#1E293B]">
                        {formatINR(p.price)}
                      </td>
                      <td className="p-3.5 text-right font-mono tabular-nums text-[#475569]">
                        {p.rating.toFixed(1)}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(p)}
                            aria-label={`Edit ${p.name}`}
                            className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#475569] hover:text-[#2563EB] hover:border-[#93C5FD]"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteProduct(p.id);
                              notify(`Deleted "${p.name}".`);
                            }}
                            aria-label={`Delete ${p.name}`}
                            className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#475569] hover:text-[#DC2626] hover:border-[#FCA5A5]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleAddCategory}
            className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4"
          >
            <h2 className="text-base font-bold text-[#1E293B] font-display">Add New Category</h2>
            <div>
              <label htmlFor="cat-name" className="block text-xs font-semibold text-[#475569] mb-1">
                Category Name
              </label>
              <input
                id="cat-name"
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Dorm Kitchen"
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label htmlFor="cat-desc" className="block text-xs font-semibold text-[#475569] mb-1">
                Description
              </label>
              <input
                id="cat-desc"
                type="text"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                placeholder="Electric kettles, mugs, and lunch boxes"
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label htmlFor="cat-icon" className="block text-xs font-semibold text-[#475569] mb-1">
                Icon Theme
              </label>
              <select
                id="cat-icon"
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value as Category['iconName'])}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
              >
                <option value="Laptop">Laptop / Electronics</option>
                <option value="BookOpen">Books / Study</option>
                <option value="BedDouble">Hostel / Living</option>
                <option value="Sparkles">Personal Care</option>
                <option value="Backpack">Daily Essentials</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold"
            >
              Create Category
            </button>
          </form>

          <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0]">
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    {editingCatId === cat.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingCatName}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          className="px-2.5 py-1 text-sm border border-[#2563EB] rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (editingCatName.trim()) {
                              updateCategory(cat.id, { name: editingCatName.trim() });
                              notify(`Renamed category to "${editingCatName.trim()}".`);
                            }
                            setEditingCatId(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white text-xs font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-semibold text-[#1E293B]">{cat.name}</h3>
                        <p className="text-xs text-[#64748B] truncate">{cat.description}</p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono tabular-nums text-[#475569]">
                      {count} items
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCatId(cat.id);
                        setEditingCatName(cat.name);
                      }}
                      className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#475569] hover:text-[#2563EB]"
                      aria-label={`Rename ${cat.name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#475569] hover:text-[#DC2626]"
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#1E293B] font-display">
              Student Review Queue
            </h2>
            <div className="flex items-center gap-1.5">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setReviewFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                    reviewFilter === status
                      ? 'bg-[#DBEAFE] text-[#1E293B]'
                      : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredReviews.map((rev) => {
              const prod = getProductById(rev.productId);
              return (
                <div
                  key={rev.id}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                      <span className="font-semibold text-[#2563EB]">
                        {prod?.name ?? 'Unknown Product'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {rev.authorName} ({rev.university})
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{formatDate(rev.createdAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-semibold capitalize ${
                          rev.status === 'approved'
                            ? 'text-[#16A34A]'
                            : rev.status === 'rejected'
                            ? 'text-[#DC2626]'
                            : 'text-[#D97706]'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#1E293B]">{rev.title}</h3>
                    <p className="text-sm text-[#475569]">{rev.comment}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rev.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => {
                          moderateReview(rev.id, 'approved');
                          notify('Review approved and published.');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    {rev.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => {
                          moderateReview(rev.id, 'rejected');
                          notify('Review rejected.');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        deleteReview(rev.id);
                        notify('Review permanently deleted.');
                      }}
                      aria-label="Delete review"
                      className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:text-[#DC2626]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 4: REPORTED CONTENT */}
      {activeTab === 'reported' && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#1E293B] font-display">
            Reported Content Queue
          </h2>
          {reportedReviews.length > 0 ? (
            <div className="space-y-3">
              {reportedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#FFFFFF] border border-[#FCA5A5] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="text-xs font-semibold text-[#DC2626]">
                      Flag Reason: {rev.reportReason ?? 'Flagged by student user'}
                    </div>
                    <div className="text-xs text-[#64748B]">
                      {getProductById(rev.productId)?.name} · By {rev.authorName}
                    </div>
                    <h3 className="text-sm font-semibold text-[#1E293B]">{rev.title}</h3>
                    <p className="text-sm text-[#475569]">{rev.comment}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        dismissReport(rev.id);
                        notify('Report dismissed; review remains published.');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B]"
                    >
                      Dismiss Flag
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteReview(rev.id);
                        notify('Reported review removed.');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs font-semibold"
                    >
                      Remove Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-10 text-center text-sm text-[#64748B]">
              No reported reviews awaiting moderation.
            </div>
          )}
        </section>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {productModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0F172A]/45 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={editingProductId ? 'Edit Product' : 'Add Product'}
        >
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h2 className="text-lg font-bold text-[#1E293B] font-display">
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProductFormSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Category
                  </label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) =>
                      setProductForm({ ...productForm, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Sample Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Intended Use
                  </label>
                  <select
                    value={productForm.intendedUse}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        intendedUse: e.target.value as IntendedUse,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                  >
                    {INTENDED_USES.map((use) => (
                      <option key={use} value={use}>
                        {use}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    External Retailer Name
                  </label>
                  <input
                    type="text"
                    value={productForm.retailerName}
                    onChange={(e) =>
                      setProductForm({ ...productForm, retailerName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  required
                  value={productForm.shortDescription}
                  onChange={(e) =>
                    setProductForm({ ...productForm, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Full Description
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Spec 1 Label
                  </label>
                  <input
                    type="text"
                    value={productForm.specKey1}
                    onChange={(e) => setProductForm({ ...productForm, specKey1: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Spec 1 Value
                  </label>
                  <input
                    type="text"
                    value={productForm.specVal1}
                    onChange={(e) => setProductForm({ ...productForm, specVal1: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1E293B]">
                  <input
                    type="checkbox"
                    checked={productForm.studentRecommended}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        studentRecommended: e.target.checked,
                      })
                    }
                  />
                  <span>Mark as Student Recommended</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1E293B]">
                  <input
                    type="checkbox"
                    checked={productForm.budgetFriendly}
                    onChange={(e) =>
                      setProductForm({ ...productForm, budgetFriendly: e.target.checked })
                    }
                  />
                  <span>Mark as Budget Friendly</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#475569] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold"
                >
                  {editingProductId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
