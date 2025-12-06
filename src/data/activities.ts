import type { Activity } from '@/types/models';

export const DEFAULT_ACTIVITIES: Activity[] = [
  { id: 'study', name: 'Study', emoji: '📚', description: 'Deep work and learning' },
  { id: 'build', name: 'Build', emoji: '🛠️', description: 'Shipping product work' },
  { id: 'design', name: 'Design', emoji: '🎨', description: 'Design and creative work' },
  { id: 'fitness', name: 'Fitness', emoji: '💪', description: 'Movement and recovery' },
];
