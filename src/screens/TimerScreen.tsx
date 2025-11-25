import React from 'react';
import {
  GestureResponderEvent,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { MobileHeader } from '@/components/MobileHeader';
import { mockActivities } from '@/data/mockData';
import type { Activity, Feeling, Session, Visibility } from '@/types/models';
import { colors } from '@/theme/colors';

type TimerScreenProps = {
  onBack?: () => void;
  onSaveSession?: (session: Partial<Session>) => void;
  defaultVisibility?: Visibility;
};

type TimerState = 'idle' | 'running' | 'paused';

const FEELINGS: { key: Feeling; label: string }[] = [
  { key: 'energized', label: 'Energized' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'tired', label: 'Tired' },
];

const VISIBILITY_LABELS: Record<Visibility, string> = {
  everyone: 'Everyone',
  followers: 'Followers',
  private: 'Private',
};

export function TimerScreen({
  onBack,
  onSaveSession,
  defaultVisibility = 'everyone',
}: TimerScreenProps): React.JSX.Element {
  const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(
    mockActivities[0],
  );
  const [feeling, setFeeling] = React.useState<Feeling>('energized');
  const [visibility, setVisibility] = React.useState<Visibility>(defaultVisibility);
  const [note, setNote] = React.useState('');
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [timerState, setTimerState] = React.useState<TimerState>('idle');
  const [elapsedMs, setElapsedMs] = React.useState<number>(0);
  const [showReview, setShowReview] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [reviewTitle, setReviewTitle] = React.useState<string>('Untitled session');
  const [reviewDescription, setReviewDescription] = React.useState<string>('');
  const [durationMinutes, setDurationMinutes] = React.useState<number>(30);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = React.useRef<number | null>(null);
  const sliderWidthRef = React.useRef<number>(1);

  const formattedTime = React.useMemo(() => {
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [elapsedMs]);

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const tick = () => {
    const now = Date.now();
    if (lastTickRef.current) {
      const delta = now - lastTickRef.current;
      setElapsedMs((prev) => prev + delta);
    }
    lastTickRef.current = now;
  };

  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(tick, 1000);
  };

  const startTimer = () => {
    if (!selectedActivity) {
      setError('Choose an activity to start your timer.');
      return;
    }
    setError(null);
    setReviewTitle(selectedActivity.name);
    lastTickRef.current = Date.now();
    setTimerState('running');
    startInterval();
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    lastTickRef.current = null;
    setTimerState('paused');
  };

  const resumeTimer = () => {
    if (!selectedActivity) {
      setError('Choose an activity to resume.');
      return;
    }
    setError(null);
    setTimerState('running');
    lastTickRef.current = Date.now();
    startInterval();
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    lastTickRef.current = null;
    setTimerState('paused');
    setShowReview(true);
    const minutesFromTimer = Math.max(5, Math.round(elapsedMs / 60000));
    setDurationMinutes(minutesFromTimer);
  };

  const togglePhoto = () => {
    if (photos.length > 0) {
      setPhotos([]);
      return;
    }
    setPhotos([
      'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=600&q=60',
    ]);
  };

  const handleSliderPress = (event: GestureResponderEvent) => {
    const width = sliderWidthRef.current || 1;
    const percent = Math.min(Math.max(event.nativeEvent.locationX / width, 0), 1);
    const value = Math.round(10 + percent * (180 - 10));
    setDurationMinutes(value);
  };

  const handleSave = () => {
    onSaveSession?.({
      title: reviewTitle || selectedActivity?.name || 'Session',
      description: reviewDescription,
      activityId: selectedActivity?.id ?? mockActivities[0].id,
      durationMinutes,
      visibility,
      feeling,
      media: photos,
      privateNotes: note,
      createdAt: new Date().toISOString(),
    });
    setShowReview(false);
    setElapsedMs(0);
    setTimerState('idle');
    setNote('');
    setPhotos([]);
    setReviewDescription('');
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

  const renderFeelingSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>How did it feel?</Text>
      <View style={styles.pillRow}>
        {FEELINGS.map((option) => {
          const active = option.key === feeling;
          return (
            <TouchableOpacity
              key={option.key}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => setFeeling(option.key)}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.page}>
      <MobileHeader title="Timer" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.timerCard}>
            <Text style={styles.timerLabel}>Session time</Text>
            <Text style={styles.timerValue}>{formattedTime}</Text>
            <Text style={styles.timerHint}>
              Pick an activity, start the timer, and finish to save your session.
            </Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Activity</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pillRow}
              >
                {mockActivities.map((activity) => {
                  const active = selectedActivity?.id === activity.id;
                  return (
                    <TouchableOpacity
                      key={activity.id}
                      style={[styles.pill, active && styles.pillActive]}
                      onPress={() => {
                        setSelectedActivity(activity);
                        setError(null);
                        setReviewTitle(activity.name);
                      }}
                    >
                      <Text style={[styles.pillText, active && styles.pillTextActive]}>
                        {activity.emoji} {activity.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {renderFeelingSelector()}
            {renderVisibilitySelector()}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Private notes</Text>
              <TextInput
                style={styles.noteInput}
                multiline
                placeholder="Anything to remember for later?"
                placeholderTextColor={colors.placeholder}
                value={note}
                onChangeText={setNote}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Photos (optional)</Text>
              <View style={styles.pillRow}>
                <TouchableOpacity style={[styles.pill, styles.outlinePill]} onPress={togglePhoto}>
                  <Text style={styles.pillText}>
                    {photos.length ? 'Remove photo' : 'Add sample photo'}
                  </Text>
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

            <View style={styles.actions}>
              {timerState === 'idle' ? (
                <TouchableOpacity style={styles.primaryButton} onPress={startTimer}>
                  <Text style={styles.primaryButtonLabel}>Start</Text>
                </TouchableOpacity>
              ) : null}
              {timerState === 'running' ? (
                <TouchableOpacity style={styles.secondaryButton} onPress={pauseTimer}>
                  <Text style={styles.secondaryButtonLabel}>Pause</Text>
                </TouchableOpacity>
              ) : null}
              {timerState === 'paused' && elapsedMs > 0 ? (
                <TouchableOpacity style={styles.secondaryButton} onPress={resumeTimer}>
                  <Text style={styles.secondaryButtonLabel}>Resume</Text>
                </TouchableOpacity>
              ) : null}
              {elapsedMs > 0 ? (
                <TouchableOpacity style={styles.finishButton} onPress={stopTimer}>
                  <Text style={styles.finishButtonLabel}>Finish</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>

      <Modal visible={showReview} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Review session</Text>
            <Text style={styles.modalHint}>Add a title, description, and confirm visibility.</Text>

            <TextInput
              style={styles.input}
              placeholder="Session title"
              placeholderTextColor={colors.placeholder}
              value={reviewTitle}
              onChangeText={setReviewTitle}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              placeholderTextColor={colors.placeholder}
              value={reviewDescription}
              onChangeText={setReviewDescription}
              multiline
            />

            {renderVisibilitySelector()}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Duration</Text>
              <Pressable
                style={styles.slider}
                onPress={handleSliderPress}
                onLayout={(event) => {
                  sliderWidthRef.current = event.nativeEvent.layout.width;
                }}
              >
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${((durationMinutes - 10) / (180 - 10)) * 100}%` },
                  ]}
                />
                <View
                  style={[
                    styles.sliderThumb,
                    { left: `${((durationMinutes - 10) / (180 - 10)) * 100}%` },
                  ]}
                />
              </Pressable>
              <Text style={styles.sliderValue}>{durationMinutes} minutes</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                <Text style={styles.primaryButtonLabel}>Save session</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.textButton} onPress={() => setShowReview(false)}>
                <Text style={styles.textButtonLabel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  timerCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    gap: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  timerLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  timerValue: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  timerHint: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'DM Sans',
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
  outlinePill: {
    backgroundColor: colors.white,
    borderColor: colors.cardBorder,
  },
  noteInput: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: 'DM Sans',
    color: colors.textDark,
    backgroundColor: colors.white,
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
  actions: {
    gap: 10,
    marginTop: 4,
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
  secondaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonLabel: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  finishButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButtonLabel: {
    color: colors.brandOnPrimary,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'DM Sans',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  modalHint: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'DM Sans',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.textDark,
    backgroundColor: colors.white,
    fontFamily: 'DM Sans',
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  slider: {
    height: 18,
    backgroundColor: colors.cardBorder,
    borderRadius: 10,
    justifyContent: 'center',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.brandPrimary,
    borderRadius: 10,
  },
  sliderThumb: {
    position: 'absolute',
    top: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brandPrimary,
    borderWidth: 2,
    borderColor: colors.card,
    marginLeft: -12,
  },
  sliderValue: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textDark,
    fontFamily: 'DM Sans',
  },
  modalActions: {
    gap: 8,
  },
  textButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  textButtonLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  bottomSpace: {
    height: 96,
  },
});
