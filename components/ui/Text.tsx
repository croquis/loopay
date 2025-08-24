import React from 'react';
import { Text as RNText, TextInput as RNTextInput, TextInputProps as RNTextInputProps, TextProps as RNTextProps } from 'react-native';

export interface TextProps extends RNTextProps {
  variant?: 'default' | 'title' | 'subtitle' | 'caption' | 'button';
  children?: React.ReactNode;
}

export interface CustomTextInputProps extends RNTextInputProps {
  variant?: 'default' | 'title' | 'subtitle' | 'caption' | 'button';
}

export function Text({ variant = 'default', style, children, ...props }: TextProps) {
  const variantStyles = {
    default: 'text-base text-gray-900 dark:text-gray-100',
    title: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
    subtitle: 'text-lg font-semibold text-gray-700 dark:text-gray-300',
    caption: 'text-sm text-gray-500 dark:text-gray-400',
    button: 'text-base font-semibold text-primary-600 dark:text-primary-400',
  };

  return (
    <RNText className={variantStyles[variant]} style={style} {...props}>
      {children}
    </RNText>
  );
}

export function CustomTextInput({ variant = 'default', style, ...props }: CustomTextInputProps) {
  const variantStyles = {
    default: 'text-base text-gray-900 dark:text-gray-100',
    title: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
    subtitle: 'text-lg font-semibold text-gray-700 dark:text-gray-300',
    caption: 'text-sm text-gray-500 dark:text-gray-400',
    button: 'text-base font-semibold text-primary-600 dark:text-primary-400',
  };

  return (
    <RNTextInput
      className={variantStyles[variant]}
      style={style}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}
