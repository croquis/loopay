import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { getCategoryById } from '@/constants/categories';
import { deleteSubscription, getSubscription } from '@/data/subscriptions';
import { formatCurrency, getRenewalColor, getRenewalText } from '@/lib/date';
import { useAuth } from '@/providers/AuthProvider';
import { Subscription } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchSubscription();
    }
  }, [id, user]);

  const fetchSubscription = async () => {
    if (!id) return;
    
    if (!user) return;
    
    try {
      const result = await getSubscription(id, user.id);
      if (result.data) {
        setSubscription(result.data);
      } else if (result.error) {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Subscription',
      'Are you sure you want to delete this subscription? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            
            if (!user?.id) return;
            
            try {
              const result = await deleteSubscription(id, user.id);
              if (result.error) {
                Alert.alert('Error', result.error);
              } else {
                Alert.alert('Success', 'Subscription deleted successfully', [
                  {
                    text: 'OK',
                    onPress: () => router.back(),
                  },
                ]);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete subscription');
            }
          },
        },
      ]
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

  if (!subscription) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center">
          <Text variant="subtitle">Subscription not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const category = getCategoryById(subscription.category);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="space-y-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2"
            >
              <Ionicons name="arrow-back" size={24} color="#6b7280" />
            </TouchableOpacity>
            
            <View className="flex-row space-x-2">
              <Button
                variant="outline"
                size="sm"
                onPress={() => setEditing(!editing)}
              >
                <Ionicons name="pencil" size={16} color="#6b7280" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-red-300"
                onPress={handleDelete}
              >
                <Ionicons name="trash" size={16} color="#ef4444" />
              </Button>
            </View>
          </View>

          {/* Service Info */}
          <View className="items-center space-y-4">
            <View className={`w-20 h-20 rounded-full items-center justify-center ${category?.color || 'bg-gray-500'}`}>
              <Text className="text-white text-3xl font-bold">
                {subscription.service_name.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            <View className="items-center">
              <Text variant="title">{subscription.service_name}</Text>
              <Text variant="subtitle" className="text-gray-600 dark:text-gray-400">
                {subscription.category}
              </Text>
            </View>
          </View>

          {/* Amount and Billing */}
          <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <View className="flex-row justify-between items-center">
              <Text variant="default">Amount</Text>
              <Text variant="title" className="text-green-600 dark:text-green-400">
                {formatCurrency(subscription.amount, subscription.currency)}
              </Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text variant="default">Billing Cycle</Text>
              <Text variant="default" className="capitalize">
                {subscription.billing_cycle}
              </Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text variant="default">Payment Method</Text>
              <Text variant="default">{subscription.payment_method}</Text>
            </View>
          </View>

          {/* Renewal Info */}
          <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <View className="flex-row justify-between items-center">
              <Text variant="default">Next Renewal</Text>
              <Text variant="default">{subscription.renewal_date}</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text variant="default">Status</Text>
              <View className={`px-3 py-1 rounded-full ${getRenewalColor(subscription.renewal_date)}`}>
                <Text className="text-white text-sm font-medium">
                  {getRenewalText(subscription.renewal_date)}
                </Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {subscription.notes && (
            <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <Text variant="subtitle" className="mb-2">Notes</Text>
              <Text variant="default">{subscription.notes}</Text>
            </View>
          )}

          {/* Actions */}
          <View className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              onPress={() => router.push('../add')}
            >
              <Ionicons name="add" size={20} color="white" className="mr-2" />
              Add Another Subscription
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onPress={() => router.back()}
            >
              Back to Home
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
