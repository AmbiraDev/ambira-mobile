import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type AvatarProps = {
  uri?: string;
  size?: number;
  fallback?: string;
};

export function Avatar({ uri, size = 40, fallback = '?' }: AvatarProps): React.JSX.Element {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={styles.initial}>{fallback.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.pill,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  initial: {
    fontWeight: '700',
    color: colors.textDark,
  },
});
