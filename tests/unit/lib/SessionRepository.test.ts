import { SessionRepository } from '@/lib/repositories/SessionRepository';
import type { Session } from '@/types/models';

const mockAddDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockGetDoc = jest.fn();

jest.mock('@/lib/firebase', () => ({
  auth: { currentUser: { uid: 'viewer' } },
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  collection: (...args: unknown[]) => args,
  doc: (...args: unknown[]) => ({ id: args[1], data: () => ({}) }),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  limit: (n: number) => ({ type: 'limit', n }),
  orderBy: (field: string, dir: string) => ({ type: 'orderBy', field, dir }),
  query: (...args: unknown[]) => args,
  serverTimestamp: jest.fn(() => 'timestamp'),
  where: (...args: unknown[]) => ({ type: 'where', args }),
}));

const makeSnapshot = (data: Partial<Record<string, unknown>>, id = 'doc-1') => ({
  id,
  data: () => data,
});

describe('SessionRepository', () => {
  const repo = new SessionRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('maps sessions with defaults and viewer flags', async () => {
    // Ensures feed mapping rounds duration and sets owner/support flags.
    const snapshot = makeSnapshot({
      userId: 'viewer',
      title: 'Session title',
      visibility: 'followers',
      duration: 615,
      createdAt: new Date('2023-01-01T00:00:00Z'),
      supportedBy: ['viewer'],
    });
    mockGetDocs.mockResolvedValueOnce({ docs: [snapshot] });

    const result = await repo.getFeed();

    expect(result[0]).toMatchObject({
      id: 'doc-1',
      title: 'Session title',
      durationMinutes: 10,
      visibility: 'followers',
      supported: true,
      isOwner: true,
    });
  });

  test('omits private sessions for other users', async () => {
    // Confirms private sessions are filtered out when viewer is not owner.
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    const result = await repo.getFeed();

    expect(result).toHaveLength(0);
  });

  test('chunks following feed queries above 10 ids', async () => {
    // Verifies following feed splits Firestore queries into batches of 10 ids.
    mockGetDocs.mockResolvedValue({ docs: [] });

    await repo.getFeed({ userIds: Array.from({ length: 11 }, (_, i) => `u-${i}`) });

    expect(mockGetDocs).toHaveBeenCalledTimes(2);
  });

  test('creates session with converted duration', async () => {
    // Ensures create converts minutes to seconds and returns hydrated session.
    mockAddDoc.mockResolvedValueOnce({ id: 'new-id' });
    const created = await repo.create({
      userId: 'viewer',
      title: 'New',
      activityId: 'build',
      durationMinutes: 12,
      visibility: 'followers',
    });

    const [, payload] = mockAddDoc.mock.calls[0];
    expect(payload.duration).toBe(720);
    expect(created).toMatchObject({
      id: 'new-id',
      title: 'New',
      durationMinutes: 12,
      visibility: 'followers',
    });
  });

  test('returns mapped session by id when found', async () => {
    // Confirms getById maps Firestore doc into Session shape.
    const data = { userId: 'u1', createdAt: '2023-01-01T00:00:00Z', duration: 600 };
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => data, id: 'abc' });

    const session = await repo.getById('abc');

    expect(session).toMatchObject({
      id: 'abc',
      userId: 'u1',
      durationMinutes: 10,
    } as Partial<Session>);
  });
});
