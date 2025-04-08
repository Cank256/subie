
export type SubscriptionCategory = 
  | 'entertainment'
  | 'utilities'
  | 'saas'
  | 'streaming'
  | 'shopping'
  | 'productivity'
  | 'other';

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
  category: SubscriptionCategory;
  nextBillingDate: Date;
  logo?: string;
  color?: string;
  active: boolean;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryInfo {
  name: SubscriptionCategory;
  label: string;
  icon: string;
  color: string;
}
