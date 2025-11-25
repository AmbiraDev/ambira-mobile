import React from 'react';
import { Home, Timer, UserRound } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

export type BottomTabKey = 'home' | 'timer' | 'profile' | 'notifications';

type BottomNavigationProps = {
  active: BottomTabKey;
  onChange: (tab: BottomTabKey) => void;
};

const tabs: { key: BottomTabKey; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'timer', label: 'Record', icon: Timer },
  { key: 'profile', label: 'Profile', icon: UserRound },
];

export function BottomNavigation({ active, onChange }: BottomNavigationProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(12, insets.bottom + 10);

  return (
    <View style={[styles.container, { paddingBottom }]}>
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        const Icon = tab.icon;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => onChange(tab.key)}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
          >
            <Icon
              size={20}
              color={isActive ? colors.brandPrimary : colors.textMuted}
              strokeWidth={2.4}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    flexDirection: 'row',
    paddingBottom: 18,
    paddingTop: 10,
    paddingHorizontal: 8,
    gap: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  itemActive: {
    backgroundColor: colors.pill,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  labelActive: {
    color: colors.brandPrimary,
  },
});
