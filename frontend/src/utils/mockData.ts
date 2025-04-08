
import { Subscription, CategoryInfo } from '../types/subscription';

// Generate random date within the next 30 days
const randomNextBillingDate = () => {
  const today = new Date();
  const random = Math.floor(Math.random() * 30) + 1;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + random);
  return nextDate;
};

export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    description: 'Premium streaming service',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'streaming',
    nextBillingDate: randomNextBillingDate(),
    logo: 'N',
    color: '#E50914',
    active: true,
    autoRenew: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Spotify',
    description: 'Music streaming service',
    amount: 9.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'entertainment',
    nextBillingDate: randomNextBillingDate(),
    logo: 'S',
    color: '#1DB954',
    active: true,
    autoRenew: true,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01'),
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    description: 'Creative software suite',
    amount: 52.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'productivity',
    nextBillingDate: randomNextBillingDate(),
    logo: 'A',
    color: '#FF0000',
    active: true,
    autoRenew: true,
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10'),
  },
  {
    id: '4',
    name: 'Amazon Prime',
    description: 'Shopping and streaming service',
    amount: 14.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'shopping',
    nextBillingDate: randomNextBillingDate(),
    logo: 'P',
    color: '#00A8E1',
    active: true,
    autoRenew: true,
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-05'),
  },
  {
    id: '5',
    name: 'Microsoft 365',
    description: 'Productivity software suite',
    amount: 6.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'productivity',
    nextBillingDate: randomNextBillingDate(),
    logo: 'M',
    color: '#0078D4',
    active: true,
    autoRenew: true,
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
  },
  {
    id: '6',
    name: 'Disney+',
    description: 'Family streaming service',
    amount: 7.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'streaming',
    nextBillingDate: randomNextBillingDate(),
    logo: 'D',
    color: '#0063E5',
    active: true,
    autoRenew: true,
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2023-04-01'),
  },
  {
    id: '7',
    name: 'YouTube Premium',
    description: 'Ad-free video streaming',
    amount: 11.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'entertainment',
    nextBillingDate: randomNextBillingDate(),
    logo: 'Y',
    color: '#FF0000',
    active: true,
    autoRenew: true,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-03-20'),
  },
  {
    id: '8',
    name: 'New York Times',
    description: 'News subscription',
    amount: 17.00,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'other',
    nextBillingDate: randomNextBillingDate(),
    logo: 'NYT',
    color: '#000000',
    active: true,
    autoRenew: true,
    createdAt: new Date('2023-01-25'),
    updatedAt: new Date('2023-01-25'),
  },
  {
    id: '9',
    name: 'iCloud Storage',
    description: 'Cloud storage service',
    amount: 2.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'utilities',
    nextBillingDate: randomNextBillingDate(),
    logo: 'iC',
    color: '#3090FF',
    active: true,
    autoRenew: true,
    createdAt: new Date('2023-02-28'),
    updatedAt: new Date('2023-02-28'),
  },
  {
    id: '10',
    name: 'GitHub Pro',
    description: 'Developer tools',
    amount: 7.00,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'saas',
    nextBillingDate: randomNextBillingDate(),
    logo: 'G',
    color: '#211F1F',
    active: true,
    autoRenew: true,
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-15'),
  },
];

export const categories: CategoryInfo[] = [
  { name: 'entertainment', label: 'Entertainment', icon: 'Music', color: '#FF5A5F' },
  { name: 'utilities', label: 'Utilities', icon: 'Lightbulb', color: '#57C5B6' },
  { name: 'saas', label: 'SaaS', icon: 'Cloud', color: '#8F43EE' },
  { name: 'streaming', label: 'Streaming', icon: 'Play', color: '#3A98B9' },
  { name: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: '#F4CE14' },
  { name: 'productivity', label: 'Productivity', icon: 'Briefcase', color: '#5CB8E4' },
  { name: 'other', label: 'Other', icon: 'Hash', color: '#6c757d' },
];

export const getCategoryInfo = (categoryName: string): CategoryInfo => {
  return categories.find(cat => cat.name === categoryName) || categories[6]; // Default to 'other' if not found
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Calculate total monthly spending
export const calculateTotalMonthly = (subscriptions: Subscription[]): number => {
  return subscriptions.reduce((total, sub) => {
    if (!sub.active) return total;
    
    let monthlyAmount = sub.amount;
    switch (sub.billingCycle) {
      case 'yearly':
        monthlyAmount = sub.amount / 12;
        break;
      case 'quarterly':
        monthlyAmount = sub.amount / 3;
        break;
      case 'weekly':
        monthlyAmount = sub.amount * 4.33; // Average weeks in a month
        break;
    }
    return total + monthlyAmount;
  }, 0);
};

// Calculate spending by category
export const calculateSpendingByCategory = (subscriptions: Subscription[]): Record<string, number> => {
  return subscriptions.reduce((acc, sub) => {
    if (!sub.active) return acc;
    
    let monthlyAmount = sub.amount;
    switch (sub.billingCycle) {
      case 'yearly':
        monthlyAmount = sub.amount / 12;
        break;
      case 'quarterly':
        monthlyAmount = sub.amount / 3;
        break;
      case 'weekly':
        monthlyAmount = sub.amount * 4.33; // Average weeks in a month
        break;
    }
    
    acc[sub.category] = (acc[sub.category] || 0) + monthlyAmount;
    return acc;
  }, {} as Record<string, number>);
};

// Get upcoming payments in the next 30 days
export const getUpcomingPayments = (subscriptions: Subscription[]): Subscription[] => {
  const today = new Date();
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);
  
  return subscriptions
    .filter(sub => sub.active && sub.nextBillingDate <= thirtyDaysLater)
    .sort((a, b) => a.nextBillingDate.getTime() - b.nextBillingDate.getTime());
};
