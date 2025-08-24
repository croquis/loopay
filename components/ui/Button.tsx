import React from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native';
import { Text } from './Text';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  style,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'flex-row items-center justify-center rounded-lg';

  const variantStyles = {
    primary: 'bg-primary-600 dark:bg-primary-500',
    secondary: 'bg-gray-200 dark:bg-gray-700',
    outline: 'border border-gray-300 dark:border-gray-600 bg-transparent',
    ghost: 'bg-transparent',
  };

  const sizeStyles = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const textVariants = {
    primary: 'button',
    secondary: 'button',
    outline: 'button',
    ghost: 'button',
  } as const;

  const textColors = {
    primary: 'text-white',
    secondary: 'text-gray-900 dark:text-gray-100',
    outline: 'text-primary-600 dark:text-primary-400',
    ghost: 'text-primary-600 dark:text-primary-400',
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        isDisabled ? 'opacity-50' : 'active:opacity-80'
      }`}
      style={style}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#ffffff' : '#3b82f6'}
        />
      ) : (
        <Text variant={textVariants[variant]} className={textColors[variant]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
