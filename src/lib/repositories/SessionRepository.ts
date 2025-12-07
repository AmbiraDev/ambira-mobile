import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit as limitFn,
  orderBy,
  query,
  serverTimestamp,
  where,
  type QueryConstraint,
  type Timestamp,
} from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import type { Session, Visibility } from '@/types/models';

const COLLECTION = 'sessions';
const DEFAULT_LIMIT = 50;

type SessionSnapshot = {
  id: string;
  data: () => Record<string, unknown> | undefined;
};

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const asStringArray = (value: unknown): string[] | undefined =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : undefined;

const asNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined;

const asVisibility = (value: unknown): Visibility | undefined =>
  value === 'everyone' || value === 'followers' || value === 'private' ? value : undefined;

const asFeeling = (value: unknown): Session['feeling'] | undefined =>
  value === 'energized' || value === 'neutral' || value === 'tired' ? value : undefined;

const timestampToIso = (value: unknown): string => {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return new Date(value).toISOString();
  if (typeof (value as Timestamp).toDate === 'function') {
    return (value as Timestamp).toDate().toISOString();
  }
  return new Date().toISOString();
};

const mapSession = (snapshot: SessionSnapshot): Session | null => {
  const data = snapshot.data();
  if (!data) return null;

  const viewerId = auth?.currentUser?.uid;
  const createdAt = timestampToIso(data.createdAt);
  const userId = asString(data.userId);
  if (!userId) return null;

  const visibility = asVisibility(data.visibility) ?? 'everyone';
  const durationSeconds = asNumber(data.duration) ?? 0;
  const durationMinutes = Math.max(
    0,
    Math.round(durationSeconds / 60),
  );
  const supportedBy = asStringArray(data.supportedBy) ?? [];

  return {
    id: snapshot.id,
    userId,
    title: asString(data.title) ?? 'Session',
    description: asString(data.description),
    activityId: asString(data.activityId) ?? asString(data.projectId) ?? 'build',
    project: asString(data.projectId),
    durationMinutes: durationMinutes || 0,
    feeling: asFeeling(data.howFelt),
    visibility,
    createdAt,
    media: asStringArray(data.images) ?? [],
    supports: asNumber(data.supportCount) ?? 0,
    comments: asNumber(data.commentCount) ?? 0,
    shares: asNumber(data.shareCount) ?? 0,
    supported: viewerId ? supportedBy.includes(viewerId) : false,
    isOwner: viewerId ? viewerId === userId : false,
    privateNotes: asString(data.privateNotes),
  };
};

export type FeedOptions = {
  userIds?: string[];
  limit?: number;
  visibility?: Visibility;
};

export class SessionRepository {
  async getFeed(options?: FeedOptions): Promise<Session[]> {
    const userIds = options?.userIds?.filter(Boolean);
    const limit = options?.limit ?? DEFAULT_LIMIT;
    const visibility = options?.visibility;

    // If no user filter, fetch public sessions
    if (!userIds || userIds.length === 0) {
      const constraints: QueryConstraint[] = [
        where('visibility', '==', 'everyone'),
        orderBy('createdAt', 'desc'),
        limitFn(limit),
      ];

      const snapshot = await getDocs(query(collection(db, COLLECTION), ...constraints));
      return snapshot.docs
        .map(mapSession)
        .filter(Boolean)
        .map((session) => session as Session);
    }

    // Firestore 'in' queries limited to 10 IDs; chunk to fetch all.
    const batches: Promise<Session[]>[] = [];
    for (let i = 0; i < userIds.length; i += 10) {
      const batchIds = userIds.slice(i, i + 10);
      const constraints: QueryConstraint[] = [
        where('userId', 'in', batchIds),
        orderBy('createdAt', 'desc'),
        limitFn(limit),
      ];
      const batchPromise = getDocs(query(collection(db, COLLECTION), ...constraints)).then(
        (snapshot) =>
          snapshot.docs
            .map(mapSession)
            .filter(Boolean)
            .map((session) => session as Session)
            .filter((session) => {
              if (!session) return false;
              if (visibility) return session.visibility === visibility;
              if (session.visibility === 'private' && !session.isOwner) return false;
              return true;
            }),
      );
      batches.push(batchPromise);
    }

    const results = await Promise.all(batches);
    const flattened = results.flat();
    return flattened.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async getById(id: string): Promise<Session | null> {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return mapSession(snapshot);
  }

  async getByUserId(userId: string, limit: number = DEFAULT_LIMIT): Promise<Session[]> {
    const q = query(
      collection(db, COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limitFn(limit),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(mapSession)
      .filter(Boolean)
      .map((session) => session as Session);
  }

  async create(input: {
    userId: string;
    title: string;
    description?: string;
    activityId: string;
    project?: string;
    durationMinutes: number;
    visibility: Visibility;
    media?: string[];
    feeling?: Session['feeling'];
    privateNotes?: string;
  }): Promise<Session> {
    const now = new Date();
    const payload = {
      userId: input.userId,
      projectId: input.project ?? input.activityId,
      activityId: input.activityId,
      duration: Math.max(0, Math.round(input.durationMinutes * 60)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      title: input.title,
      description: input.description,
      visibility: input.visibility,
      images: input.media ?? [],
      supportCount: 0,
      commentCount: 0,
      allowComments: true,
      privateNotes: input.privateNotes,
      howFelt: input.feeling,
    };

    const docRef = await addDoc(collection(db, COLLECTION), payload);
    return {
      id: docRef.id,
      userId: input.userId,
      title: input.title,
      description: input.description,
      activityId: input.activityId,
      project: input.project ?? input.activityId,
      durationMinutes: input.durationMinutes,
      visibility: input.visibility,
      createdAt: now.toISOString(),
      media: input.media ?? [],
      supports: 0,
      comments: 0,
      shares: 0,
      supported: false,
      isOwner: true,
      privateNotes: input.privateNotes,
      feeling: input.feeling,
    };
  }
}
