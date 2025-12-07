/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import App from '@/App';

jest.mock('react-native/src/private/animated/NativeAnimatedHelper');

const mockAuthState: {
  user: { uid: string; displayName?: string; email?: string } | null;
  loading: boolean;
  signInWithEmail: jest.Mock;
  signUpWithEmail: jest.Mock;
  signOut: jest.Mock;
  signInWithGoogle?: jest.Mock;
} = {
  user: null,
  loading: false,
  signInWithEmail: jest.fn(),
  signUpWithEmail: jest.fn(),
  signOut: jest.fn(),
};

const mockProfileValue = {
  profile: null as unknown,
  loading: false,
  refetch: jest.fn(),
};

const mockCreateSession = jest.fn();

jest.mock('@/providers/AuthProvider', () => {
  const React = require('react');
  return {
    __esModule: true,
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
      <React.Fragment>{children}</React.Fragment>
    ),
    useAuth: () => mockAuthState,
  };
});

jest.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: () => mockProfileValue,
}));

jest.mock('@/lib/repositories/SessionRepository', () => ({
  __esModule: true,
  SessionRepository: jest.fn(() => ({
    create: (...args: unknown[]) => mockCreateSession(...args),
  })),
}));

jest.mock('@/screens/HomeScreen', () => {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  return {
    __esModule: true,
    HomeScreen: ({
      onOpenSession,
      onOpenProfile,
      onOpenNotifications,
    }: {
      onOpenSession: (session: { id: string; title: string }) => void;
      onOpenProfile?: (id: string) => void;
      onOpenNotifications?: () => void;
    }) => (
      <React.Fragment>
        <View>
          <Text>Home Screen</Text>
          <TouchableOpacity onPress={() => onOpenSession({ id: 'session-123', title: 'Feed' })}>
            <Text>Open Session</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onOpenProfile?.('user-42')}>
            <Text>Open Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onOpenNotifications}>
            <Text>Open Notifications</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    ),
  };
});

jest.mock('@/screens/ProfileScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    ProfileScreen: () => (
      <React.Fragment>
        <Text>Profile Screen</Text>
      </React.Fragment>
    ),
  };
});

jest.mock('@/screens/NotificationsScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    NotificationsScreen: () => (
      <React.Fragment>
        <Text>Notifications Screen</Text>
      </React.Fragment>
    ),
  };
});

jest.mock('@/screens/RecordScreen', () => {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  return {
    __esModule: true,
    RecordScreen: ({ onStartReview }: { onStartReview: (draft: unknown) => void }) => (
      <React.Fragment>
        <View>
          <Text>Record Screen</Text>
          <TouchableOpacity
            onPress={() =>
              onStartReview({
                title: 'Draft Title',
                activityId: 'build',
                durationMinutes: 25,
                visibility: 'everyone',
              })
            }
          >
            <Text>Begin Review</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    ),
  };
});

jest.mock('@/screens/ReviewScreen', () => {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  return {
    __esModule: true,
    ReviewScreen: ({
      draft,
      onSave,
      onBack,
    }: {
      draft: { title: string; activityId: string; durationMinutes: number };
      onSave: (draft: unknown) => void;
      onBack: () => void;
    }) => (
      <React.Fragment>
        <View>
          <Text>Review Screen</Text>
          <Text>{draft.title}</Text>
          <TouchableOpacity onPress={() => onSave(draft)}>
            <Text>Save Session</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onBack}>
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    ),
  };
});

jest.mock('@/screens/SessionDetailScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    SessionDetailScreen: ({ session }: { session: { title: string } }) => (
      <React.Fragment>
        <Text>{`Session Detail: ${session.title}`}</Text>
      </React.Fragment>
    ),
  };
});

describe('App integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthState.user = null;
    mockAuthState.loading = false;
    mockAuthState.signUpWithEmail.mockResolvedValue(undefined);
    mockProfileValue.profile = null;
    mockProfileValue.loading = false;
  });

  test('walks unauthenticated users through signup flow', async () => {
    // Confirms welcome → signup → email form triggers signUpWithEmail call.
    const { getByText, getByPlaceholderText } = render(<App />);

    fireEvent.press(getByText('Sign up free'));
    fireEvent.press(getByText('Sign Up With Email'));

    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'new@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'secret123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'secret123');
    fireEvent.press(getByText('Create account'));

    await waitFor(() =>
      expect(mockAuthState.signUpWithEmail).toHaveBeenCalledWith(
        'new@example.com',
        'secret123',
        '',
      ),
    );
  });

  test('navigates authed users across tabs and saves a session', async () => {
    // Ensures bottom nav toggles timer → review and saving shows detail screen.
    mockAuthState.user = { uid: 'user-1', displayName: 'Pat', email: 'pat@example.com' };
    mockProfileValue.profile = {
      id: 'user-1',
      name: 'Pat',
      handle: 'pat',
      followers: 0,
      following: 0,
      totalHours: 0,
      totalSessions: 0,
      streakDays: 0,
      isSelf: true,
    };
    mockCreateSession.mockResolvedValue({
      id: 'session-123',
      userId: 'user-1',
      title: 'Saved Session',
      description: 'desc',
      activityId: 'build',
      project: 'build',
      durationMinutes: 25,
      visibility: 'everyone',
      createdAt: new Date().toISOString(),
      media: [],
      supports: 0,
      comments: 0,
      shares: 0,
      supported: false,
      isOwner: true,
    });

    const { getByLabelText, getByText } = render(<App />);

    fireEvent.press(getByLabelText('Record'));
    fireEvent.press(getByText('Begin Review'));
    fireEvent.press(getByText('Save Session'));

    await waitFor(() => {
      expect(mockCreateSession).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-1', title: 'Draft Title' }),
      );
      expect(getByText('Session Detail: Saved Session')).toBeTruthy();
    });
  });
});
