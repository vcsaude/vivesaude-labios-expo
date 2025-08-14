import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  style?: ViewStyle;
}

const colors = {
  primary: '#1a1a2e',
  surface: '#f8fafc',
  border: '#e2e8f0',
  text: '#1a1a2e',
};

export default function ProgressBar({
  progress,
  height = 8,
  backgroundColor = colors.surface,
  progressColor = colors.primary,
  showLabel = false,
  label,
  animated = true,
  style,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const progressWidth = `${clampedProgress}%`;

  const containerStyle = [
    styles.container,
    {
      height,
      backgroundColor,
    },
    style,
  ];

  const progressStyle = [
    styles.progress,
    {
      width: progressWidth,
      backgroundColor: progressColor,
    },
  ];

  return (
    <View style={styles.wrapper}>
      {(showLabel || label) && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label || `${Math.round(clampedProgress)}%`}
          </Text>
        </View>
      )}
      <View style={containerStyle}>
        <View style={progressStyle} />
      </View>
    </View>
  );
}

// Animated version
interface AnimatedProgressBarProps extends ProgressBarProps {
  duration?: number;
}

export function AnimatedProgressBar({
  progress,
  duration = 300,
  ...props
}: AnimatedProgressBarProps) {
  const animatedProgress = React.useRef(new Animated.Value(0)).current;
  const [displayProgress, setDisplayProgress] = React.useState(0);

  React.useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration,
      useNativeDriver: false,
    }).start();

    const listener = animatedProgress.addListener(({ value }) => {
      setDisplayProgress(value);
    });

    return () => {
      animatedProgress.removeListener(listener);
    };
  }, [progress, duration]);

  return (
    <ProgressBar
      {...props}
      progress={displayProgress}
      animated={true}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  container: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
});