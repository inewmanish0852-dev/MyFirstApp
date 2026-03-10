// src/theme.js
export const colors = {
  primary: '#1A3C6E',
  primaryDark: '#0F2548',
  primaryLight: '#2A5298',
  accent: '#4A90D9',
  accentLight: '#6AAEE8',
  background: '#F4F7FC',
  surface: '#FFFFFF',
  text: '#1A2B4A',
  textSecondary: '#5A6A85',
  textLight: '#8A9BB5',
  border: '#D8E2F0',
  success: '#2ECC71',
  error: '#E74C3C',
  white: '#FFFFFF',
  shadow: 'rgba(26, 60, 110, 0.12)',
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', color: colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600', color: colors.text },
  body: { fontSize: 15, fontWeight: '400', color: colors.text, lineHeight: 22 },
  bodySecondary: { fontSize: 14, fontWeight: '400', color: colors.textSecondary, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500', color: colors.textLight },
  button: { fontSize: 15, fontWeight: '600', color: colors.white, letterSpacing: 0.3 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
  button: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};