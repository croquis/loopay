import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 4, className = '' }: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      className={`bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{
        width: typeof width === 'string' ? (width as any) : width,
        height,
        borderRadius,
        opacity,
      }}
    />
  );
}

export function SubscriptionSkeleton() {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center space-x-3">
        {/* Service Logo Placeholder */}
        <Skeleton width={48} height={48} borderRadius={24} />
        
        {/* Service Info */}
        <View className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={14} />
        </View>
        
        {/* Amount and Renewal */}
        <View className="items-end space-y-2">
          <Skeleton width={60} height={16} />
          <Skeleton width={80} height={20} borderRadius={10} />
        </View>
      </View>
    </View>
  );
}

export function ChartSkeleton() {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4">
      <Skeleton width="40%" height={20} className="mb-4" />
      <View className="items-center">
        <Skeleton width={200} height={200} borderRadius={100} />
      </View>
    </View>
  );
}

export function StatsCardSkeleton() {
  return (
    <View className="flex-row space-x-3">
      <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <Skeleton width="60%" height={14} className="mb-2" />
        <Skeleton width="80%" height={24} />
      </View>
      
      <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <Skeleton width="60%" height={14} className="mb-2" />
        <Skeleton width="80%" height={24} />
      </View>
    </View>
  );
}
