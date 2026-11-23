export type StudentType = 'Hostel' | 'Day Scholar';
export type UserRole = 'student' | 'admin';

export type IntendedUse =
  | 'Study'
  | 'Hostel'
  | 'Daily Commute'
  | 'Coding & Labs'
  | 'Self-Care';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: 'Laptop' | 'BookOpen' | 'BedDouble' | 'Sparkles' | 'Backpack';
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number; // Sample price in INR
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  image: string; // Generated asset path or 'svg:<key>'
  intendedUse: IntendedUse;
  studentRecommended?: boolean;
  budgetFriendly?: boolean;
  specifications: Record<string, string>;
  advantages: string[];
  disadvantages: string[];
  externalRetailer: {
    name: string;
    url: string;
  };
  addedAt: string;
}

export type ReviewStatus = 'approved' | 'pending' | 'rejected';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  authorName: string;
  university: string;
  studentType: StudentType;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  status: ReviewStatus;
  reported?: boolean;
  reportReason?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string; // Stored only in local demo state; omitted when exporting public session
  university: string;
  studentType: StudentType;
  role: UserRole;
  preferredCategories: string[];
  createdAt: string;
}

export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'recent';
