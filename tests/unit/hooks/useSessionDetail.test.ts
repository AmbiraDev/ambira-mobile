import { renderHook, waitFor } from '@testing-library/react-native';

import { useSessionDetail } from '@/hooks/useSessionDetail';
import { sampleSession, sampleUser } from '../../fixtures/data';

const mockGetById = jest.fn();
const mockGetUser = jest.fn();

jest.mock('@/lib/repositories/SessionRepository', () => ({
  SessionRepository: jest.fn(() => ({
    getById: (...args: unknown[]) => mockGetById(...args),
  })),
}));

jest.mock('@/lib/repositories/UserRepository', () => ({
  UserRepository: jest.fn(() => ({
    getById: (...args: unknown[]) => mockGetUser(...args),
  })),
}));

describe('useSessionDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns empty state when no id is provided', async () => {
    // Ensures hook resets session/user when sessionId is undefined.
    const { result } = renderHook(() => useSessionDetail());

    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test('loads session and user profile for id', async () => {
    // Confirms hook fetches session then loads its user profile.
    mockGetById.mockResolvedValue(sampleSession);
    mockGetUser.mockResolvedValue(sampleUser);

    const { result } = renderHook(() => useSessionDetail('session-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.session?.id).toBe('session-1');
    expect(result.current.user?.id).toBe('user-1');
  });

  test('captures errors from repository calls', async () => {
    // Ensures error is set and loading stops when fetching fails.
    mockGetById.mockRejectedValue(new Error('not found'));

    const { result } = renderHook(() => useSessionDetail('missing'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('not found');
  });
});
