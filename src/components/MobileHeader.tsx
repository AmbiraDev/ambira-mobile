import React from 'react';
import { ArrowLeft } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/theme/colors';

type MobileHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: LucideIcon;
  onRightPress?: () => void;
  leftElement?: React.ReactNode;
};

export function MobileHeader({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  leftElement,
}: MobileHeaderProps): React.JSX.Element {
  const RightIcon = rightIcon;

  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
      ) : leftElement ? (
        <View style={styles.leftSlot}>{leftElement}</View>
      ) : (
        <View style={styles.spacer} />
      )}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {RightIcon ? (
        <TouchableOpacity onPress={onRightPress} hitSlop={12}>
          <RightIcon size={20} color={colors.textDark} />
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
  leftSlot: {
    minWidth: 26,
    alignItems: 'flex-start',
    justifyContent: 'center',
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
