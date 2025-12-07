import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '@/lib/firebase';

export class SocialGraphRepository {
  async getFollowingIds(userId: string): Promise<string[]> {
    // Try primary socialGraph collection
    try {
      const primaryRef = collection(db, 'socialGraph', userId, 'following');
      const primarySnap = await getDocs(primaryRef);
      if (!primarySnap.empty) {
        return primarySnap.docs.map((docSnap) => docSnap.id);
      }
    } catch {
      // Ignore and fall through
    }

    // Fallback to social_graph (legacy web path)
    try {
      const legacyRef = collection(db, 'social_graph', userId, 'outbound');
      const legacySnap = await getDocs(legacyRef);
      if (!legacySnap.empty) {
        return legacySnap.docs.map((docSnap) => docSnap.id);
      }
    } catch {
      // Ignore and fall through
    }

    // Fallback to follows collection
    const followsQuery = query(collection(db, 'follows'), where('followerId', '==', userId));
    const followsSnap = await getDocs(followsQuery);
    return followsSnap.docs
      .map((docSnap) => docSnap.data()?.followingId as string | undefined)
      .filter(Boolean) as string[];
  }
}
