import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { getCategoryById } from '@/constants/categories';
import { getSubscriptionStats } from '@/data/subscriptions';
import { formatCurrency, getRenewalColor, getRenewalText } from '@/lib/date';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<{
    monthlyTotal: number;
    yearlyTotal: number;
    upcomingRenewals: any[];
  } | null>(null);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      const result = await getSubscriptionStats(user.id);
      if (result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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

  const renderSubscriptionItem = (subscription: any) => {
    const category = getCategoryById(subscription.category);
    
    return (
      <TouchableOpacity
        key={subscription.id}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 border border-gray-200 dark:border-gray-700"
        onPress={() => router.push(`../../sub/${subscription.id}`)}
      >
        <View className="flex-row items-center space-x-3">
          {/* Service Logo Placeholder */}
          <View className={`w-12 h-12 rounded-full items-center justify-center ${category?.color || 'bg-gray-500'}`}>
            <Text className="text-white text-lg font-bold">
              {subscription.service_name.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          {/* Service Info */}
          <View className="flex-1">
            <Text variant="subtitle" className="mb-1">
              {subscription.service_name}
            </Text>
            <Text variant="caption" className="text-gray-600 dark:text-gray-400">
              {subscription.billing_cycle} • {subscription.category}
            </Text>
          </View>
          
          {/* Amount and Renewal */}
          <View className="items-end">
            <Text variant="subtitle" className="text-green-600 dark:text-green-400">
              {formatCurrency(subscription.amount, subscription.currency)}
            </Text>
            <View className={`px-2 py-1 rounded-full mt-1 ${getRenewalColor(subscription.renewal_date)}`}>
              <Text className="text-white text-xs font-medium">
                {getRenewalText(subscription.renewal_date)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center">
          <Text variant="subtitle">Loading...</Text>
        </View>
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
              Welcome back!
            </Text>
            <Text variant="subtitle" className="text-gray-600 dark:text-gray-400">
              Here's your subscription overview
            </Text>
          </View>

          {/* Stats Cards */}
          {stats && (
            <View className="space-y-4">
              <View className="flex-row space-x-3">
                <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <Text variant="caption" className="text-blue-600 dark:text-blue-400 mb-1">
                    Monthly Total
                  </Text>
                  <Text variant="title" className="text-blue-600 dark:text-blue-400">
                    {formatCurrency(stats.monthlyTotal, 'INR')}
                  </Text>
                </View>
                
                <View className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <Text variant="caption" className="text-green-600 dark:text-green-400 mb-1">
                    Yearly Total
                  </Text>
                  <Text variant="title" className="text-green-600 dark:text-green-400">
                    {formatCurrency(stats.yearlyTotal, 'INR')}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View className="space-y-4">
            <Text variant="subtitle">Quick Actions</Text>
            
            <View className="space-y-3">
              <Button 
                variant="primary" 
                size="lg"
                onPress={() => router.push('../add')}
              >
                <Ionicons name="add" size={20} color="white" className="mr-2" />
                Add Subscription
              </Button>
              
              <Button variant="outline" size="lg">
                <Ionicons name="analytics" size={20} color="#3b82f6" className="mr-2" />
                View Analytics
              </Button>
            </View>
          </View>

          {/* Upcoming Renewals */}
          {stats && stats.upcomingRenewals.length > 0 ? (
            <View className="space-y-4">
              <Text variant="subtitle">Upcoming Renewals</Text>
              {stats.upcomingRenewals.map(renderSubscriptionItem)}
            </View>
          ) : (
            <View className="space-y-4">
              <Text variant="subtitle">No Subscriptions Yet</Text>
              
              <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 items-center">
                <Ionicons name="card-outline" size={48} color="#9ca3af" className="mb-4" />
                <Text variant="subtitle" className="text-center mb-2">
                  Add your first subscription
                </Text>
                <Text variant="default" className="text-center text-gray-600 dark:text-gray-400 mb-4">
                  Start tracking your recurring expenses and never miss a renewal again.
                </Text>
                <Button 
                  variant="primary" 
                  size="md"
                  onPress={() => router.push('../add')}
                >
                  Get Started
                </Button>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
