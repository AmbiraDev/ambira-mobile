import React from 'react';

import { SocialGraphRepository } from '@/lib/repositories/SocialGraphRepository';
import { SessionRepository } from '@/lib/repositories/SessionRepository';
import { UserRepository } from '@/lib/repositories/UserRepository';
import { useAuth } from '@/providers/AuthProvider';
import type { Session, UserProfile } from '@/types/models';

type UseFeedOptions = {
  refreshToken?: number;
};

const sessionRepo = new SessionRepository();
const userRepo = new UserRepository();
const socialRepo = new SocialGraphRepository();

export function useFeed(
  filter: 'following' | 'all',
  options?: UseFeedOptions,
): {
    data: Session[];
    usersById: Record<string, UserProfile>;
    loading: boolean;
    error?: string;
    refetch: () => Promise<void>;
  } {
  const { user } = useAuth();
  const [data, setData] = React.useState<Session[]>([]);
  const [usersById, setUsersById] = React.useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const fetchFeed = React.useCallback(async () => {
    if (!user?.uid) {
      setData([]);
      setUsersById({});
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      let userIds: string[] | undefined;
      if (filter === 'following') {
        const following = await socialRepo.getFollowingIds(user.uid);
        userIds = Array.from(new Set([user.uid, ...following]));
      }

      const sessions = await sessionRepo.getFeed({
        userIds,
      });

      const idsToLoad = Array.from(
        new Set([...sessions.map((s) => s.userId), user.uid].filter(Boolean)),
      ) as string[];
      const usersMap = await userRepo.getByIds(idsToLoad, user.uid);

      // Ensure viewer profile exists for header usage
      if (!usersMap[user.uid]) {
        const fallbackProfile: UserProfile = {
          id: user.uid,
          name: user.displayName ?? 'You',
          handle: user.email?.split('@')[0] ?? 'you',
          followers: 0,
          following: 0,
          totalHours: 0,
          totalSessions: 0,
          streakDays: 0,
          isSelf: true,
        };
        usersMap[user.uid] = fallbackProfile;
      }

      setData(sessions);
      setUsersById(usersMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, [filter, user?.displayName, user?.email, user?.uid]);

  React.useEffect(() => {
    fetchFeed();
  }, [fetchFeed, options?.refreshToken]);

  return {
    data,
    usersById,
    loading,
    error,
    refetch: fetchFeed,
  };
}
