import { Button } from '@/components/ui/Button';
import { PieChart } from '@/components/ui/PieChart';
import { ChartSkeleton, StatsCardSkeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { getSubscriptionStats, listSubscriptions } from '@/data/subscriptions';
import { calculatePotentialSavings, generateCategoryPieData, generateMonthlyTrendData } from '@/lib/charts';
import { formatCurrency } from '@/lib/date';
import { useAuth } from '@/providers/AuthProvider';
import { Subscription } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<{
    monthlyTotal: number;
    yearlyTotal: number;
    upcomingRenewals: Subscription[];
  } | null>(null);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      const [subscriptionsResult, statsResult] = await Promise.all([
        listSubscriptions(user.id),
        getSubscriptionStats(user.id),
      ]);

      if (subscriptionsResult.data) {
        setSubscriptions(subscriptionsResult.data);
      }

      if (statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      showToast('Failed to load analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const categoryData = generateCategoryPieData(subscriptions);
  const monthlyTrendData = generateMonthlyTrendData(subscriptions);
  const savingsData = calculatePotentialSavings(subscriptions);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <ScrollView className="flex-1 px-4 py-6">
          <View className="space-y-6">
            <View>
              <Text variant="title" className="mb-2">
                Analytics
              </Text>
              <Text variant="subtitle" className="text-gray-600 dark:text-gray-400">
                Track your financial progress
              </Text>
            </View>

            <StatsCardSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView 
        className="flex-1 px-4 py-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="space-y-6">
          {/* Header */}
          <View>
            <Text variant="title" className="mb-2">
              Analytics
            </Text>
            <Text variant="subtitle" className="text-gray-600 dark:text-gray-400">
              Track your financial progress
            </Text>
          </View>

          {/* Overview Stats */}
          {stats && (
            <View className="space-y-4">
              <Text variant="subtitle">Overview</Text>
              
              <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <View className="flex-row justify-between">
                  <Text variant="default">Total Balance</Text>
                  <Text variant="subtitle" className="text-green-600 dark:text-green-400">
                    {formatCurrency(stats.monthlyTotal + stats.yearlyTotal, 'INR')}
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text variant="default">Monthly Subscriptions</Text>
                  <Text variant="default" className="text-green-600 dark:text-green-400">
                    {formatCurrency(stats.monthlyTotal, 'INR')}
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text variant="default">Yearly Subscriptions</Text>
                  <Text variant="default" className="text-green-600 dark:text-green-400">
                    {formatCurrency(stats.yearlyTotal, 'INR')}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Category Breakdown */}
          <View className="space-y-4">
            <Text variant="subtitle">Spending by Category</Text>
            
            <View className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <PieChart data={categoryData} size={200} />
              
              {/* Category Legend */}
              <View className="mt-6 space-y-2">
                {categoryData.map((item, index) => (
                  <View key={index} className="flex-row items-center space-x-3">
                    <View 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text variant="default" className="flex-1">
                      {item.label}
                    </Text>
                    <Text variant="default" className="font-semibold">
                      {formatCurrency(item.value, 'INR')}
                    </Text>
                    <Text variant="caption" className="text-gray-500 dark:text-gray-400">
                      {item.percentage}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Monthly Trends */}
          <View className="space-y-4">
            <Text variant="subtitle">Monthly Spending Trends</Text>
            
            <View className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <View className="space-y-4">
                {monthlyTrendData.map((month, index) => (
                  <View key={index} className="space-y-2">
                    <View className="flex-row justify-between items-center">
                      <Text variant="default" className="font-medium">
                        {month.month}
                      </Text>
                      <Text variant="default" className="text-green-600 dark:text-green-400">
                        {formatCurrency(month.total, 'INR')}
                      </Text>
                    </View>
                    
                    {/* Progress Bar */}
                    <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <View 
                        className="h-full bg-primary-500 rounded-full"
                        style={{ 
                          width: `${Math.min((month.total / Math.max(...monthlyTrendData.map(m => m.total))) * 100, 100)}%` 
                        }}
                      />
                    </View>
                    
                    <Text variant="caption" className="text-gray-500 dark:text-gray-400">
                      {month.count} renewal{month.count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Savings Suggestions */}
          <View className="space-y-4">
            <Text variant="subtitle">Potential Savings</Text>
            
            <View className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <View className="mb-4">
                <Text variant="subtitle" className="text-green-600 dark:text-green-400">
                  Total Yearly Spending: {formatCurrency(savingsData.totalYearly, 'INR')}
                </Text>
              </View>
              
              {savingsData.lowUseSuggestions.length > 0 ? (
                <View className="space-y-4">
                  <Text variant="default" className="text-gray-600 dark:text-gray-400">
                    Consider reviewing these subscriptions:
                  </Text>
                  
                  {savingsData.lowUseSuggestions.map((suggestion, index) => (
                    <View key={index} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                      <View className="flex-row justify-between items-start mb-2">
                        <Text variant="subtitle" className="flex-1">
                          {suggestion.subscription.service_name}
                        </Text>
                        <Text variant="subtitle" className="text-yellow-600 dark:text-yellow-400">
                          {formatCurrency(suggestion.yearlyCost, 'INR')}/year
                        </Text>
                      </View>
                      
                      <Text variant="caption" className="text-yellow-700 dark:text-yellow-300 mb-3">
                        {suggestion.reason}
                      </Text>
                      
                      <TouchableOpacity
                        onPress={() => router.push(`../../sub/${suggestion.subscription.id}`)}
                        className="bg-yellow-100 dark:bg-yellow-800 rounded-lg px-3 py-2 self-start"
                      >
                        <Text variant="caption" className="text-yellow-800 dark:text-yellow-200">
                          Review Subscription
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <Text variant="default" className="text-green-700 dark:text-green-300 text-center">
                    🎉 Great job! Your subscriptions look well-managed.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="space-y-4">
            <Text variant="subtitle">Quick Actions</Text>
            
            <View className="space-y-3">
              <Button 
                variant="outline" 
                size="lg"
                onPress={() => router.push('../add')}
              >
                <Ionicons name="add" size={20} color="#3b82f6" className="mr-2" />
                Add New Subscription
              </Button>
              
              <Button variant="ghost" size="lg">
                <Ionicons name="download" size={20} color="#6b7280" className="mr-2" />
                Export Data
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
