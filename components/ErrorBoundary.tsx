import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
          <ScrollView className="flex-1 px-6 py-8">
            <View className="flex-1 items-center justify-center space-y-6">
              {/* Error Icon */}
              <View className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full items-center justify-center">
                <Ionicons name="alert-circle" size={48} color="#ef4444" />
              </View>

              {/* Error Title */}
              <View className="items-center space-y-2">
                <Text variant="title" className="text-center text-red-600 dark:text-red-400">
                  Oops! Something went wrong
                </Text>
                <Text variant="subtitle" className="text-center text-gray-600 dark:text-gray-400">
                  We encountered an unexpected error
                </Text>
              </View>

              {/* Error Details (Development only) */}
              {__DEV__ && this.state.error && (
                <View className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <Text variant="subtitle" className="text-gray-700 dark:text-gray-300">
                    Error Details:
                  </Text>
                  <Text variant="caption" className="text-red-600 dark:text-red-400 font-mono">
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text variant="caption" className="text-gray-600 dark:text-gray-400 font-mono">
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </View>
              )}

              {/* Action Buttons */}
              <View className="space-y-3 w-full">
                <Button
                  variant="primary"
                  size="lg"
                  onPress={this.handleReset}
                >
                  <Ionicons name="refresh" size={20} color="white" className="mr-2" />
                  Try Again
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onPress={() => {
                    // Navigate to home or restart app
                    this.handleReset();
                  }}
                >
                  <Ionicons name="home" size={20} color="#6b7280" className="mr-2" />
                  Go to Home
                </Button>
              </View>

              {/* Help Text */}
              <View className="items-center space-y-2">
                <Text variant="caption" className="text-center text-gray-500 dark:text-gray-400">
                  If this problem persists, please contact support
                </Text>
                <Text variant="caption" className="text-center text-gray-500 dark:text-gray-400">
                  Error ID: {this.state.error?.name || 'Unknown'}
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

// HOC to wrap components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
