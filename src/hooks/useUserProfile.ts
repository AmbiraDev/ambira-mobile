import React from 'react';

import { SessionRepository } from '@/lib/repositories/SessionRepository';
import { UserRepository } from '@/lib/repositories/UserRepository';
import { useAuth } from '@/providers/AuthProvider';
import type { Session, UserProfile } from '@/types/models';

const sessionRepo = new SessionRepository();
const userRepo = new UserRepository();

export function useUserProfile(
  userId?: string,
): {
    profile: UserProfile | null;
    sessions: Session[];
    loading: boolean;
    error?: string;
    refetch: () => Promise<void>;
  } {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const load = React.useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setSessions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const [userProfile, userSessions] = await Promise.all([
        userRepo.getById(userId, authUser?.uid),
        sessionRepo.getByUserId(userId),
      ]);

      const computedHours = userSessions.reduce(
        (sum, session) => sum + session.durationMinutes / 60,
        0,
      );

      const mergedProfile: UserProfile | null = userProfile
        ? {
          ...userProfile,
          totalSessions: userProfile.totalSessions || userSessions.length,
          totalHours: userProfile.totalHours || computedHours,
          isSelf: authUser?.uid === userId,
        }
        : null;

      setProfile(
        mergedProfile ?? {
          id: userId,
          name: 'Unknown user',
          handle: 'unknown',
          followers: 0,
          following: 0,
          totalHours: computedHours,
          totalSessions: userSessions.length,
          streakDays: 0,
          isSelf: authUser?.uid === userId,
        },
      );
      setSessions(userSessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [authUser?.uid, userId]);

  React.useEffect(() => {
    load();
  }, [load]);

  return { profile, sessions, loading, error, refetch: load };
}
