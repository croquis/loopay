export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'custom';

export interface Subscription {
  id: string;
  user_id: string;
  service_name: string;
  amount: number;
  currency: string;
  billing_cycle: BillingCycle;
  renewal_date: string; // ISO date string
  category: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionData {
  service_name: string;
  amount: number;
  currency: string;
  billing_cycle: BillingCycle;
  renewal_date: string;
  category: string;
  payment_method: string;
  notes?: string;
}

export interface UpdateSubscriptionData extends Partial<CreateSubscriptionData> {}

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

export interface SubscriptionStats {
  monthlyTotal: number;
  yearlyTotal: number;
  upcomingRenewals: Subscription[];
}
