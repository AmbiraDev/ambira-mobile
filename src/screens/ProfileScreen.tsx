import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { MobileHeader } from '@/components/MobileHeader';
import { SessionCard } from '@/components/SessionCard';
import { SessionSkeleton } from '@/components/Skeletons';
import { StreakCard } from '@/components/StreakCard';
import {
  achievements as achievementData,
  activityBreakdown,
  followingList as followingSeed,
  getActivityById,
  getUserById,
} from '@/data/mockData';
import type { Session, UserProfile } from '@/types/models';
import { colors } from '@/theme/colors';

type ProfileScreenProps = {
  user: UserProfile;
  sessions: Session[];
  loading?: boolean;
  onBack?: () => void;
  onSelectSession?: (session: Session) => void;
};

type TabKey = 'overview' | 'achievements' | 'following' | 'sessions';

export function ProfileScreen({
  user,
  sessions,
  loading = false,
  onBack,
  onSelectSession,
}: ProfileScreenProps): React.JSX.Element {
  const [tab, setTab] = React.useState<TabKey>('overview');
  const [following, setFollowing] = React.useState(followingSeed);

  const userSessions = React.useMemo(
    () =>
      sessions
        .filter((session) => session.userId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [sessions, user.id],
  );

  const toggleFollow = (id: string) => {
    setFollowing((prev) =>
      prev.map((person) =>
        person.id === id ? { ...person, isFollowing: !person.isFollowing } : person,
      ),
    );
  };

  const renderActivityBreakdown = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Activity breakdown</Text>
      {activityBreakdown.map((item) => (
        <View key={item.activityId} style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>{item.label}</Text>
          <View style={styles.breakdownBar}>
            <View style={[styles.breakdownFill, { width: `${item.percent}%` }]} />
          </View>
          <Text style={styles.breakdownPercent}>{item.percent}%</Text>
        </View>
      ))}
    </View>
  );

  const renderOverview = () => {
    if (loading) {
      return (
        <View style={styles.stack}>
          <SessionSkeleton />
        </View>
      );
    }

    return (
      <View style={styles.stack}>
        <StreakCard current={user.streakDays} best={user.bestStreak} />
        {renderActivityBreakdown()}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent sessions</Text>
          {userSessions.slice(0, 3).map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              user={getUserById(session.userId)}
              activity={getActivityById(session.activityId)}
              onPress={() => onSelectSession?.(session)}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderAchievements = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Achievements</Text>
      <View style={styles.achievementGrid}>
        {achievementData.map((item) => (
          <View key={item.id} style={styles.achievement}>
            <Text style={styles.achievementLabel}>{item.label}</Text>
            <Text style={styles.achievementCopy}>{item.description}</Text>
          </View>
        ))}
        {achievementData.length === 0 ? (
          <Text style={styles.achievementCopy}>No badges yet. Keep logging sessions.</Text>
        ) : null}
      </View>
    </View>
  );

  const renderFollowing = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Following</Text>
      {following.map((person) => (
        <View key={person.id} style={styles.followRow}>
          <Avatar uri={person.avatar} fallback={person.name} />
          <View style={styles.followCopy}>
            <Text style={styles.followName}>{person.name}</Text>
            <Text style={styles.followHandle}>@{person.handle}</Text>
          </View>
          <TouchableOpacity
            style={[styles.followButton, !person.isFollowing && styles.followButtonHollow]}
            onPress={() => toggleFollow(person.id)}
          >
            <Text
              style={[styles.followLabel, !person.isFollowing && styles.followLabelMuted]}
            >
              {person.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderSessions = () => (
    <View style={styles.stack}>
      {userSessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          user={getUserById(session.userId)}
          activity={getActivityById(session.activityId)}
          onPress={() => onSelectSession?.(session)}
        />
      ))}
      {userSessions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptyCopy}>Record a session to show up here.</Text>
        </View>
      ) : null}
    </View>
  );

  const isSelf = user.isSelf;

  const tabContent = (() => {
    if (tab === 'overview') return renderOverview();
    if (tab === 'achievements') return renderAchievements();
    if (tab === 'following') return renderFollowing();
    return renderSessions();
  })();

  return (
    <View style={styles.page}>
      <MobileHeader title={user.name} subtitle={`@${user.handle}`} onBack={onBack} />
      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Avatar uri={user.avatar} fallback={user.name} size={84} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.handle}>@{user.handle}</Text>
          {user.location ? <Text style={styles.location}>{user.location}</Text> : null}
          {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
          <View style={styles.actionRow}>
            {isSelf ? (
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonLabel}>Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonLabel}>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonLabel}>Message</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <View style={styles.statsCard}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Followers</Text>
              <Text style={styles.statValue}>{user.followers}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Following</Text>
              <Text style={styles.statValue}>{user.following}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Total hours</Text>
              <Text style={styles.statValue}>{user.totalHours}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Sessions</Text>
              <Text style={styles.statValue}>{user.totalSessions}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabBar}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'achievements', label: 'Achievements' },
            { key: 'following', label: 'Following' },
            { key: 'sessions', label: 'Sessions' },
          ].map((item) => {
            const active = tab === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setTab(item.key as TabKey)}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.body}>
          {tabContent}
          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 6,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  handle: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  location: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  bio: {
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  statsCard: {
    marginTop: 10,
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabActive: {
    backgroundColor: colors.pill,
    borderColor: colors.brandPrimary,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  tabLabelActive: {
    color: colors.brandPrimary,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  stack: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 14,
    gap: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  breakdownBar: {
    flex: 2,
    height: 10,
    backgroundColor: colors.cardBorder,
    borderRadius: 12,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    backgroundColor: colors.brandPrimary,
  },
  breakdownPercent: {
    width: 48,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    fontFamily: 'DM Sans',
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievement: {
    width: '48%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  achievementLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  achievementCopy: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  followCopy: {
    flex: 1,
  },
  followName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  followHandle: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  followButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.brandPrimary,
  },
  followButtonHollow: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  followLabel: {
    color: colors.brandOnPrimary,
    fontWeight: '700',
    fontSize: 13,
    fontFamily: 'DM Sans',
  },
  followLabelMuted: {
    color: colors.textDark,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  emptyCopy: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  bottomSpace: {
    height: 96,
  },
  primaryButton: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonLabel: {
    color: colors.brandOnPrimary,
    fontWeight: '800',
    fontSize: 14,
    fontFamily: 'DM Sans',
  },
  secondaryButton: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonLabel: {
    color: colors.textDark,
    fontWeight: '700',
    fontSize: 14,
    fontFamily: 'DM Sans',
  },
});
