import type {
  Achievement,
  Activity,
  FollowingUser,
  Session,
  UserProfile,
} from '@/types/models';

export const mockActivities: Activity[] = [
  { id: 'study', name: 'Study', emoji: '📚', description: 'Deep work and learning' },
  { id: 'build', name: 'Build', emoji: '🛠️', description: 'Shipping product work' },
  { id: 'design', name: 'Design', emoji: '🎨', description: 'Design and creative work' },
  { id: 'fitness', name: 'Fitness', emoji: '💪', description: 'Movement and recovery' },
];

export const currentUser: UserProfile = {
  id: 'me',
  name: 'Casey Lee',
  handle: 'casey',
  avatar: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=240&q=60',
  location: 'Brooklyn, NY',
  bio: 'Building Ambira, tracking progress daily.',
  followers: 124,
  following: 201,
  totalHours: 182,
  totalSessions: 356,
  streakDays: 6,
  bestStreak: 14,
  isSelf: true,
};

export const people: UserProfile[] = [
  currentUser,
  {
    id: 'ari',
    name: 'Ari Gomez',
    handle: 'ari.codes',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=60',
    location: 'Seattle, WA',
    bio: 'Frontend @ Ambira, fan of clean UI and long walks.',
    followers: 342,
    following: 287,
    totalHours: 204,
    totalSessions: 410,
    streakDays: 12,
    bestStreak: 23,
  },
  {
    id: 'devon',
    name: 'Devon Shah',
    handle: 'devon.sh',
    avatar:
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=240&q=60',
    location: 'Austin, TX',
    bio: 'Shipping experiments and keeping the streak alive.',
    followers: 98,
    following: 181,
    totalHours: 96,
    totalSessions: 205,
    streakDays: 3,
    bestStreak: 8,
  },
];

export const mockSessions: Session[] = [
  {
    id: 'sess-1',
    userId: 'me',
    title: 'Ambira feed polish',
    description: 'Tightened spacing and added empty states for the home timeline.',
    activityId: 'build',
    project: 'Ambira Mobile',
    durationMinutes: 65,
    feeling: 'energized',
    visibility: 'everyone',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    media: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=60'],
    supports: 12,
    comments: 4,
    shares: 1,
    supported: true,
    isOwner: true,
  },
  {
    id: 'sess-2',
    userId: 'ari',
    title: 'Design QA for launch',
    description: 'Reviewed edge cases and fixed mobile header overlap.',
    activityId: 'design',
    project: 'Ambira Web',
    durationMinutes: 48,
    feeling: 'neutral',
    visibility: 'followers',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    supports: 33,
    comments: 12,
    shares: 6,
    media: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=60',
    ],
  },
  {
    id: 'sess-3',
    userId: 'devon',
    title: 'Backend clean up',
    description: 'Refactored session visibility and added audit logs.',
    activityId: 'build',
    project: 'Platform',
    durationMinutes: 72,
    feeling: 'tired',
    visibility: 'everyone',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    supports: 17,
    comments: 6,
    shares: 2,
    privateNotes: 'Need to follow up with security review on Monday.',
  },
  {
    id: 'sess-4',
    userId: 'me',
    title: 'Morning run',
    description: '4 miles easy with strides to loosen up.',
    activityId: 'fitness',
    project: 'Base building',
    durationMinutes: 36,
    feeling: 'energized',
    visibility: 'followers',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    supports: 9,
    comments: 1,
    shares: 0,
  },
];

export const followingList: FollowingUser[] = [
  {
    id: 'jamal',
    name: 'Jamal Price',
    handle: 'jamalpace',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=240&q=60',
    isFollowing: true,
    location: 'Chicago, IL',
  },
  {
    id: 'carmen',
    name: 'Carmen Liu',
    handle: 'carmen.design',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=60',
    isFollowing: true,
    location: 'Portland, OR',
  },
  {
    id: 'devon',
    name: 'Devon Shah',
    handle: 'devon.sh',
    avatar:
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=240&q=60',
    isFollowing: false,
    location: 'Austin, TX',
  },
];

export const achievements: Achievement[] = [
  {
    id: 'streak-7',
    label: '7 Day Streak',
    description: 'Kept the streak alive for a full week.',
    earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'early-bird',
    label: 'Early Builder',
    description: 'Logged a session before 7am three times this week.',
    earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'deep-focus',
    label: 'Deep Focus',
    description: 'Completed 3 sessions over 60 minutes this month.',
  },
];

export const activityBreakdown = [
  { activityId: 'build', label: 'Build', percent: 46 },
  { activityId: 'study', label: 'Study', percent: 28 },
  { activityId: 'design', label: 'Design', percent: 18 },
  { activityId: 'fitness', label: 'Fitness', percent: 8 },
];

export const getUserById = (id: string): UserProfile | undefined =>
  people.find((person) => person.id === id);

export const getActivityById = (id: string): Activity | undefined =>
  mockActivities.find((activity) => activity.id === id);
