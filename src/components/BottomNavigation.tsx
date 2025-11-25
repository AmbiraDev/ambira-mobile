import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/theme/colors';

export type BottomTabKey = 'home' | 'timer' | 'profile' | 'notifications';

type BottomNavigationProps = {
  active: BottomTabKey;
  onChange: (tab: BottomTabKey) => void;
};

const tabs: { key: BottomTabKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'timer', label: 'Timer', icon: '⏱' },
  { key: 'profile', label: 'You', icon: '😊' },
  { key: 'notifications', label: 'Alerts', icon: '🔔' },
];

export function BottomNavigation({ active, onChange }: BottomNavigationProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => onChange(tab.key)}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
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
  icon: {
    fontSize: 18,
    color: colors.textMuted,
  },
  iconActive: {
    color: colors.brandPrimary,
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
