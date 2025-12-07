import React from 'react';

import { SessionRepository } from '@/lib/repositories/SessionRepository';
import { UserRepository } from '@/lib/repositories/UserRepository';
import type { Session, UserProfile } from '@/types/models';

const sessionRepo = new SessionRepository();
const userRepo = new UserRepository();

export function useSessionDetail(
  sessionId?: string,
): {
    session: Session | null;
    user: UserProfile | null;
    loading: boolean;
    error?: string;
    refetch: () => Promise<void>;
  } {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const load = React.useCallback(async () => {
    if (!sessionId) {
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const foundSession = await sessionRepo.getById(sessionId);
      setSession(foundSession);

      if (foundSession?.userId) {
        const profile = await userRepo.getById(foundSession.userId);
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  React.useEffect(() => {
    load();
  }, [load]);

  return { session, user, loading, error, refetch: load };
}
