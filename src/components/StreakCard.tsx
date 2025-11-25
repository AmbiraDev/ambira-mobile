import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type StreakCardProps = {
  current: number;
  best?: number;
};

export function StreakCard({ current, best }: StreakCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeIcon}>🔥</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>Current streak</Text>
        <Text style={styles.value}>{current} days</Text>
        <Text style={styles.helper}>
          Keep it going! {best ? `Best: ${best} days.` : 'You are on a roll.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  badgeIcon: {
    fontSize: 22,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  helper: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
});
