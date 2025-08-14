import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const colors = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  text: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.8)',
};

const { width } = Dimensions.get('window');

export default function Toast({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
  action,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (visible) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Animate in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          hideToast();
        }, duration);
      }
    } else {
      hideToast();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return '';
      case 'error':
        return '';
      case 'warning':
        return ' ';
      case 'info':
      default:
        return '9';
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.toast,
          { backgroundColor: colors[type] },
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.icon}>{getTypeIcon()}</Text>
          <Text style={styles.message}>{message}</Text>
          
          {action && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={action.onPress}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={hideToast}
            accessibilityRole="button"
            accessibilityLabel="Fechar notificação"
          >
            <Text style={styles.closeText}></Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// Hook for managing toast state
export function useToast() {
  const [toast, setToast] = React.useState<{
    visible: boolean;
    message: string;
    type: ToastType;
    duration?: number;
    action?: {
      label: string;
      onPress: () => void;
    };
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = (
    message: string,
    type: ToastType = 'info',
    duration: number = 3000,
    action?: { label: string; onPress: () => void }
  ) => {
    setToast({
      visible: true,
      message,
      type,
      duration,
      action,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const ToastComponent = () => (
    <Toast
      visible={toast.visible}
      message={toast.message}
      type={toast.type}
      duration={toast.duration}
      onHide={hideToast}
      action={toast.action}
    />
  );

  return {
    showToast,
    hideToast,
    ToastComponent,
    showSuccess: (message: string, duration?: number, action?: { label: string; onPress: () => void }) => 
      showToast(message, 'success', duration, action),
    showError: (message: string, duration?: number, action?: { label: string; onPress: () => void }) => 
      showToast(message, 'error', duration, action),
    showWarning: (message: string, duration?: number, action?: { label: string; onPress: () => void }) => 
      showToast(message, 'warning', duration, action),
    showInfo: (message: string, duration?: number, action?: { label: string; onPress: () => void }) => 
      showToast(message, 'info', duration, action),
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    borderRadius: 12,
    maxWidth: width - 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 56,
  },
  icon: {
    fontSize: 18,
    color: colors.text,
    marginRight: 12,
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    lineHeight: 22,
  },
  actionButton: {
    marginLeft: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
});