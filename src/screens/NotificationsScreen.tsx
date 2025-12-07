import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { MobileHeader } from '@/components/MobileHeader';
import { colors } from '@/theme/colors';

type NotificationsScreenProps = {
  onBack?: () => void;
};

export function NotificationsScreen({ onBack }: NotificationsScreenProps): React.JSX.Element {
  return (
    <View style={styles.page}>
      <MobileHeader title="Notifications" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emptyCard}>
          <Text style={styles.title}>All caught up</Text>
          <Text style={styles.copy}>We will drop new updates here when teammates support you.</Text>
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  content: {
    padding: 16,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    gap: 6,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  copy: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  bottomSpace: {
    height: 96,
  },
});
