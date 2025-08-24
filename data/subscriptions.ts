import { supabase } from '@/lib/supabase';
import { CreateSubscriptionData, Subscription, UpdateSubscriptionData } from '@/types';

export interface SubscriptionResult<T> {
  data: T | null;
  error: string | null;
}

export async function listSubscriptions(userId: string): Promise<SubscriptionResult<Subscription[]>> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('renewal_date', { ascending: true });

    if (error) {
      return { error: error.message, data: null };
    }

    return { data: data || [], error: null };
  } catch (error) {
    return { error: 'Failed to fetch subscriptions', data: null };
  }
}

export async function getSubscription(id: string, userId: string): Promise<SubscriptionResult<Subscription>> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      return { error: error.message, data: null };
    }

    return { data, error: null };
  } catch (error) {
    return { error: 'Failed to fetch subscription', data: null };
  }
}

export async function createSubscription(
  subscriptionData: CreateSubscriptionData,
  userId: string
): Promise<SubscriptionResult<Subscription>> {
  try {
    const insertData = {
      ...subscriptionData,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('subscriptions')
      .insert(insertData as any)
      .select()
      .single();

    if (error) {
      return { error: error.message, data: null };
    }

    return { data, error: null };
  } catch (error) {
    return { error: 'Failed to create subscription', data: null };
  }
}

export async function updateSubscription(
  id: string,
  updateData: UpdateSubscriptionData,
  userId: string
): Promise<SubscriptionResult<Subscription>> {
  try {
    const updatePayload = {
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('subscriptions')
      .update(updatePayload as any)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return { error: error.message, data: null };
    }

    return { data, error: null };
  } catch (error) {
    return { error: 'Failed to update subscription', data: null };
  }
}

export async function deleteSubscription(id: string, userId: string): Promise<SubscriptionResult<void>> {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return { error: error.message, data: null };
    }

    return { data: undefined, error: null };
  } catch (error) {
    return { error: 'Failed to delete subscription', data: null };
  }
}

export async function getSubscriptionStats(userId: string): Promise<SubscriptionResult<{
  monthlyTotal: number;
  yearlyTotal: number;
  upcomingRenewals: Subscription[];
}>> {
  try {
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return { error: error.message, data: null };
    }

    if (!subscriptions) {
      return { error: 'No subscriptions found', data: null };
    }

    const subs = subscriptions;
    const now = new Date();
    
    // Calculate monthly and yearly totals
    const monthlyTotal = subs
      .filter((sub: Subscription) => sub.billing_cycle === 'monthly')
      .reduce((sum: number, sub: Subscription) => sum + sub.amount, 0);
    
    const yearlyTotal = subs
      .filter((sub: Subscription) => sub.billing_cycle === 'yearly')
      .reduce((sum: number, sub: Subscription) => sum + sub.amount, 0);
    
    // Get upcoming renewals (next 3)
    const upcomingRenewals = subs
      .filter((sub: Subscription) => new Date(sub.renewal_date) > now)
      .sort((a: Subscription, b: Subscription) => 
        new Date(a.renewal_date).getTime() - new Date(b.renewal_date).getTime()
      )
      .slice(0, 3);
    
    return {
      data: {
        monthlyTotal,
        yearlyTotal,
        upcomingRenewals,
      },
      error: null,
    };
  } catch (error) {
    return { error: 'Failed to get subscription stats', data: null };
  }
}
