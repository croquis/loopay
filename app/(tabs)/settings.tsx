import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useColorScheme } from '@/hooks/useColorScheme';
import { showTestNotification } from '@/lib/notifications';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserPreferences {
  reminderLeadTime: number;
  currency: string;
  notificationsEnabled: boolean;
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const isDark = colorScheme === 'dark';
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    reminderLeadTime: 3,
    currency: 'INR',
    notificationsEnabled: true,
  });

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              showToast('Signed out successfully', 'success');
            } catch (error) {
              console.error('Failed to sign out:', error);
              showToast('Failed to sign out', 'error');
            }
          },
        },
      ]
    );
  };

  const handleTestNotification = async () => {
    try {
      await showTestNotification();
      showToast('Test notification sent!', 'success');
    } catch (error) {
      showToast('Failed to send test notification', 'error');
    }
  };

  const updateReminderLeadTime = (days: number) => {
    setPreferences(prev => ({ ...prev, reminderLeadTime: days }));
    showToast(`Reminders set to ${days} days before renewal`, 'success');
  };

  const updateCurrency = (currency: string) => {
    setPreferences(prev => ({ ...prev, currency }));
    showToast(`Currency changed to ${currency}`, 'success');
  };

  const toggleNotifications = (enabled: boolean) => {
    setPreferences(prev => ({ ...prev, notificationsEnabled: enabled }));
    showToast(
      enabled ? 'Notifications enabled' : 'Notifications disabled',
      enabled ? 'success' : 'warning'
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="space-y-6">
          {/* Header */}
          <View>
            <Text variant="title" className="mb-2">
              Settings
            </Text>
            <Text variant="subtitle" className="text-gray-600 dark:text-gray-400">
              Customize your experience
            </Text>
          </View>

          {/* User Info */}
          <View className="space-y-4">
            <Text variant="subtitle">Account</Text>
            
            <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <View className="flex-row items-center space-x-3">
                <View className="w-12 h-12 bg-primary-500 rounded-full items-center justify-center">
                  <Text className="text-white text-lg font-bold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text variant="subtitle">{user?.email}</Text>
                  <Text variant="caption" className="text-gray-500 dark:text-gray-400">
                    User ID: {user?.id?.slice(0, 8)}...
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View className="space-y-4">
            <Text variant="subtitle">Notifications</Text>
            
            <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
              <View className="flex-row items-center justify-between">
                <Text variant="default">Enable Notifications</Text>
                <Switch
                  value={preferences.notificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: '#d1d5db', true: '#60a5fa' }}
                  thumbColor="#ffffff"
                />
              </View>
              
              {preferences.notificationsEnabled && (
                <>
                  <View className="flex-row items-center justify-between">
                    <Text variant="default">Reminder Lead Time</Text>
                    <Text variant="default" className="text-primary-600 dark:text-primary-400">
                      {preferences.reminderLeadTime} days
                    </Text>
                  </View>
                  
                  <View className="flex-row space-x-2">
                    {[1, 3, 7, 14].map((days) => (
                      <TouchableOpacity
                        key={days}
                        className={`flex-1 py-2 px-3 rounded-lg border ${
                          preferences.reminderLeadTime === days
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        onPress={() => updateReminderLeadTime(days)}
                      >
                        <Text
                          className={`text-center text-sm ${
                            preferences.reminderLeadTime === days
                              ? 'text-primary-600 dark:text-primary-400 font-semibold'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {days} day{days > 1 ? 's' : ''}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={handleTestNotification}
                  >
                    <Ionicons name="notifications" size={16} color="#6b7280" className="mr-2" />
                    Test Notification
                  </Button>
                </>
              )}
            </View>
          </View>

          {/* Preferences */}
          <View className="space-y-4">
            <Text variant="subtitle">Preferences</Text>
            
            <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
              <View>
                <Text variant="default" className="mb-2">Default Currency</Text>
                <View className="flex-row space-x-2">
                  {['INR', 'USD', 'EUR', 'GBP'].map((currency) => (
                    <TouchableOpacity
                      key={currency}
                      className={`flex-1 py-2 px-3 rounded-lg border ${
                        preferences.currency === currency
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onPress={() => updateCurrency(currency)}
                    >
                      <Text
                        className={`text-center text-sm ${
                          preferences.currency === currency
                            ? 'text-primary-600 dark:text-primary-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {currency}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text variant="default">Dark Mode</Text>
                <Switch
                  value={isDark}
                  onValueChange={() => {}}
                  trackColor={{ false: '#d1d5db', true: '#60a5fa' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* Data & Backup */}
          <View className="space-y-4">
            <Text variant="subtitle">Data & Backup</Text>
            
            <View className="space-y-3">
              <Button variant="outline" size="lg" disabled>
                <Ionicons name="cloud-upload" size={20} color="#9ca3af" className="mr-2" />
                Import Data (Coming Soon)
              </Button>
              
              <Button variant="outline" size="lg" disabled>
                <Ionicons name="cloud-download" size={20} color="#9ca3af" className="mr-2" />
                Export Data (Coming Soon)
              </Button>
              
              <Button variant="ghost" size="lg">
                <Ionicons name="cloud" size={20} color="#6b7280" className="mr-2" />
                Cloud Sync
              </Button>
            </View>
          </View>

          {/* Support & Legal */}
          <View className="space-y-4">
            <Text variant="subtitle">Support & Legal</Text>
            
            <View className="space-y-3">
              <Button 
                variant="ghost" 
                size="lg"
                onPress={() => router.push('../../legal/privacy')}
              >
                <Ionicons name="shield-checkmark" size={20} color="#6b7280" className="mr-2" />
                Privacy Policy
              </Button>
              
              <Button variant="ghost" size="lg">
                <Ionicons name="help-circle" size={20} color="#6b7280" className="mr-2" />
                Help & FAQ
              </Button>
              
              <Button variant="ghost" size="lg">
                <Ionicons name="mail" size={20} color="#6b7280" className="mr-2" />
                Contact Support
              </Button>
              
              <Button variant="ghost" size="lg">
                <Ionicons name="star" size={20} color="#6b7280" className="mr-2" />
                Rate App
              </Button>
            </View>
          </View>

          {/* Sign Out */}
          <View className="pt-4">
            <Button
              variant="outline"
              size="lg"
              className="border-red-300"
              onPress={handleSignOut}
            >
              <Ionicons name="log-out" size={20} color="#ef4444" className="mr-2" />
              Sign Out
            </Button>
          </View>

          {/* App Version */}
          <View className="items-center pt-4">
            <Text variant="caption" className="text-gray-500 dark:text-gray-400">
              Loopay v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
