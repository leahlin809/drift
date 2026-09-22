export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

export const typography = {
  screenTitle: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  sectionTitle: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const },
  body: { fontSize: 17, lineHeight: 24, fontWeight: '400' as const },
  metadata: { fontSize: 15, lineHeight: 20, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
} as const;

const lightColors = {
  background: '#F7F8F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#EFF1EF',
  textPrimary: '#1A1D1B',
  textSecondary: '#69706C',
  separator: '#D9DEDA',
  accent: '#356A5A',
  onAccent: '#FFFFFF',
  tagSurface: '#E5EEE8',
  tagText: '#355A4C',
  topicSurface: '#ECE8E1',
  topicText: '#655847',
  iconSurface: '#EEF1EE',
  overlay: 'rgba(18, 24, 20, 0.18)',
  disabled: '#AEB4B0',
} as const;

const darkColors = {
  background: '#111412',
  surface: '#1A1E1B',
  surfaceSecondary: '#232824',
  textPrimary: '#F2F4F2',
  textSecondary: '#AEB5B0',
  separator: '#353C37',
  accent: '#76A996',
  onAccent: '#10231D',
  tagSurface: '#243A31',
  tagText: '#A9CEBD',
  topicSurface: '#39332C',
  topicText: '#D4C3AD',
  iconSurface: '#262D28',
  overlay: 'rgba(0, 0, 0, 0.34)',
  disabled: '#69706C',
} as const;

export const themes = {
  light: { colors: lightColors, spacing, radius, typography },
  dark: { colors: darkColors, spacing, radius, typography },
} as const;

export type AppTheme = (typeof themes)[keyof typeof themes];
