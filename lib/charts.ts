import { Subscription } from '@/types';

export interface PieChartData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

export interface MonthlyTrendData {
  month: string;
  total: number;
  count: number;
}

/**
 * Generate pie chart data for subscription categories
 */
export function generateCategoryPieData(subscriptions: Subscription[]): PieChartData[] {
  const categoryTotals: { [key: string]: number } = {};
  
  // Calculate totals by category
  subscriptions.forEach(sub => {
    if (categoryTotals[sub.category]) {
      categoryTotals[sub.category] += sub.amount;
    } else {
      categoryTotals[sub.category] = sub.amount;
    }
  });
  
  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  // Generate pie chart data
  const pieData: PieChartData[] = Object.entries(categoryTotals).map(([category, amount]) => ({
    label: category,
    value: amount,
    color: getCategoryColor(category),
    percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
  }));
  
  // Sort by value descending
  return pieData.sort((a, b) => b.value - a.value);
}

/**
 * Generate monthly trend data for the last 6 months
 */
export function generateMonthlyTrendData(subscriptions: Subscription[]): MonthlyTrendData[] {
  const months: MonthlyTrendData[] = [];
  const now = new Date();
  
  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    months.push({
      month: monthName,
      total: 0,
      count: 0,
    });
  }
  
  // Calculate monthly totals based on billing cycles
  subscriptions.forEach(sub => {
    const renewalDate = new Date(sub.renewal_date);
    const now = new Date();
    
    // Calculate how many times this subscription would renew in each month
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      let renewalsInMonth = 0;
      
      switch (sub.billing_cycle) {
        case 'weekly':
          // Calculate weeks between dates
          const weeksDiff = Math.floor((monthEnd.getTime() - renewalDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
          if (weeksDiff >= 0) {
            renewalsInMonth = Math.floor(weeksDiff / 4) + 1; // Approximate
          }
          break;
        case 'monthly':
          if (renewalDate <= monthEnd) {
            renewalsInMonth = 1;
          }
          break;
        case 'yearly':
          if (renewalDate.getMonth() === monthDate.getMonth() && renewalDate.getDate() <= monthEnd.getDate()) {
            renewalsInMonth = 1;
          }
          break;
        case 'custom':
          // Assume monthly for custom
          if (renewalDate <= monthEnd) {
            renewalsInMonth = 1;
          }
          break;
      }
      
      if (renewalsInMonth > 0) {
        months[5 - i].total += sub.amount * renewalsInMonth;
        months[5 - i].count += renewalsInMonth;
      }
    }
  });
  
  return months;
}

/**
 * Get color for category
 */
function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    entertainment: '#8b5cf6', // purple
    productivity: '#3b82f6', // blue
    utilities: '#6b7280',    // gray
    fitness: '#10b981',      // green
    education: '#6366f1',    // indigo
    other: '#f59e0b',        // amber
  };
  
  return colors[category.toLowerCase()] || '#6b7280';
}

/**
 * Calculate potential savings from canceling subscriptions
 */
export function calculatePotentialSavings(subscriptions: Subscription[]): {
  totalYearly: number;
  lowUseSuggestions: Array<{
    subscription: Subscription;
    yearlyCost: number;
    reason: string;
  }>;
} {
  const totalYearly = subscriptions.reduce((total, sub) => {
    switch (sub.billing_cycle) {
      case 'weekly':
        return total + (sub.amount * 52);
      case 'monthly':
        return total + (sub.amount * 12);
      case 'yearly':
        return total + sub.amount;
      case 'custom':
        return total + (sub.amount * 12); // Assume monthly
      default:
        return total;
    }
  }, 0);
  
  // Identify potential low-use subscriptions
  const lowUseSuggestions = subscriptions
    .map(sub => {
      let yearlyCost = 0;
      switch (sub.billing_cycle) {
        case 'weekly':
          yearlyCost = sub.amount * 52;
          break;
        case 'monthly':
          yearlyCost = sub.amount * 12;
          break;
        case 'yearly':
          yearlyCost = sub.amount;
          break;
        case 'custom':
          yearlyCost = sub.amount * 12;
          break;
      }
      
      return {
        subscription: sub,
        yearlyCost,
        reason: getLowUseReason(sub),
      };
    })
    .filter(suggestion => suggestion.reason !== '')
    .sort((a, b) => b.yearlyCost - a.yearlyCost)
    .slice(0, 3); // Top 3 suggestions
  
  return {
    totalYearly,
    lowUseSuggestions,
  };
}

/**
 * Determine if a subscription might be low-use
 */
function getLowUseReason(subscription: Subscription): string {
  const now = new Date();
  const renewalDate = new Date(subscription.renewal_date);
  const daysSinceRenewal = Math.floor((now.getTime() - renewalDate.getTime()) / (24 * 60 * 60 * 1000));
  
  // If it's been more than 2 billing cycles, suggest reviewing
  switch (subscription.billing_cycle) {
    case 'weekly':
      if (daysSinceRenewal > 14) return 'No activity for 2+ weeks';
      break;
    case 'monthly':
      if (daysSinceRenewal > 60) return 'No activity for 2+ months';
      break;
    case 'yearly':
      if (daysSinceRenewal > 730) return 'No activity for 2+ years';
      break;
  }
  
  // High-cost subscriptions might be worth reviewing
  if (subscription.amount > 1000) {
    return 'High-cost subscription - consider reviewing';
  }
  
  return '';
}
