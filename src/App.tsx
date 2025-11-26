import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Auth provider & hook (you implemented these)
import { AuthProvider, useAuth } from '@/firebase/AuthContext';

import { BottomNavigation, type BottomTabKey } from '@/components/BottomNavigation';
import {
  currentUser as seedUser,
  followingList,
  getUserById,
  mockActivities,
  mockSessions,
} from '@/data/mockData';
import { HomeScreen } from '@/screens/HomeScreen';
import { LogInScreen } from '@/screens/LogInScreen';
import { EmailSignUpScreen } from '@/screens/EmailSignUpScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { SessionDetailScreen } from '@/screens/SessionDetailScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { TimerScreen } from '@/screens/TimerScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { colors } from '@/theme/colors';
import type { Session, UserProfile } from '@/types/models';

type AuthStage = 'welcome' | 'signup' | 'email' | 'login';

// Top-level App: provides the AuthProvider to the rest of the tree.
export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

// MainApp: the app UI that consumes auth state via `useAuth()`.
function MainApp(): React.JSX.Element {
  // Get the firebase auth user and loading state from your AuthContext
  const { user: authUser, loading } = useAuth();

  // Local UI state kept for navigation/session behavior
  const [authStage, setAuthStage] = React.useState<AuthStage>('welcome');
  const [activeTab, setActiveTab] = React.useState<BottomTabKey>('home');
  const [sessions, setSessions] = React.useState<Session[]>(mockSessions);
  const [viewingSession, setViewingSession] = React.useState<Session | null>(null);
  const [profileUser, setProfileUser] = React.useState<UserProfile>(seedUser);

  // Build following IDs list (keeps existing mock-following data)
  const followingIds = React.useMemo(
    () => [
      // include the currently signed in user's id if available
      authUser?.uid ?? seedUser.id,
      ...followingList.filter((person) => person.isFollowing).map((person) => person.id),
    ],
    [authUser],
  );

  // Map the firebase auth user to your app's `UserProfile` shape.
  // This is minimal — for production you should read the full profile from Firestore.
  const currentUserProfile: UserProfile | null = React.useMemo(() => {
    if (!authUser) return null;
    return {
      ...seedUser,
      id: authUser.uid,
      // map firebase displayName -> our `name` field
      name: authUser.displayName ?? seedUser.name,
    };
  }, [authUser]);

  // Create a new session and attach it to the current (authenticated) user
  const handleSaveSession = (partial: Partial<Session>) => {
    const newSession: Session = {
      id: `sess-${Date.now()}`,
      userId: currentUserProfile?.id ?? seedUser.id,
      title: partial.title ?? 'Session',
      description: partial.description,
      activityId: partial.activityId ?? mockActivities[0].id,
      project: partial.project ?? 'Personal',
      durationMinutes: partial.durationMinutes ?? 25,
      feeling: partial.feeling,
      visibility: partial.visibility ?? 'everyone',
      createdAt: partial.createdAt ?? new Date().toISOString(),
      media: partial.media,
      supports: 0,
      comments: 0,
      shares: 0,
      supported: false,
      isOwner: true,
      privateNotes: partial.privateNotes,
    };
    setSessions((prev) => [newSession, ...prev]);
    setViewingSession(newSession);
    setActiveTab('home');
  };

  const openProfile = (userId: string) => {
    const target = getUserById(userId);
    setProfileUser(target ?? seedUser);
    setActiveTab('profile');
  };

  const openSession = (session: Session) => {
    setViewingSession(session);
  };

  const currentProfile = profileUser ?? seedUser;

  // Show a simple loading placeholder while AuthContext restores the user
  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar style="dark" backgroundColor={colors.card} />
          <View style={styles.content}>
            <Text>Loading authentication…</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Render authenticated or unauthenticated flows based on authUser
  return (
    <SafeAreaProvider>
      {authUser ? (
        // Authenticated UI
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
                currentUser={currentUserProfile ?? seedUser}
                sessions={sessions}
                followingIds={followingIds}
                onOpenSession={openSession}
                onOpenProfile={openProfile}
                onOpenNotifications={() => setActiveTab('notifications')}
              />
            ) : activeTab === 'timer' ? (
              <TimerScreen onSaveSession={handleSaveSession} />
            ) : activeTab === 'profile' ? (
              <ProfileScreen user={currentProfile} sessions={sessions} onSelectSession={openSession} />
            ) : (
              <NotificationsScreen />
            )}
            <BottomNavigation
              active={activeTab}
              onChange={(next) => {
                setViewingSession(null);
                setActiveTab(next);
                if (next === 'profile') setProfileUser(seedUser);
              }}
            />
          </View>
        </SafeAreaView>
      ) : (
        // Unauthenticated UI: keep the existing auth screens flow
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar style="dark" backgroundColor={colors.card} />
          {authStage === 'welcome' ? (
            <WelcomeScreen onSignUp={() => setAuthStage('signup')} onLogin={() => setAuthStage('login')} />
          ) : authStage === 'signup' ? (
            <SignUpScreen
              onLogin={() => setAuthStage('login')}
              onBack={() => setAuthStage('welcome')}
              onEmailSignUp={() => setAuthStage('email')}
              // Auth is handled by AuthContext; screens may still accept this prop
              onAuthComplete={() => {}}
            />
          ) : authStage === 'email' ? (
            <EmailSignUpScreen onBack={() => setAuthStage('signup')} onSubmit={() => {}} />
          ) : (
            <LogInScreen onBack={() => setAuthStage('welcome')} onAuthComplete={() => {}} />
          )}
        </SafeAreaView>
      )}
    </SafeAreaProvider>
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
});
