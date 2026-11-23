import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../services/storageService';

export const MAX_COMPARE_ITEMS = 3;

interface CompareContextValue {
  compareIds: string[];
  feedbackMessage: string | null;
  clearFeedback: () => void;
  isCompared: (productId: string) => boolean;
  toggleCompare: (productId: string) => void;
  addToCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>(() =>
    storageService.getCompareIds().slice(0, MAX_COMPARE_ITEMS)
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    storageService.saveCompareIds(compareIds);
  }, [compareIds]);

  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = window.setTimeout(() => setFeedbackMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [feedbackMessage]);

  const isCompared = (productId: string) => compareIds.includes(productId);

  const addToCompare = (productId: string): boolean => {
    if (compareIds.includes(productId)) {
      setFeedbackMessage('Product is already in your comparison list.');
      return true;
    }
    if (compareIds.length >= MAX_COMPARE_ITEMS) {
      setFeedbackMessage('You can compare up to 3 products at once. Remove one to add another.');
      return false;
    }
    setCompareIds((prev) => [...prev, productId]);
    setFeedbackMessage('Added to comparison list.');
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== productId));
  };

  const toggleCompare = (productId: string) => {
    if (isCompared(productId)) {
      removeFromCompare(productId);
      setFeedbackMessage('Removed from comparison list.');
    } else {
      addToCompare(productId);
    }
  };

  const clearCompare = () => {
    setCompareIds([]);
    setFeedbackMessage('Comparison list cleared.');
  };

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        feedbackMessage,
        clearFeedback: () => setFeedbackMessage(null),
        isCompared,
        toggleCompare,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
