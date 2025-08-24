import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="space-y-6">
          {/* Header */}
          <View className="flex-row items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.back()}
              className="p-2 -ml-2"
            >
              <Ionicons name="arrow-back" size={24} color="#6b7280" />
            </Button>
            <Text variant="title">Privacy Policy</Text>
          </View>

          {/* Content */}
          <View className="space-y-6">
            <View>
              <Text variant="subtitle" className="mb-3">
                Last updated: {new Date().toLocaleDateString()}
              </Text>
              <Text variant="default" className="text-gray-600 dark:text-gray-400">
                Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
              </Text>
            </View>

            <View>
              <Text variant="subtitle" className="mb-2">Information We Collect</Text>
              <Text variant="default" className="text-gray-600 dark:text-gray-400 mb-2">
                We collect information you provide directly to us, such as:
              </Text>
              <View className="ml-4 space-y-1">
                <Text variant="default" className="text-gray-600 dark:text-gray-400">
                  • Account information (email, password)
                </Text>
                <Text variant="default" className="text-gray-600 dark:text-gray-400">
                  • Subscription details and financial data
                </Text>
                <Text variant="default" className="text-gray-600 dark:text-gray-400">
                  • App usage and preferences
                </Text>
              </View>
            </View>

            <View>
              <Text variant="subtitle" className="mb-2">How We Use Your Information</Text>
              <Text variant="default" className="text-gray-600 dark:text-gray-400 mb-2">
                We use the information we collect to:
              </Text>
              <View className="ml-4 space-y-1">
                <Text variant="default" className="text-gray-600 dark:text-gray-400">
                  • Provide and maintain our services
                </Text>
                <Text variant="default" className="text-gray-600 dark:text-gray-400">
                  • Send renewal reminders and notifications
                </Text>
                <Text variant="default" className="text-gray-600 dark:text-gray-400">
                  • Improve our app and user experience
                </Text>
                <Text variant="default" className="text-gray-600 dark:text-gray-400">
                  • Communicate with you about our services
                </Text>
              </View>
            </View>

            <View>
              <Text variant="subtitle" className="mb-2">Data Security</Text>
              <Text variant="default" className="text-gray-600 dark:text-gray-400">
                We implement appropriate security measures to protect your personal information. 
                Your data is encrypted and stored securely using industry-standard practices.
              </Text>
            </View>

            <View>
              <Text variant="subtitle" className="mb-2">Data Sharing</Text>
              <Text variant="default" className="text-gray-600 dark:text-gray-400">
                We do not sell, trade, or otherwise transfer your personal information to third parties. 
                We may share data only with your explicit consent or as required by law.
              </Text>
            </View>

            <View>
              <Text variant="subtitle" className="mb-2">Your Rights</Text>
              <Text variant="default" className="text-gray-600 dark:text-gray-400 mb-2">
                You have the right to:
              </Text>
              <View className="ml-4 space-y-1">
                <Text variant="default" className="text-gray-600 dark:text-gray-400">
                  • Access your personal data
                </Text>
                <Text variant="default" className="text-gray-600 dark:text-gray-400">
                  • Correct inaccurate information
                </Text>
                <Text variant="default" className="text-gray-600 dark:text-gray-400">
                  • Delete your account and data
                </Text>
                <Text variant="default" className="text-gray-600 dark:text-gray-400">
                  • Opt out of notifications
                </Text>
              </View>
            </View>

            <View>
              <Text variant="subtitle" className="mb-2">Contact Us</Text>
              <Text variant="default" className="text-gray-600 dark:text-gray-400">
                If you have any questions about this Privacy Policy, please contact us at:
              </Text>
              <Text variant="default" className="text-primary-600 dark:text-primary-400 mt-2">
                privacy@loopay.app
              </Text>
            </View>
          </View>

          {/* Back Button */}
          <View className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="white" className="mr-2" />
              Back to Settings
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
