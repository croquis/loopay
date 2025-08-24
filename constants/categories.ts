export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const SUBSCRIPTION_CATEGORIES: Category[] = [
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: 'bg-purple-500',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: '💼',
    color: 'bg-blue-500',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: '🔧',
    color: 'bg-gray-500',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: '💪',
    color: 'bg-green-500',
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    color: 'bg-indigo-500',
  },
  {
    id: 'other',
    name: 'Other',
    icon: '📦',
    color: 'bg-orange-500',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return SUBSCRIPTION_CATEGORIES.find(category => category.id === id);
}

export function getCategoryByName(name: string): Category | undefined {
  return SUBSCRIPTION_CATEGORIES.find(category => category.name === name);
}
