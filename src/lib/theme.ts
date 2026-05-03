export const COLORS = {
  background: '#F8F7F5',
  primary: '#4A7FA5',
  secondary: '#6BAB90',
  accent: '#D4956A',
  text: '#2C2C2C',
  textMuted: '#6B6B6B',
  card: '#FFFFFF',
  border: '#E5E0DB',
  success: '#5A9B7A',
  white: '#FFFFFF',
  // Category colors
  appointments: '#4A7FA5',
  money: '#6BAB90',
  'daily-living': '#D4956A',
  communication: '#8B7BB5',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 999,
};

export const TYPOGRAPHY = {
  largeTitle: {
    fontSize: 30,
    fontWeight: '700' as const,
    color: COLORS.text,
    lineHeight: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.text,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: COLORS.text,
    lineHeight: 24,
  },
  bodyMuted: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: COLORS.textMuted,
    lineHeight: 24,
  },
  small: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  smallBold: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: COLORS.text,
    lineHeight: 20,
  },
};

export const SHADOW = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
};
