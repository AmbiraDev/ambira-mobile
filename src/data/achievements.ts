import type { Achievement } from '@/types/models';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
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
