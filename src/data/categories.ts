import { Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-electronics',
    slug: 'electronics',
    name: 'Electronics',
    description: 'Headphones, power banks, keyboards, USB hubs, and everyday campus tech.',
    iconName: 'Laptop',
  },
  {
    id: 'cat-study',
    slug: 'study-essentials',
    name: 'Study Essentials',
    description: 'LED desk lamps, ergonomic stands, notebooks, and scientific calculators.',
    iconName: 'BookOpen',
  },
  {
    id: 'cat-hostel',
    slug: 'hostel-essentials',
    name: 'Hostel Essentials',
    description: 'Breathable cotton bedding, wardrobe organizers, and dorm storage solutions.',
    iconName: 'BedDouble',
  },
  {
    id: 'cat-personal-care',
    slug: 'personal-care',
    name: 'Personal Care',
    description: 'Cordless trimmers, quick-dry towels, and daily campus grooming essentials.',
    iconName: 'Sparkles',
  },
  {
    id: 'cat-daily',
    slug: 'daily-essentials',
    name: 'Daily Essentials',
    description: 'Water-resistant college backpacks and insulated bottles for long lecture days.',
    iconName: 'Backpack',
  },
];
