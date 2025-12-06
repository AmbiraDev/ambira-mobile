import React from 'react';
import { BookOpen, Dumbbell, Hammer, Palette } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MobileHeader } from '@/components/MobileHeader';
import { DEFAULT_ACTIVITIES } from '@/data/activities';
import type { Activity, Visibility } from '@/types/models';
import type { ReviewDraft } from '@/screens/ReviewScreen';
import { colors } from '@/theme/colors';

type RecordScreenProps = {
  onBack?: () => void;
  onStartReview?: (draft: ReviewDraft) => void;
  defaultVisibility?: Visibility;
};

type TimerState = 'idle' | 'running' | 'paused';

const ACTIVITY_ICONS: Record<Activity['id'], LucideIcon> = {
  study: BookOpen,
  build: Hammer,
  design: Palette,
  fitness: Dumbbell,
};

export function RecordScreen({
  onBack,
  onStartReview,
  defaultVisibility = 'everyone',
}: RecordScreenProps): React.JSX.Element {
  const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(
    DEFAULT_ACTIVITIES[0],
  );
  const [timerState, setTimerState] = React.useState<TimerState>('idle');
  const [elapsedMs, setElapsedMs] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = React.useRef<number | null>(null);

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

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    lastTickRef.current = null;
    setElapsedMs(0);
    setTimerState('idle');
  };

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

  const discardTimer = () => {
    setError(null);
    resetTimer();
  };

  const finishTimer = () => {
    if (!selectedActivity) {
      setError('Choose an activity to finish.');
      return;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    lastTickRef.current = null;
    const minutesFromTimer = Math.max(10, Math.round(elapsedMs / 60000));
    const draft: ReviewDraft = {
      title: selectedActivity.name,
      activityId: selectedActivity.id,
      durationMinutes: minutesFromTimer,
      visibility: defaultVisibility,
      media: [],
      description: '',
    };
    onStartReview?.(draft);
    resetTimer();
  };

  return (
    <View style={styles.page}>
      <MobileHeader title="Record" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View style={styles.container}>
          <View style={styles.timeBlock}>
            <Text style={styles.timerLabel}>Session time</Text>
            <Text style={styles.timerValue}>{formattedTime}</Text>
            <Text style={styles.timerHint}>Tap start to begin recording your session.</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Activity</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillRow}
            >
              {DEFAULT_ACTIVITIES.map((activity) => {
                const active = selectedActivity?.id === activity.id;
                const ActivityIcon = ACTIVITY_ICONS[activity.id] ?? BookOpen;
                return (
                  <TouchableOpacity
                    key={activity.id}
                    style={[styles.pill, styles.activityPill, active && styles.pillActive]}
                    onPress={() => {
                      setSelectedActivity(activity);
                      setError(null);
                    }}
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

          <View style={styles.actions}>
            {timerState === 'idle' ? (
              <TouchableOpacity style={styles.resumeButton} onPress={startTimer}>
                <Text style={styles.resumeButtonLabel}>Start</Text>
              </TouchableOpacity>
            ) : null}
            {timerState === 'running' ? (
              <TouchableOpacity style={styles.resumeButton} onPress={pauseTimer}>
                <Text style={styles.resumeButtonLabel}>Pause</Text>
              </TouchableOpacity>
            ) : null}
            {timerState === 'paused' && elapsedMs > 0 ? (
              <>
                <TouchableOpacity style={styles.resumeButton} onPress={resumeTimer}>
                  <Text style={styles.resumeButtonLabel}>Resume</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resumeButton} onPress={finishTimer}>
                  <Text style={styles.resumeButtonLabel}>Finish</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.destructiveButton} onPress={discardTimer}>
                  <Text style={styles.destructiveButtonLabel}>Discard</Text>
                </TouchableOpacity>
              </>
            ) : null}
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
  timeBlock: {
    gap: 6,
  },
  timerLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  timerValue: {
    fontSize: 72,
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
  activityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  actions: {
    gap: 10,
    marginTop: 4,
  },
  resumeButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeButtonLabel: {
    color: colors.brandOnPrimary,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'DM Sans',
  },
  destructiveButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveButtonLabel: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'DM Sans',
  },
  bottomSpace: {
    height: 96,
  },
});
