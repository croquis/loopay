import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/components/ui/Toast';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/providers/AuthProvider';
import { Stack } from 'expo-router';
import React from 'react';
import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
              },
              headerTintColor: colorScheme === 'dark' ? '#f9fafb' : '#111827',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="add"
              options={{
                title: 'Add Subscription',
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="sub"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="legal"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
