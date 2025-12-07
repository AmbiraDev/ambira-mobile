import type { Session, UserProfile } from '@/types/models';

export const sampleUser: UserProfile = {
  id: 'user-1',
  name: 'Pat Doe',
  handle: 'pat',
  followers: 2,
  following: 3,
  totalHours: 4,
  totalSessions: 5,
  streakDays: 6,
  isSelf: false,
};

export const sampleSession: Session = {
  id: 'session-1',
  userId: 'user-1',
  title: 'Build feature',
  description: 'Worked on onboarding',
  activityId: 'build',
  project: 'build',
  durationMinutes: 25,
  visibility: 'everyone',
  createdAt: new Date().toISOString(),
  media: [],
  supports: 1,
  comments: 2,
  shares: 0,
  supported: false,
  isOwner: false,
};
