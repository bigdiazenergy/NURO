import { Category } from '../types';

export interface CategoryMeta {
  id: Category;
  title: string;
  description: string;
  color: string;
  icon: string;
  lessonCount: number;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'appointments',
    title: 'Appointments',
    description: 'Making, preparing for, and following up on medical and other appointments.',
    color: '#4A7FA5',
    icon: '📋',
    lessonCount: 2,
  },
  {
    id: 'money',
    title: 'Money Basics',
    description: 'Understanding bills, due dates, debit, credit, and basic budgeting.',
    color: '#6BAB90',
    icon: '💳',
    lessonCount: 2,
  },
  {
    id: 'daily-living',
    title: 'Daily Routines',
    description: 'Laundry, grocery shopping, cleaning, and building a weekly reset habit.',
    color: '#D4956A',
    icon: '🏠',
    lessonCount: 3,
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'Phone calls, asking questions, and handling everyday conversations.',
    color: '#8B7BB5',
    icon: '💬',
    lessonCount: 1,
  },
];

export function getCategoryMeta(id: Category): CategoryMeta {
  const found = CATEGORIES.find((c) => c.id === id);
  if (!found) {
    return CATEGORIES[0];
  }
  return found;
}
