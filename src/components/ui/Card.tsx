import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outlined' | 'elevated';
  accessibilityLabel?: string;
}

const colors = {
  bg: '#ffffff',
  surface: '#f8fafc',
  border: '#e2e8f0',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export default function Card({
  children,
  style,
  padding = 16,
  margin = 0,
  onPress,
  disabled = false,
  variant = 'default',
  accessibilityLabel,
}: CardProps) {
  const cardStyles = [
    styles.base,
    styles[variant],
    {
      padding,
      margin,
    },
    style,
  ];

  const Component = onPress ? TouchableOpacity : View;

  const touchableProps = onPress ? {
    onPress,
    disabled,
    accessibilityRole: 'button' as const,
    accessibilityLabel,
    activeOpacity: 0.8,
  } : {};

  return (
    <Component style={cardStyles} {...touchableProps}>
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
  },
  default: {
    backgroundColor: colors.bg,
  },
  outlined: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    backgroundColor: colors.bg,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Android
  },
});