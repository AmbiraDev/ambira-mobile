import React from 'react';
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/theme/colors';
import type { Activity, Session, UserProfile } from '@/types/models';
import { Avatar } from './Avatar';

type SessionCardProps = {
  session: Session;
  user?: UserProfile;
  activity?: Activity;
  onPress?: () => void;
  onSupportToggle?: (id: string, supported: boolean) => void;
  onCommentPress?: () => void;
  onShare?: () => void;
  onUserPress?: (userId: string) => void;
  showActions?: boolean;
};

const VISIBILITY_LABELS: Record<Session['visibility'], string> = {
  everyone: 'Public',
  followers: 'Followers',
  private: 'Private',
};

const FEELING_LABELS: Record<string, string> = {
  energized: 'Energized',
  neutral: 'Neutral',
  tired: 'Tired',
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
};

const timeAgo = (dateString: string): string => {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = Math.max(now - then, 0);
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export function SessionCard({
  session,
  user,
  activity,
  onPress,
  onSupportToggle,
  onCommentPress,
  onShare,
  onUserPress,
  showActions = true,
}: SessionCardProps): React.JSX.Element {
  const [supported, setSupported] = React.useState<boolean>(session.supported ?? false);
  const [supportCount, setSupportCount] = React.useState<number>(session.supports);

  React.useEffect(() => {
    setSupported(session.supported ?? false);
    setSupportCount(session.supports);
  }, [session.id, session.supported, session.supports]);

  const handleSupport = () => {
    setSupported((prev) => {
      const next = !prev;
      setSupportCount((count) => Math.max(0, count + (next ? 1 : -1)));
      onSupportToggle?.(session.id, next);
      return next;
    });
  };

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    try {
      await Share.share({
        message: `${session.title} — ${formatDuration(session.durationMinutes)} via Ambira`,
      });
    } catch {
      // Ignore share errors for now
    }
  };

  const content = (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerPressable}
          disabled={!onUserPress || !user}
          onPress={() => {
            if (user && onUserPress) onUserPress(user.id);
          }}
        >
          <Avatar uri={user?.avatar} fallback={user?.name} />
          <View style={styles.headerCopy}>
            <Text style={styles.userName}>{user?.name ?? 'Unknown user'}</Text>
            <Text style={styles.subline}>
              @{user?.handle ?? 'anon'} · {timeAgo(session.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.visibility}>
          <Text style={styles.visibilityText}>
            {VISIBILITY_LABELS[session.visibility]}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{session.title}</Text>
      {session.description ? <Text style={styles.description}>{session.description}</Text> : null}

      <View style={styles.metaRow}>
        {activity ? (
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>{activity.emoji}</Text>
            <Text style={styles.metaValue}>{activity.name}</Text>
          </View>
        ) : null}
        <View style={styles.metaPill}>
          <Text style={styles.metaLabel}>⏱</Text>
          <Text style={styles.metaValue}>{formatDuration(session.durationMinutes)}</Text>
        </View>
        {session.feeling ? (
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>🙂</Text>
            <Text style={styles.metaValue}>
              {FEELING_LABELS[session.feeling] ?? session.feeling}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.metaRow}>
        {session.project ? (
          <View style={[styles.metaPill, styles.projectPill]}>
            <Text style={styles.metaLabel}>•</Text>
            <Text style={styles.metaValue}>{session.project}</Text>
          </View>
        ) : null}
        <View style={[styles.metaPill, styles.visibilityPill]}>
          <Text style={[styles.metaValue, styles.visibilityValue]}>
            {VISIBILITY_LABELS[session.visibility]}
          </Text>
        </View>
      </View>

      {session.media && session.media.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mediaRow}
        >
          {session.media.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.media} />
          ))}
        </ScrollView>
      ) : null}

      {showActions ? (
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={handleSupport} style={styles.action}>
            <Text style={[styles.actionLabel, supported && styles.actionLabelActive]}>
              {supported ? 'Supported' : 'Support'} · {supportCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCommentPress} style={styles.action}>
            <Text style={styles.actionLabel}>Comment · {session.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.action}>
            <Text style={styles.actionLabel}>Share · {session.shares}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    gap: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerCopy: {
    flex: 1,
  },
  headerPressable: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  subline: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  visibility: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  visibilityText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.pill,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  projectPill: {
    backgroundColor: colors.white,
  },
  visibilityPill: {
    backgroundColor: colors.visibilityPill,
    borderColor: colors.brandPrimary,
  },
  visibilityValue: {
    color: colors.brandPrimary,
  },
  mediaRow: {
    gap: 10,
    marginTop: 8,
  },
  media: {
    width: 180,
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.cardBorder,
  },
  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    marginTop: 12,
  },
  action: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  actionLabelActive: {
    color: colors.brandPrimary,
  },
});
