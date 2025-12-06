import { renderHook, waitFor } from '@testing-library/react-native';

import { useUserProfile } from '@/hooks/useUserProfile';
import { sampleSession, sampleUser } from '../../fixtures/data';

const mockUseAuth = jest.fn();
const mockGetById = jest.fn();
const mockGetByUserId = jest.fn();

jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/lib/repositories/UserRepository', () => ({
  UserRepository: jest.fn(() => ({
    getById: (...args: unknown[]) => mockGetById(...args),
  })),
}));

jest.mock('@/lib/repositories/SessionRepository', () => ({
  SessionRepository: jest.fn(() => ({
    getByUserId: (...args: unknown[]) => mockGetByUserId(...args),
  })),
}));

describe('useUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('short-circuits when no userId is provided', async () => {
    // Ensures hook returns empty state immediately without fetching.
    mockUseAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.profile).toBeNull();
    expect(result.current.sessions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  test('merges totals from sessions when profile lacks them', async () => {
    // Confirms totalHours and totalSessions are computed from sessions when missing on profile.
    mockUseAuth.mockReturnValue({ user: { uid: 'viewer' } });
    mockGetById.mockResolvedValue({ ...sampleUser, totalHours: 0, totalSessions: 0 });
    mockGetByUserId.mockResolvedValue([
      { ...sampleSession, durationMinutes: 60 },
      { ...sampleSession, id: 'session-2', durationMinutes: 30 },
    ]);

    const { result } = renderHook(() => useUserProfile('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.profile?.totalHours).toBe(1.5);
    expect(result.current.profile?.totalSessions).toBe(2);
    expect(result.current.sessions).toHaveLength(2);
  });

  test('returns fallback profile when user is missing', async () => {
    // Ensures hook creates placeholder profile when repository returns null.
    mockUseAuth.mockReturnValue({ user: { uid: 'viewer' } });
    mockGetById.mockResolvedValue(null);
    mockGetByUserId.mockResolvedValue([sampleSession]);

    const { result } = renderHook(() => useUserProfile('ghost'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.profile?.id).toBe('ghost');
    expect(result.current.profile?.name).toBe('Unknown user');
  });
});
