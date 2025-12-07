import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';

type SkeletonBlockProps = {
  width?: number | string;
  height?: number;
  rounded?: number;
  style?: object;
};

export function SkeletonBlock({
  width = '100%',
  height = 12,
  rounded = 10,
  style,
}: SkeletonBlockProps): React.JSX.Element {
  return <View style={[styles.block, { width, height, borderRadius: rounded }, style]} />;
}

export function SessionSkeleton(): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <SkeletonBlock width={44} height={44} rounded={22} />
        <View style={styles.column}>
          <SkeletonBlock width="60%" />
          <SkeletonBlock width="40%" />
        </View>
      </View>
      <SkeletonBlock width="90%" style={styles.mt12} />
      <SkeletonBlock width="70%" style={styles.mt8} />
      <View style={styles.rowSpaced}>
        <SkeletonBlock width="25%" />
        <SkeletonBlock width="25%" />
        <SkeletonBlock width="25%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.skeleton,
    opacity: 0.9,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  rowSpaced: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  mt12: {
    marginTop: 12,
  },
  mt8: {
    marginTop: 8,
  },
});
