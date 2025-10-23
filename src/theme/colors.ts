export const colors = {
  background: '#0F172A',
  surface: '#111C3A',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5F5',
  accent: '#6366F1',
  brandPrimary: '#305CDE',
  brandOnPrimary: '#FFFFFF',
} as const;

export type AppColor = keyof typeof colors;
