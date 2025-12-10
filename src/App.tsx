import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation, type BottomTabKey } from '@/components/BottomNavigation';
import { DEFAULT_ACTIVITIES } from '@/data/activities';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { SessionRepository } from '@/lib/repositories/SessionRepository';
import { EmailSignUpScreen } from '@/screens/EmailSignUpScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { LogInScreen } from '@/screens/LogInScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { RecordScreen } from '@/screens/RecordScreen';
import { ReviewScreen, type ReviewDraft } from '@/screens/ReviewScreen';
import { SessionDetailScreen } from '@/screens/SessionDetailScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { colors } from '@/theme/colors';
import type { Session, UserProfile, Visibility } from '@/types/models';

type AuthStage = 'welcome' | 'signup' | 'email' | 'login';

function AppContent(): React.JSX.Element {
  const { user, loading: authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle } =
    useAuth();
  const [authStage, setAuthStage] = React.useState<AuthStage>('welcome');
  const [activeTab, setActiveTab] = React.useState<BottomTabKey>('home');
  const [viewingSession, setViewingSession] = React.useState<Session | null>(null);
  const [profileUserId, setProfileUserId] = React.useState<string | null>(null);
  const [reviewDraft, setReviewDraft] = React.useState<ReviewDraft | null>(null);
  const [defaultVisibility] = React.useState<Visibility>('everyone');
  const [feedRefreshToken, setFeedRefreshToken] = React.useState<number>(0);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [authBusy, setAuthBusy] = React.useState<boolean>(false);

  const sessionRepo = React.useMemo(() => new SessionRepository(), []);

  const {
    profile: currentUserProfile,
    loading: currentProfileLoading,
    refetch: refetchCurrentProfile,
  } = useUserProfile(user?.uid);

  const currentProfile: UserProfile | null =
    currentUserProfile ||
    (user
      ? {
        id: user.uid,
        name: user.displayName ?? 'You',
        handle: user.email?.split('@')[0] ?? 'you',
        followers: 0,
        following: 0,
        totalHours: 0,
        totalSessions: 0,
        streakDays: 0,
        isSelf: true,
      }
      : null);

  const handleEmailLogin = async (email: string, password: string) => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleEmailSignUp = async (email: string, password: string, name?: string) => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signUpWithEmail(email, password, name);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign up');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!signInWithGoogle) {
      setAuthError('Google Sign-In is not configured.');
      return;
    }
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign in with Google');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSaveSession = async (partial: Partial<Session>) => {
    if (!user?.uid) return;
    try {
      const sessionData: Record<string, unknown> = {
        userId: user.uid,
        title: partial.title ?? 'Session',
        activityId: partial.activityId ?? DEFAULT_ACTIVITIES[0].id,
        durationMinutes: partial.durationMinutes ?? 25,
        visibility: partial.visibility ?? 'everyone',
        media: partial.media ?? [],
      };

      // Only add optional fields if they have values
      if (partial.description) sessionData.description = partial.description;
      if (partial.project) sessionData.project = partial.project;
      if (partial.feeling) sessionData.feeling = partial.feeling;
      if (partial.privateNotes) sessionData.privateNotes = partial.privateNotes;

      await sessionRepo.create(sessionData as Omit<Session, 'id'>);
      setReviewDraft(null);
      setActiveTab('home');
      setFeedRefreshToken(Date.now());
      await refetchCurrentProfile();
    } catch (error) {
      console.error('Failed to save session:', error);
      throw error; // Re-throw so ReviewScreen can show the error
    }
  };

  const authedBody = () => (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" backgroundColor={colors.card} />
      <View style={styles.content}>
        {viewingSession ? (
          <SessionDetailScreen
            session={viewingSession}
            onBack={() => setViewingSession(null)}
            onNavigateHome={() => {
              setViewingSession(null);
              setActiveTab('home');
            }}
          />
        ) : activeTab === 'home' ? (
          <HomeScreen
            currentUser={currentProfile}
            refreshToken={feedRefreshToken}
            onOpenSession={setViewingSession}
            onOpenProfile={(id) => {
              setProfileUserId(id);
              setActiveTab('profile');
            }}
            onOpenNotifications={() => setActiveTab('notifications')}
          />
        ) : activeTab === 'timer' ? (
          reviewDraft ? (
            <ReviewScreen
              draft={reviewDraft}
              onBack={() => setReviewDraft(null)}
              onDiscard={() => setReviewDraft(null)}
              onSave={handleSaveSession}
            />
          ) : (
            <RecordScreen
              defaultVisibility={defaultVisibility}
              onStartReview={(draft) => setReviewDraft(draft)}
            />
          )
        ) : activeTab === 'profile' ? (
          <ProfileScreen
            userId={profileUserId ?? user?.uid}
            currentUserId={user?.uid}
            onSelectSession={(session) => setViewingSession(session)}
          />
        ) : (
          <NotificationsScreen />
        )}
        <BottomNavigation
          active={activeTab}
          onChange={(next) => {
            setViewingSession(null);
            setReviewDraft(null);
            setActiveTab(next);
            if (next === 'profile') setProfileUserId(user?.uid ?? null);
          }}
        />
      </View>
    </SafeAreaView>
  );

  const unauthBody = () => (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" backgroundColor={colors.card} />
      {authStage === 'welcome' ? (
        <WelcomeScreen onSignUp={() => setAuthStage('signup')} onLogin={() => setAuthStage('login')} />
      ) : authStage === 'signup' ? (
        <SignUpScreen
          onLogin={() => setAuthStage('login')}
          onBack={() => setAuthStage('welcome')}
          onEmailSignUp={() => setAuthStage('email')}
          onGoogleSignUp={handleGoogleAuth}
          loading={authBusy}
          error={authError}
        />
      ) : authStage === 'email' ? (
        <EmailSignUpScreen
          onBack={() => setAuthStage('signup')}
          onSubmit={handleEmailSignUp}
          loading={authBusy}
          error={authError}
        />
      ) : (
        <LogInScreen
          onBack={() => setAuthStage('welcome')}
          onSubmit={handleEmailLogin}
          onGoogle={handleGoogleAuth}
          loading={authBusy}
          error={authError}
        />
      )}
    </SafeAreaView>
  );

  if (authLoading || currentProfileLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
          <ActivityIndicator color={colors.brandPrimary} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return <SafeAreaProvider>{user ? authedBody() : unauthBody()}</SafeAreaProvider>;
}

export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  content: {
    flex: 1,
    backgroundColor: colors.card,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
