export const colors = {
  background: '#0F172A',
  surface: '#111C3A',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5F5',
  accent: '#6366F1',
  brandPrimary: '#305CDE',
  brandOnPrimary: '#FFFFFF',
  brandSecondary: '#5B4EFE',
  textDark: '#0F172A',
  textMuted: '#475569',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  backgroundAlt: '#F8FAFC',
  pill: '#E8EDFF',
} as const;

export type AppColor = keyof typeof colors;
