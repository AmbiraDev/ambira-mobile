import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import App from '@/App';
import { sampleSession, sampleUser } from '../fixtures/data';

const mockUseAuth = jest.fn();
const mockUseUserProfile = jest.fn();
const mockCreateSession = jest.fn();

jest.mock('@/providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: (...args: unknown[]) => mockUseUserProfile(...args),
}));

jest.mock('@/lib/repositories/SessionRepository', () => ({
  SessionRepository: jest.fn(() => ({
    create: (...args: unknown[]) => mockCreateSession(...args),
  })),
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders unauthenticated flow by default', () => {
    // Ensures welcome screen is shown when no user is signed in.
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    mockUseUserProfile.mockReturnValue({
      profile: null,
      loading: false,
      refetch: jest.fn(),
      sessions: [],
    });

    const { getByText } = render(<App />);

    expect(getByText('Sign up free')).toBeTruthy();
  });

  test('shows authenticated home when user exists', async () => {
    // Confirms home experience renders when auth and profile are ready.
    mockUseAuth.mockReturnValue({ user: { uid: 'viewer', email: 'me@example.com' }, loading: false });
    mockUseUserProfile.mockReturnValue({
      profile: sampleUser,
      loading: false,
      refetch: jest.fn(),
      sessions: [],
    });
    mockCreateSession.mockResolvedValue(sampleSession);

    const { getByText } = render(<App />);

    await waitFor(() => expect(getByText('Home')).toBeTruthy());
  });
});
