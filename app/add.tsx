import { Button } from '@/components/ui/Button';
import { CustomTextInput, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { SUBSCRIPTION_CATEGORIES } from '@/constants/categories';
import { createSubscription } from '@/data/subscriptions';
import { scheduleRenewalNotification, triggerHaptic } from '@/lib/notifications';
import { useAuth } from '@/providers/AuthProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

const subscriptionSchema = z.object({
  service_name: z.string().min(1, 'Service name is required'),
  amount: z.string().min(1, 'Amount is required'),
  currency: z.string().min(1, 'Currency is required'),
  billing_cycle: z.enum(['monthly', 'yearly', 'weekly', 'custom']),
  renewal_date: z.string().min(1, 'Renewal date is required'),
  category: z.string().min(1, 'Category is required'),
  payment_method: z.string().min(1, 'Payment method is required'),
  notes: z.string().optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export default function AddSubscriptionScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      service_name: '',
      amount: '',
      currency: 'INR',
      billing_cycle: 'monthly',
      renewal_date: new Date().toISOString().split('T')[0],
      category: '',
      payment_method: '',
      notes: '',
    },
  });

  const onSubmit = async (data: SubscriptionFormData) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const result = await createSubscription(
        {
          ...data,
          amount: parseFloat(data.amount),
          renewal_date: data.renewal_date,
        },
        user.id
      );

      if (result.error) {
        showToast(result.error, 'error');
        triggerHaptic('error');
      } else {
        // Schedule notification for the new subscription
        if (result.data) {
          await scheduleRenewalNotification(result.data);
        }
        
        showToast('Subscription created successfully!', 'success');
        triggerHaptic('success');
        
        Alert.alert('Success', 'Subscription created successfully', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error) {
      showToast('An unexpected error occurred', 'error');
      triggerHaptic('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 px-6 py-6">
        <View className="space-y-6">
          {/* Header */}
          <View>
            <Text variant="title">Add Subscription</Text>
            <Text variant="subtitle" className="text-gray-600 dark:text-gray-400">
              Track your recurring expenses
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Service Name */}
            <View>
              <Text variant="default" className="mb-2">
                Service Name *
              </Text>
              <Controller
                control={control}
                name="service_name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800">
                    <CustomTextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="e.g., Netflix, Spotify"
                    />
                  </View>
                )}
              />
              {errors.service_name && (
                <Text variant="caption" className="text-red-500 mt-1">
                  {errors.service_name.message}
                </Text>
              )}
            </View>

            {/* Amount and Currency */}
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Text variant="default" className="mb-2">
                  Amount *
                </Text>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800">
                      <CustomTextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="0.00"
                        keyboardType="numeric"
                      />
                    </View>
                  )}
                />
                {errors.amount && (
                  <Text variant="caption" className="text-red-500 mt-1">
                    {errors.amount.message}
                  </Text>
                )}
              </View>

              <View className="w-20">
                <Text variant="default" className="mb-2">
                  Currency
                </Text>
                <Controller
                  control={control}
                  name="currency"
                  render={({ field: { onChange, value } }) => (
                    <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 bg-white dark:bg-gray-800">
                      <CustomTextInput
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                  )}
                />
              </View>
            </View>

            {/* Billing Cycle */}
            <View>
              <Text variant="default" className="mb-2">
                Billing Cycle *
              </Text>
              <Controller
                control={control}
                name="billing_cycle"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row space-x-2">
                    {['monthly', 'yearly', 'weekly', 'custom'].map((cycle) => (
                      <TouchableOpacity
                        key={cycle}
                        className={`flex-1 py-3 px-4 rounded-lg border ${
                          value === cycle
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        onPress={() => onChange(cycle)}
                      >
                        <Text
                          className={`text-center capitalize ${
                            value === cycle
                              ? 'text-primary-600 dark:text-primary-400 font-semibold'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {cycle}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>

            {/* Category */}
            <View>
              <Text variant="default" className="mb-2">
                Category *
              </Text>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <View className="grid grid-cols-2 gap-2">
                    {SUBSCRIPTION_CATEGORIES.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        className={`p-3 rounded-lg border ${
                          value === category.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        onPress={() => onChange(category.id)}
                      >
                        <View className="flex-row items-center space-x-2">
                          <Text className="text-lg">{category.icon}</Text>
                          <Text
                            className={`${
                              value === category.id
                                ? 'text-primary-600 dark:text-primary-400 font-semibold'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {category.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
              {errors.category && (
                <Text variant="caption" className="text-red-500 mt-1">
                  {errors.category.message}
                </Text>
              )}
            </View>

            {/* Payment Method */}
            <View>
              <Text variant="default" className="mb-2">
                Payment Method *
              </Text>
              <Controller
                control={control}
                name="payment_method"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800">
                    <CustomTextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="e.g., Credit Card, UPI"
                    />
                  </View>
                )}
              />
              {errors.payment_method && (
                <Text variant="caption" className="text-red-500 mt-1">
                  {errors.payment_method.message}
                </Text>
              )}
            </View>

            {/* Notes */}
            <View>
              <Text variant="default" className="mb-2">
                Notes (Optional)
              </Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800">
                    <CustomTextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Add any additional notes..."
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                )}
              />
            </View>
          </View>

          {/* Submit Button */}
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
          >
            Create Subscription
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
