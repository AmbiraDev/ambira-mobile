import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types/models';

const COLLECTION = 'users';

const asNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined;

const mapUserProfile = (
  snapshot: { id: string; data: () => Record<string, unknown> | undefined },
  currentUserId?: string,
): UserProfile | null => {
  const data = snapshot.data();
  if (!data) return null;

  const streak = (data.streak as Record<string, unknown> | undefined) ?? {};
  const stats = data.stats as Record<string, unknown> | undefined;
  const totalSeconds = asNumber(data.totalSeconds);
  const totalSessions =
    asNumber(data.totalSessions) ?? asNumber(data.sessionCount) ?? asNumber(stats?.sessions);

  return {
    id: snapshot.id,
    name: (data.name as string | undefined) ?? (data.username as string | undefined) ?? 'User',
    handle:
      (data.username as string | undefined) ??
      (data.email as string | undefined)?.split('@')[0] ??
      snapshot.id,
    avatar: data.profilePicture as string | undefined,
    location: data.location as string | undefined,
    bio: data.bio as string | undefined,
    followers: asNumber(data.followerCount) ?? 0,
    following: asNumber(data.followingCount) ?? 0,
    totalHours:
      asNumber(data.totalHours) ?? (typeof totalSeconds === 'number' ? totalSeconds / 3600 : 0),
    totalSessions: typeof totalSessions === 'number' ? totalSessions : 0,
    streakDays: asNumber(data.currentStreak) ?? asNumber(streak.current) ?? 0,
    bestStreak: asNumber(data.bestStreak) ?? asNumber(streak.best),
    isSelf: currentUserId ? snapshot.id === currentUserId : undefined,
  };
};

export class UserRepository {
  async getById(userId: string, currentUserId?: string): Promise<UserProfile | null> {
    const docRef = doc(db, COLLECTION, userId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return mapUserProfile(snapshot, currentUserId);
  }

  async getByIds(userIds: string[], currentUserId?: string): Promise<Record<string, UserProfile>> {
    const results: Record<string, UserProfile> = {};
    if (userIds.length === 0) return results;

    // Firestore 'in' limit is 10; chunk accordingly.
    for (let i = 0; i < userIds.length; i += 10) {
      const batchIds = userIds.slice(i, i + 10);
      const q = query(collection(db, COLLECTION), where('__name__', 'in', batchIds));
      const snapshot = await getDocs(q);
      snapshot.docs.forEach((docSnap) => {
        const profile = mapUserProfile(docSnap, currentUserId);
        if (profile) {
          results[profile.id] = profile;
        }
      });
    }

    return results;
  }

  async getCurrentUserProfile(userId: string): Promise<UserProfile | null> {
    return this.getById(userId, userId);
  }
}
