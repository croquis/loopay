import { Button } from '@/components/ui/Button';
import { CustomTextInput, Text } from '@/components/ui/Text';
import { supabase } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('../sign-in'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 px-6 py-8">
        <View className="space-y-8">
          {/* Header */}
          <View className="space-y-2">
            <Text variant="title" className="text-center">
              Create Account
            </Text>
            <Text variant="subtitle" className="text-center text-gray-600 dark:text-gray-400">
              Sign up to start managing your subscriptions
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Email */}
            <View>
              <Text variant="default" className="mb-2">
                Email Address
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800">
                    <CustomTextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text variant="caption" className="text-red-500 mt-1">
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Password */}
            <View>
              <Text variant="default" className="mb-2">
                Password
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800">
                    <CustomTextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your password"
                      secureTextEntry
                    />
                  </View>
                )}
              />
              {errors.password && (
                <Text variant="caption" className="text-red-500 mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Confirm Password */}
            <View>
              <Text variant="default" className="mb-2">
                Confirm Password
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800">
                    <CustomTextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Confirm your password"
                      secureTextEntry
                    />
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <Text variant="caption" className="text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          </View>

          {/* Submit Button */}
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
          >
            Create Account
          </Button>

          {/* Sign In Link */}
          <View className="items-center">
            <Text variant="default" className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
            </Text>
            <Text
              variant="default"
              className="text-primary-600 dark:text-primary-400"
              onPress={() => router.push('../sign-in')}
            >
              Sign In
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
