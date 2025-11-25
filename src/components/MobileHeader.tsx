import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/theme/colors';

type MobileHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
};

export function MobileHeader({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
}: MobileHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>{'\u2039'}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} hitSlop={12}>
          <Text style={styles.right}>{rightIcon}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  spacer: {
    width: 26,
  },
  back: {
    fontSize: 24,
    color: colors.textDark,
    fontWeight: '700',
  },
  right: {
    fontSize: 18,
    color: colors.textDark,
    fontWeight: '700',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
});
