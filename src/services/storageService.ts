import { Category, Product, Review, User } from '../types';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_REVIEWS } from '../data/reviews';

const KEYS = {
  PRODUCTS: 'campuscart_products_v1',
  CATEGORIES: 'campuscart_categories_v1',
  REVIEWS: 'campuscart_reviews_v1',
  USERS: 'campuscart_users_v1',
  SESSION: 'campuscart_session_v1',
  COMPARE: 'campuscart_compare_v1',
} as const;

export const INITIAL_DEMO_USERS: User[] = [
  {
    id: 'user-demo-1',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@iitb.ac.in',
    password: 'student123',
    university: 'IIT Bombay',
    studentType: 'Hostel',
    role: 'student',
    preferredCategories: ['cat-electronics', 'cat-study', 'cat-hostel'],
    createdAt: '2026-09-10',
  },
  {
    id: 'user-demo-2',
    fullName: 'Sneha Kulkarni',
    email: 'sneha.k@du.ac.in',
    password: 'student123',
    university: 'Delhi University',
    studentType: 'Day Scholar',
    role: 'student',
    preferredCategories: ['cat-daily', 'cat-study'],
    createdAt: '2026-09-18',
  },
  {
    id: 'user-admin-1',
    fullName: 'Prof. Rajeshwari Iyer',
    email: 'admin@campuscart.edu.in',
    password: 'admin123',
    university: 'CampusCart Moderation Team',
    studentType: 'Day Scholar',
    role: 'admin',
    preferredCategories: ['cat-electronics', 'cat-study'],
    createdAt: '2026-08-01',
  },
];

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in private browsing
  }
}

/**
 * Repository abstraction layer designed to be replaced with
 * PostgreSQL / Supabase REST or RPC calls in production.
 */
export const storageService = {
  getProducts: (): Product[] => safeRead(KEYS.PRODUCTS, INITIAL_PRODUCTS),
  saveProducts: (products: Product[]): void => safeWrite(KEYS.PRODUCTS, products),

  getCategories: (): Category[] => safeRead(KEYS.CATEGORIES, INITIAL_CATEGORIES),
  saveCategories: (categories: Category[]): void => safeWrite(KEYS.CATEGORIES, categories),

  getReviews: (): Review[] => safeRead(KEYS.REVIEWS, INITIAL_REVIEWS),
  saveReviews: (reviews: Review[]): void => safeWrite(KEYS.REVIEWS, reviews),

  getUsers: (): User[] => safeRead(KEYS.USERS, INITIAL_DEMO_USERS),
  saveUsers: (users: User[]): void => safeWrite(KEYS.USERS, users),

  getSessionUserId: (): string | null => safeRead<string | null>(KEYS.SESSION, null),
  saveSessionUserId: (userId: string | null): void => {
    if (userId) {
      safeWrite(KEYS.SESSION, userId);
    } else {
      try {
        localStorage.removeItem(KEYS.SESSION);
      } catch {
        // Ignore
      }
    }
  },

  getCompareIds: (): string[] => safeRead<string[]>(KEYS.COMPARE, []),
  saveCompareIds: (ids: string[]): void => safeWrite(KEYS.COMPARE, ids),

  resetAllDemoData: (): void => {
    safeWrite(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    safeWrite(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    safeWrite(KEYS.REVIEWS, INITIAL_REVIEWS);
    safeWrite(KEYS.USERS, INITIAL_DEMO_USERS);
  },
};
