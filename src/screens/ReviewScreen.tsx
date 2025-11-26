import React from 'react';
import { BookOpen, Dumbbell, Hammer, Palette } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { MobileHeader } from '@/components/MobileHeader';
import { mockActivities } from '@/data/mockData';
import type { Activity, Session, Visibility } from '@/types/models';
import { colors } from '@/theme/colors';

export type ReviewDraft = {
  title: string;
  description?: string;
  activityId: Activity['id'];
  durationMinutes: number;
  visibility: Visibility;
  media: string[];
};

type ReviewScreenProps = {
  draft: ReviewDraft;
  onBack?: () => void;
  onDiscard?: () => void;
  onSave: (session: Partial<Session>) => void;
};

const VISIBILITY_LABELS: Record<Visibility, string> = {
  everyone: 'Everyone',
  followers: 'Followers',
  private: 'Private',
};

const ACTIVITY_ICONS: Record<Activity['id'], LucideIcon> = {
  study: BookOpen,
  build: Hammer,
  design: Palette,
  fitness: Dumbbell,
};

export function ReviewScreen({
  draft,
  onBack,
  onDiscard,
  onSave,
}: ReviewScreenProps): React.JSX.Element {
  const clampDuration = (value: number) => Math.min(180, Math.max(10, value));
  const [title, setTitle] = React.useState(draft.title || 'Untitled session');
  const [description, setDescription] = React.useState(draft.description ?? '');
  const [activityId, setActivityId] = React.useState<Activity['id']>(draft.activityId);
  const [photos, setPhotos] = React.useState<string[]>(draft.media ?? []);
  const durationMinutes = React.useMemo(
    () => clampDuration(draft.durationMinutes ?? 30),
    [draft.durationMinutes],
  );
  const [visibility, setVisibility] = React.useState<Visibility>(draft.visibility);

  const togglePhoto = () => {
    if (photos.length > 0) {
      setPhotos([]);
      return;
    }
    setPhotos([
      'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=600&q=60',
    ]);
  };

  const handleSavePress = () => {
    onSave({
      title: title || 'Session',
      description,
      activityId,
      durationMinutes,
      visibility,
      media: photos,
      createdAt: new Date().toISOString(),
    });
  };

  const renderVisibilitySelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Visibility</Text>
      <View style={styles.pillRow}>
        {(['everyone', 'followers', 'private'] as Visibility[]).map((option) => {
          const active = option === visibility;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => setVisibility(option)}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {VISIBILITY_LABELS[option]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.page}>
      <MobileHeader title="Review session" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Session title"
              placeholderTextColor={colors.placeholder}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="What did you work on?"
              placeholderTextColor={colors.placeholder}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Activity</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillRow}
            >
              {mockActivities.map((activity) => {
                const active = activityId === activity.id;
                const ActivityIcon = ACTIVITY_ICONS[activity.id] ?? BookOpen;
                return (
                  <TouchableOpacity
                    key={activity.id}
                    style={[styles.pill, styles.activityPill, active && styles.pillActive]}
                    onPress={() => setActivityId(activity.id)}
                  >
                    <ActivityIcon
                      size={16}
                      color={active ? colors.brandPrimary : colors.textMuted}
                      strokeWidth={2.2}
                    />
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>
                      {activity.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Photos</Text>
            <View style={styles.pillRow}>
              <TouchableOpacity style={[styles.pill, styles.outlinePill]} onPress={togglePhoto}>
                <Text style={styles.pillText}>{photos.length ? 'Remove photo' : 'Add photo'}</Text>
              </TouchableOpacity>
            </View>
            {photos.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.photoList}
              >
                {photos.map((uri) => (
                  <Image key={uri} source={{ uri }} style={styles.photo} />
                ))}
              </ScrollView>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Duration</Text>
            <Text style={styles.durationValue}>{durationMinutes} minutes</Text>
          </View>

          {renderVisibilitySelector()}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.destructiveButton} onPress={onDiscard}>
              <Text style={styles.destructiveButtonLabel}>Discard Session</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSavePress}>
              <Text style={styles.primaryButtonLabel}>Save Session</Text>
            </TouchableOpacity>
          </View>
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
    gap: 18,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: 400,
    color: colors.textDark,
    backgroundColor: colors.white,
    fontFamily: 'DM Sans',
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 42,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  outlinePill: {
    backgroundColor: colors.white,
    borderColor: colors.cardBorder,
  },
  pillActive: {
    backgroundColor: colors.pill,
    borderColor: colors.brandPrimary,
  },
  pillText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  pillTextActive: {
    color: colors.brandPrimary,
  },
  activityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: colors.cardBorder,
  },
  photoList: {
    marginTop: 10,
  },
  durationValue: {
    fontSize: 13,
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  actions: {
    gap: 10,
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonLabel: {
    color: colors.brandOnPrimary,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'DM Sans',
  },
  destructiveButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveButtonLabel: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  bottomSpace: {
    height: 96,
  },
});
