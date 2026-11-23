import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category, Product, Review, ReviewStatus } from '../types';
import { storageService } from '../services/storageService';
import { slugify } from '../utils/format';

interface CatalogContextValue {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  getCategoryById: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getProductById: (id: string) => Product | undefined;
  getApprovedReviewsForProduct: (productId: string) => Review[];
  addProduct: (product: Omit<Product, 'id' | 'addedAt' | 'rating' | 'reviewCount'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string, description: string, iconName: Category['iconName']) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => boolean;
  submitReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => Review;
  moderateReview: (reviewId: string, status: ReviewStatus) => void;
  reportReview: (reviewId: string, reason: string) => void;
  dismissReport: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
  resetDemoCatalog: () => void;
}

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => storageService.getCategories());
  const [reviews, setReviews] = useState<Review[]>(() => storageService.getReviews());

  useEffect(() => {
    storageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    storageService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    storageService.saveReviews(reviews);
  }, [reviews]);

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);
  const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
  const getProductById = (id: string) => products.find((p) => p.id === id);

  const getApprovedReviewsForProduct = (productId: string) =>
    reviews.filter((r) => r.productId === productId && r.status === 'approved');

  const addProduct: CatalogContextValue['addProduct'] = (input) => {
    const newProduct: Product = {
      ...input,
      id: `prod-${Date.now()}`,
      rating: 4.5,
      reviewCount: 0,
      addedAt: new Date().toISOString().slice(0, 10),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setReviews((prev) => prev.filter((r) => r.productId !== id));
  };

  const addCategory: CatalogContextValue['addCategory'] = (name, description, iconName) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      slug: slugify(name),
      name: name.trim(),
      description: description.trim(),
      iconName,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updates,
              slug: updates.name ? slugify(updates.name) : c.slug,
            }
          : c
      )
    );
  };

  const deleteCategory = (id: string): boolean => {
    const hasProducts = products.some((p) => p.categoryId === id);
    if (hasProducts) return false;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return true;
  };

  const submitReview: CatalogContextValue['submitReview'] = (input) => {
    const newReview: Review = {
      ...input,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
    };
    setReviews((prev) => [newReview, ...prev]);
    return newReview;
  };

  const moderateReview = (reviewId: string, status: ReviewStatus) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
  };

  const reportReview = (reviewId: string, reason: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, reported: true, reportReason: reason.trim() || 'Flagged by student user' }
          : r
      )
    );
  };

  const dismissReport = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, reported: false, reportReason: undefined } : r
      )
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const resetDemoCatalog = () => {
    storageService.resetAllDemoData();
    setProducts(storageService.getProducts());
    setCategories(storageService.getCategories());
    setReviews(storageService.getReviews());
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        categories,
        reviews,
        getCategoryById,
        getCategoryBySlug,
        getProductById,
        getApprovedReviewsForProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        submitReview,
        moderateReview,
        reportReview,
        dismissReport,
        deleteReview,
        resetDemoCatalog,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
