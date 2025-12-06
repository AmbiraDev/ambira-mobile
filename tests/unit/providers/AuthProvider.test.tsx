import React from 'react';
import { act, renderHook } from '@testing-library/react-native';

import { AuthProvider, useAuth } from '@/providers/AuthProvider';

const mockSignInWithEmailAndPassword = jest.fn();
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockUpdateProfile = jest.fn();
const mockSignOut = jest.fn();
const mockOnAuthStateChanged = jest.fn();

jest.mock('@/lib/firebase', () => ({
  auth: {} as unknown,
  isFirebaseInitialized: true,
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignInWithEmailAndPassword(...args),
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUserWithEmailAndPassword(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  GoogleAuthProvider: { credential: jest.fn(() => ({})) },
  signInWithCredential: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthStateChanged.mockImplementation((_auth, cb: (user: unknown) => void) => {
      cb(null);
      return jest.fn();
    });
  });

  test('signInWithEmail trims email before passing to Firebase', async () => {
    // Ensures signInWithEmailAndPassword receives a trimmed email string.
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signInWithEmail('  user@example.com  ', 'secret');
    });

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'user@example.com', 'secret');
  });

  test('signUpWithEmail updates display name when provided', async () => {
    // Confirms signUp flow updates profile with displayName after account creation.
    mockCreateUserWithEmailAndPassword.mockResolvedValue({ user: {} });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signUpWithEmail('new@example.com', 'pw', 'Pat');
    });

    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalled();
    expect(mockUpdateProfile).toHaveBeenCalledWith({}, { displayName: 'Pat' });
  });

  test('signOut proxies to Firebase signOut', async () => {
    // Ensures signOut calls firebase signOut helper.
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  test('stops loading after auth state subscription fires', () => {
    // Confirms loading toggles to false once onAuthStateChanged callback runs.
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(false);
  });
});
