import { renderHook, waitFor } from '@testing-library/react-native';

import { useFeed } from '@/hooks/useFeed';
import { sampleSession } from '../../fixtures/data';

const mockUseAuth = jest.fn();
const mockGetFeed = jest.fn();
const mockGetByIds = jest.fn();
const mockGetFollowingIds = jest.fn();

jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/lib/repositories/SessionRepository', () => ({
  SessionRepository: jest.fn(() => ({
    getFeed: (...args: unknown[]) => mockGetFeed(...args),
  })),
}));

jest.mock('@/lib/repositories/UserRepository', () => ({
  UserRepository: jest.fn(() => ({
    getByIds: (...args: unknown[]) => mockGetByIds(...args),
  })),
}));

jest.mock('@/lib/repositories/SocialGraphRepository', () => ({
  SocialGraphRepository: jest.fn(() => ({
    getFollowingIds: (...args: unknown[]) => mockGetFollowingIds(...args),
  })),
}));

describe('useFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns empty state when user is missing', async () => {
    // Ensures unauthenticated usage yields empty data and no loading.
    mockUseAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useFeed('all'));

    expect(result.current.data).toEqual([]);
    expect(result.current.usersById).toEqual({});
    expect(result.current.loading).toBe(false);
  });

  test('fetches following feed and injects viewer fallback', async () => {
    // Verifies feed loads sessions, resolves users, and adds viewer profile if absent.
    mockUseAuth.mockReturnValue({ user: { uid: 'viewer', email: 'me@example.com' } });
    mockGetFollowingIds.mockResolvedValue(['friend']);
    mockGetFeed.mockResolvedValue([sampleSession]);
    mockGetByIds.mockResolvedValue({ [sampleSession.userId]: { id: 'user-1', handle: 'pat' } });

    const { result } = renderHook(() => useFeed('following'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetFollowingIds).toHaveBeenCalledWith('viewer');
    expect(result.current.data).toHaveLength(1);
    expect(result.current.usersById.viewer).toMatchObject({ id: 'viewer', handle: 'me' });
  });

  test('surfaces errors when repository calls fail', async () => {
    // Confirms hook sets error message and stops loading when fetch fails.
    mockUseAuth.mockReturnValue({ user: { uid: 'viewer' } });
    mockGetFeed.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useFeed('all'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('boom');
  });
});
