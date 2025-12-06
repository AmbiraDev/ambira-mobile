import { UserRepository } from '@/lib/repositories/UserRepository';

const mockGetDoc = jest.fn();
const mockGetDocs = jest.fn();

jest.mock('@/lib/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => args,
  doc: (...args: unknown[]) => ({ id: args[1], data: () => ({}) }),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  query: (...args: unknown[]) => args,
  where: (...args: unknown[]) => ({ type: 'where', args }),
}));

describe('UserRepository', () => {
  const repo = new UserRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('maps profile with derived handle and totals', async () => {
    // Ensures mapping derives handle from email and computes totalHours from seconds.
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      id: 'u1',
      data: () => ({
        email: 'user@example.com',
        totalSeconds: 7200,
        totalSessions: 3,
        followerCount: 1,
      }),
    });

    const profile = await repo.getById('u1', 'u1');

    expect(profile).toMatchObject({
      id: 'u1',
      handle: 'user',
      totalHours: 2,
      totalSessions: 3,
      followers: 1,
      isSelf: true,
    });
  });

  test('chunks getByIds into batches of ten', async () => {
    // Confirms Firestore queries are chunked when loading more than ten ids.
    mockGetDocs.mockResolvedValue({ docs: [] });

    await repo.getByIds(Array.from({ length: 23 }, (_, i) => `user-${i}`), 'viewer');

    expect(mockGetDocs).toHaveBeenCalledTimes(3);
  });
});
