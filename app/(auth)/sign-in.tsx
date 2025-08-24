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

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace('/');
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
              Welcome Back
            </Text>
            <Text variant="subtitle" className="text-center text-gray-600 dark:text-gray-400">
              Sign in to your account
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text variant="default" className="mb-2">
                Email
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
          </View>

          {/* Submit Button */}
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
          >
            Sign In
          </Button>

          {/* Sign Up Link */}
          <View className="flex-row justify-center space-x-1">
            <Text variant="default" className="text-gray-600 dark:text-gray-400">
              Don't have an account?
            </Text>
            <Text
              variant="default"
              className="text-primary-600 dark:text-primary-400"
              onPress={() => router.push('../sign-up')}
            >
              Sign Up
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
