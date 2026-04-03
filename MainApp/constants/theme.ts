/**
 * App-wide font constants.
 * Always reference these constants instead of hardcoding font family strings.
 */

export const AppFonts = {
  light: 'Prompt_300Light',
  regular: 'Prompt_400Regular',
  medium: 'Prompt_500Medium',
  semiBold: 'Prompt_600SemiBold',
  bold: 'Prompt_700Bold',
};

/**
 * App-wide layout constants.
 * Centralizes commonly repeated spacing and sizing values.
 */
export const AppLayout = {
  /** Standard header top padding — accounts for status bar */
  headerPaddingTop: { ios: 64, android: 48, default: 44 },
  /** Standard horizontal screen padding */
  screenPaddingHorizontal: 24,
  /** Border radius presets */
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 28,
  },
} as const;
