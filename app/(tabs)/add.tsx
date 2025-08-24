import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="space-y-6">
          <View>
            <Text variant="title" className="mb-2">
              Add Transaction
            </Text>
            <Text
              variant="subtitle"
              className="text-gray-600 dark:text-gray-400"
            >
              Record your income or expenses
            </Text>
          </View>

          <View className="space-y-4">
            <Text variant="subtitle">Transaction Type</Text>

            <View className="flex-row space-x-3">
              <Button variant="primary" size="md" className="flex-1">
                Income
              </Button>
              <Button variant="outline" size="md" className="flex-1">
                Expense
              </Button>
            </View>
          </View>

          <View className="space-y-4">
            <Text variant="subtitle">Quick Add</Text>

            <View className="space-y-3">
              <Button variant="secondary" size="lg">
                💰 Salary
              </Button>

              <Button variant="secondary" size="lg">
                🍕 Food & Dining
              </Button>

              <Button variant="secondary" size="lg">
                🚗 Transportation
              </Button>

              <Button variant="secondary" size="lg">
                🏠 Housing
              </Button>
            </View>
          </View>

          <View className="space-y-4">
            <Text variant="subtitle">Custom Transaction</Text>

            <Button variant="ghost" size="lg">
              + Create Custom Transaction
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
