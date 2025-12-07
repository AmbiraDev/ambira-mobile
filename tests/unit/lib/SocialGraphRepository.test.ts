import { SocialGraphRepository } from '@/lib/repositories/SocialGraphRepository';

const mockGetDocs = jest.fn();

jest.mock('@/lib/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: (...args: string[]) => ({ key: args.join('/') }),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  query: (...args: unknown[]) => args,
  where: (...args: unknown[]) => ({ type: 'where', args }),
}));

describe('SocialGraphRepository', () => {
  const repo = new SocialGraphRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns primary graph ids when present', async () => {
    // Ensures primary socialGraph collection is used when data exists.
    mockGetDocs.mockResolvedValueOnce({ empty: false, docs: [{ id: 'u1' }, { id: 'u2' }] });

    const ids = await repo.getFollowingIds('viewer');

    expect(ids).toEqual(['u1', 'u2']);
    expect(mockGetDocs).toHaveBeenCalledTimes(1);
  });

  test('falls back to follows query when others are empty', async () => {
    // Confirms legacy and primary paths fall through to follows collection.
    mockGetDocs
      .mockResolvedValueOnce({ empty: true, docs: [] })
      .mockResolvedValueOnce({ empty: true, docs: [] })
      .mockResolvedValueOnce({
        empty: false,
        docs: [
          { data: () => ({ followingId: 'a' }) },
          { data: () => ({ followingId: 'b' }) },
          { data: () => ({}) },
        ],
      });

    const ids = await repo.getFollowingIds('viewer');

    expect(ids).toEqual(['a', 'b']);
    expect(mockGetDocs).toHaveBeenCalledTimes(3);
  });
});
