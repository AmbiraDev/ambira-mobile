import React from 'react';
import { Bell, Circle, Flame } from 'lucide-react-native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { MobileHeader } from '@/components/MobileHeader';
import { SessionCard } from '@/components/SessionCard';
import { SessionSkeleton } from '@/components/Skeletons';
import { DEFAULT_ACTIVITIES } from '@/data/activities';
import { useFeed } from '@/hooks/useFeed';
import type { Session, UserProfile } from '@/types/models';
import { colors } from '@/theme/colors';

type HomeScreenProps = {
  currentUser: UserProfile | null;
  refreshToken?: number;
  onOpenSession: (session: Session) => void;
  onOpenProfile?: (userId: string) => void;
  onOpenNotifications?: () => void;
};

export function HomeScreen({
  currentUser,
  refreshToken,
  onOpenSession,
  onOpenProfile,
  onOpenNotifications,
}: HomeScreenProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [filter, setFilter] = React.useState<'following' | 'all'>('following');
  const { data: sessions, usersById, loading, error } = useFeed(filter, {
    refreshToken,
  });

  const activityBreakdown = React.useMemo(() => {
    const totals = sessions.reduce<Record<string, number>>((acc, session) => {
      acc[session.activityId] = (acc[session.activityId] ?? 0) + session.durationMinutes;
      return acc;
    }, {});

    const totalMinutes = Object.values(totals).reduce((sum, value) => sum + value, 0);
    if (totalMinutes === 0) {
      return DEFAULT_ACTIVITIES.map((activity) => ({
        activityId: activity.id,
        label: activity.name,
        percent: 0,
      }));
    }

    return Object.entries(totals).map(([activityId, minutes]) => {
      const activity = DEFAULT_ACTIVITIES.find((a) => a.id === activityId);
      return {
        activityId,
        label: activity?.name ?? activityId,
        percent: Math.round((minutes / totalMinutes) * 100),
      };
    });
  }, [sessions]);

  const renderFeed = () => {
    if (loading) {
      return (
        <View style={styles.cardStack}>
          <SessionSkeleton />
          <SessionSkeleton />
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.cardStack, styles.emptyState]}>
          <Text style={styles.emptyTitle}>Could not load feed</Text>
          <Text style={styles.emptyCopy}>{error}</Text>
        </View>
      );
    }

    if (!currentUser) {
      return null;
    }

    if (sessions.length === 0) {
      return (
        <View style={[styles.cardStack, styles.emptyState]}>
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptyCopy}>
            Follow teammates or record your first session to start your feed.
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setFilter('all')}>
            <Text style={styles.secondaryButtonLabel}>Switch to All</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cardStack}>
        {sessions.map((session) => {
          const activity = DEFAULT_ACTIVITIES.find((a) => a.id === session.activityId);
          return (
            <SessionCard
              key={session.id}
              session={session}
              user={usersById[session.userId]}
              activity={activity}
              onPress={() => onOpenSession(session)}
              onUserPress={onOpenProfile}
            />
          );
        })}
      </View>
    );
  };

  const renderSidebar = () => (
    <View style={styles.sidebar}>
      <Text style={styles.sidebarTitle}>Highlights</Text>
      <View style={styles.sidebarCard}>
        <Text style={styles.sidebarLabel}>Activities mix</Text>
        {activityBreakdown.map((item) => (
          <View key={item.activityId} style={styles.activityRow}>
            <View style={styles.activityLabelRow}>
              <Circle
                size={12}
                color={colors.brandPrimary}
                fill={colors.brandPrimary}
                strokeWidth={2}
              />
              <Text style={styles.activityName}>{item.label}</Text>
            </View>
            <Text style={styles.activityPercent}>{item.percent}%</Text>
          </View>
        ))}
      </View>
      <View style={styles.sidebarCard}>
        <Text style={styles.sidebarLabel}>Tips</Text>
        <Text style={styles.tipCopy}>Pin the timer to keep your streak alive.</Text>
        <Text style={styles.tipCopy}>Use followers-only mode for sensitive work.</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.page}>
      <MobileHeader
        title="Home"
        rightIcon={Bell}
        onRightPress={onOpenNotifications}
        leftElement={
          (
            <View style={styles.streakChip}>
              <Flame size={16} color={colors.brandPrimary} fill={colors.brandPrimary} />
              <Text style={styles.streakText}>{currentUser?.streakDays ?? 0}</Text>
            </View>
          )
        }
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isWide ? styles.scrollContentWide : undefined,
        ]}
        stickyHeaderIndices={[isWide ? 1 : 1]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSpacing} />
        <View style={[styles.filterBar, isWide && styles.filterBarWide]}>
          <View style={styles.filters}>
            <TouchableOpacity
              style={[styles.filterPill, filter === 'following' && styles.filterPillActive]}
              onPress={() => setFilter('following')}
            >
              <Text
                style={[styles.filterText, filter === 'following' && styles.filterTextActive]}
              >
                Following
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, filter === 'all' && styles.filterPillActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                All
              </Text>
            </TouchableOpacity>
          </View>

        </View>
        <View style={[styles.layout, isWide && styles.layoutWide]}>
          {isWide ? renderSidebar() : null}
          <View style={styles.mainColumn}>
            {renderFeed()}
            <View style={styles.bottomSpace} />
          </View>
          {isWide ? renderSidebar() : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.card,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  scrollContentWide: {
    paddingHorizontal: 28,
  },
  topSpacing: {
    height: 6,
  },
  layout: {
    width: '100%',
    alignItems: 'center',
  },
  layoutWide: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'flex-start',
  },
  mainColumn: {
    flex: 1,
    maxWidth: 640,
    width: '100%',
  },
  filterBar: {
    backgroundColor: colors.card,
    paddingVertical: 10,
  },
  filterBarWide: {
    paddingVertical: 14,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'center',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterPillActive: {
    backgroundColor: colors.pill,
    borderColor: colors.brandPrimary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  filterTextActive: {
    color: colors.brandPrimary,
  },
  cardStack: {
    gap: 12,
  },
  emptyState: {
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  emptyCopy: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  secondaryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
  },
  secondaryButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  sidebar: {
    flex: 1,
    maxWidth: 240,
    gap: 12,
  },
  sidebarCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 12,
    gap: 8,
  },
  sidebarTitle: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    textTransform: 'uppercase',
  },
  sidebarLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityName: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  activityPercent: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  tipCopy: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  bottomSpace: {
    height: 96,
  },
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
});
