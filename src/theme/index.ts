export const palette = {
  orange: '#FF6600',
  orangeLight: '#FF8533',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray900: '#111827',
  red: '#EF4444',
  redDark: '#B91C1C',
};

export const colors = {
  light: {
    background: palette.white,
    surface: palette.gray50,
    border: palette.gray200,
    text: palette.gray900,
    textSecondary: palette.gray500,
    textTertiary: palette.gray400,
    tint: palette.orange,
    tabBar: palette.white,
    tabBarBorder: palette.gray200,
    tabIconDefault: palette.gray400,
    tabIconSelected: palette.orange,
    skeleton: palette.gray200,
    skeletonHighlight: palette.gray100,
    offlineBanner: palette.red,
    error: palette.red,
  },
  dark: {
    background: '#0D1117',
    surface: '#161B22',
    border: '#30363D',
    text: '#E6EDF3',
    textSecondary: '#8B949E',
    textTertiary: '#6E7681',
    tint: palette.orangeLight,
    tabBar: '#161B22',
    tabBarBorder: '#30363D',
    tabIconDefault: '#6E7681',
    tabIconSelected: palette.orangeLight,
    skeleton: '#21262D',
    skeletonHighlight: '#30363D',
    offlineBanner: palette.redDark,
    error: '#F87171',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ThemeColors = typeof colors.light;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const fonts = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
  },

} as const;

