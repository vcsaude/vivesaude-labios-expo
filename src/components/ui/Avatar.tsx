import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';

interface AvatarProps {
  size?: number;
  source?: { uri: string } | number;
  name?: string;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

const colors = {
  primary: '#1a1a2e',
  surface: '#f8fafc',
  text: '#ffffff',
};

export default function Avatar({
  size = 48,
  source,
  name,
  backgroundColor = colors.primary,
  textColor = colors.text,
  style,
}: AvatarProps) {
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const avatarStyle = [
    styles.avatar,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
    },
    style,
  ];

  const textStyle = [
    styles.text,
    {
      fontSize: size * 0.4,
      color: textColor,
    },
  ];

  return (
    <View style={avatarStyle}>
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <Text style={textStyle}>
          {name ? getInitials(name) : '?'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    // Styles handled by inline styling
  },
  text: {
    fontWeight: 'bold',
  },
});