import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large' | number;
  color?: string;
  text?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

const colors = {
  primary: '#1a1a2e',
  text: '#1a1a2e',
  textSecondary: '#64748b',
  overlay: 'rgba(255, 255, 255, 0.9)',
};

export default function LoadingSpinner({
  size = 'large',
  color = colors.primary,
  text,
  fullScreen = false,
  style,
}: LoadingSpinnerProps) {
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={styles.text}>{text}</Text>
      )}
    </View>
  );
}

// Full screen overlay loading component
interface OverlayLoadingProps {
  visible: boolean;
  text?: string;
  backgroundColor?: string;
}

export function OverlayLoading({
  visible,
  text = 'Carregando...',
  backgroundColor = colors.overlay,
}: OverlayLoadingProps) {
  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor }]}>
      <View style={styles.overlayContent}>
        <LoadingSpinner text={text} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullScreen: {
    flex: 1,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContent: {
    backgroundColor: colors.overlay,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});