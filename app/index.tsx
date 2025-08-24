import { Text } from '@/components/ui/Text';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 justify-center items-center px-6">
        <Text variant="title" className="text-center text-4xl font-bold mb-4">
          Hello, Loopay 👋
        </Text>
        <Text variant="subtitle" className="text-center text-gray-600 dark:text-gray-400 text-lg">
          Your subscriptions, simplified.
        </Text>
      </View>
    </SafeAreaView>
  );
}
