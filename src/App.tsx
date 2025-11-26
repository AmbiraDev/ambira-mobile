import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
import { RecordScreen } from '@/screens/RecordScreen';
import { ReviewScreen, type ReviewDraft } from '@/screens/ReviewScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { colors } from '@/theme/colors';
import type { Session, UserProfile, Visibility } from '@/types/models';

type AuthStage = 'welcome' | 'signup' | 'email' | 'login';

export default function App(): React.JSX.Element {
  const [authStage, setAuthStage] = React.useState<AuthStage>('welcome');
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = React.useState<BottomTabKey>('home');
  const [sessions, setSessions] = React.useState<Session[]>(mockSessions);
  const [viewingSession, setViewingSession] = React.useState<Session | null>(null);
  const [profileUser, setProfileUser] = React.useState<UserProfile>(seedUser);
  const [reviewDraft, setReviewDraft] = React.useState<ReviewDraft | null>(null);
  const [defaultVisibility, setDefaultVisibility] = React.useState<Visibility>('everyone');

  const followingIds = React.useMemo(
    () => [
      seedUser.id,
      ...followingList.filter((person) => person.isFollowing).map((person) => person.id),
    ],
    [],
  );

  const handleAuthComplete = () => {
    setUser(seedUser);
    setActiveTab('home');
    setProfileUser(seedUser);
  };

  const handleSaveSession = (partial: Partial<Session>) => {
    const newSession: Session = {
      id: `sess-${Date.now()}`,
      userId: seedUser.id,
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
    setReviewDraft(null);
    if (partial.visibility) setDefaultVisibility(partial.visibility);
  };

  const openProfile = (userId: string) => {
    const target = getUserById(userId);
    setProfileUser(target ?? seedUser);
    setActiveTab('profile');
    setReviewDraft(null);
  };

  const openSession = (session: Session) => {
    setViewingSession(session);
  };

  const currentProfile = profileUser ?? seedUser;

  return (
    <SafeAreaProvider>
      {user ? (
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
                currentUser={seedUser}
                sessions={sessions}
                followingIds={followingIds}
                onOpenSession={openSession}
                onOpenProfile={openProfile}
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
                user={currentProfile}
                sessions={sessions}
                onSelectSession={openSession}
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
                if (next === 'profile') setProfileUser(seedUser);
              }}
            />
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar style="dark" backgroundColor={colors.card} />
          {authStage === 'welcome' ? (
            <WelcomeScreen onSignUp={() => setAuthStage('signup')} onLogin={() => setAuthStage('login')} />
          ) : authStage === 'signup' ? (
            <SignUpScreen
              onLogin={() => setAuthStage('login')}
              onBack={() => setAuthStage('welcome')}
              onEmailSignUp={() => setAuthStage('email')}
              onAuthComplete={handleAuthComplete}
            />
          ) : authStage === 'email' ? (
            <EmailSignUpScreen onBack={() => setAuthStage('signup')} onSubmit={handleAuthComplete} />
          ) : (
            <LogInScreen onBack={() => setAuthStage('welcome')} onAuthComplete={handleAuthComplete} />
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
