export const theme = {
  colors: {
    primary: '#10B981',
    primaryDark: '#059669',
    background: '#FDFBF7',
    surface: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280',
    textMuted: '#9CA3AF',
    danger: '#EF4444',
    border: '#E5E7EB',
    borderFocus: '#10B981',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    round: 9999,
  },
} as const;

export type Theme = typeof theme;
