export type Visibility = 'everyone' | 'followers' | 'private';

export type Feeling = 'energized' | 'neutral' | 'tired';

export type Activity = {
  id: string;
  name: string;
  emoji: string;
  description?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  location?: string;
  bio?: string;
  followers: number;
  following: number;
  totalHours: number;
  totalSessions: number;
  streakDays: number;
  bestStreak?: number;
  isSelf?: boolean;
};

export type Achievement = {
  id: string;
  label: string;
  description?: string;
  earnedAt?: string;
};

export type Session = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  activityId: string;
  project?: string;
  durationMinutes: number;
  feeling?: Feeling;
  visibility: Visibility;
  createdAt: string;
  media?: string[];
  supports: number;
  comments: number;
  shares: number;
  supported?: boolean;
  isOwner?: boolean;
  privateNotes?: string;
};

export type FollowingUser = {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  isFollowing: boolean;
  location?: string;
};
