import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { MobileHeader } from '@/components/MobileHeader';
import { SessionCard } from '@/components/SessionCard';
import { SessionSkeleton } from '@/components/Skeletons';
import { getActivityById, getUserById } from '@/data/mockData';
import type { Session } from '@/types/models';
import { colors } from '@/theme/colors';

type SessionDetailScreenProps = {
  session?: Session | null;
  loading?: boolean;
  onBack: () => void;
  onNavigateHome?: () => void;
};

export function SessionDetailScreen({
  session,
  loading = false,
  onBack,
  onNavigateHome,
}: SessionDetailScreenProps): React.JSX.Element {
  const [localSession, setLocalSession] = React.useState<Session | null>(session ?? null);
  const [comment, setComment] = React.useState('');

  React.useEffect(() => {
    setLocalSession(session ?? null);
  }, [session]);

  const handleSupportToggle = (_id: string, supported: boolean) => {
    setLocalSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        supported,
        supports: Math.max(0, prev.supports + (supported ? 1 : -1)),
      };
    });
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    setLocalSession((prev) => (prev ? { ...prev, comments: prev.comments + 1 } : prev));
    setComment('');
  };

  if (loading) {
    return (
      <View style={styles.page}>
        <MobileHeader title="Session" onBack={onBack} />
        <View style={styles.container}>
          <SessionSkeleton />
        </View>
      </View>
    );
  }

  if (!localSession) {
    return (
      <View style={styles.page}>
        <MobileHeader title="Session" onBack={onBack} />
        <View style={[styles.container, styles.empty]}>
          <Text style={styles.emptyTitle}>Session not found</Text>
          <Text style={styles.emptyCopy}>
            This session may have been deleted or is no longer visible.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={onNavigateHome ?? onBack}>
            <Text style={styles.primaryButtonLabel}>Back to feed</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <MobileHeader title="Session" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <SessionCard
            session={localSession}
            user={getUserById(localSession.userId)}
            activity={getActivityById(localSession.activityId)}
            onSupportToggle={handleSupportToggle}
            onCommentPress={() => {}}
          />

          <View style={styles.commentBlock}>
            <Text style={styles.sectionLabel}>Add a comment</Text>
            <TextInput
              style={styles.input}
              placeholder="Share feedback or encouragement"
              placeholderTextColor={colors.placeholder}
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.secondaryButton} onPress={handleComment}>
              <Text style={styles.secondaryButtonLabel}>Post comment</Text>
            </TouchableOpacity>
          </View>

          {localSession.isOwner ? (
            <View style={styles.ownerActions}>
              <TouchableOpacity style={styles.outlineButton}>
                <Text style={styles.outlineLabel}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineButton}>
                <Text style={styles.outlineLabel}>Delete</Text>
              </TouchableOpacity>
            </View>
          ) : null}
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  container: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingTop: 12,
    gap: 14,
  },
  commentBlock: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 12,
    gap: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  sectionLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.textDark,
    backgroundColor: colors.white,
    fontFamily: 'DM Sans',
  },
  secondaryButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  ownerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  outlineLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  emptyCopy: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },
  primaryButton: {
    marginTop: 4,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonLabel: {
    color: colors.brandOnPrimary,
    fontWeight: '800',
    fontSize: 15,
    fontFamily: 'DM Sans',
  },
  bottomSpace: {
    height: 96,
  },
});
