/**
 * App-wide color palette.
 * Always reference these constants instead of hardcoding hex values.
 */

export const AppColors = {
  /** Primary brand red — buttons, badges, accents */
  primary: '#E63946',

  /** Dark navy — headings, active tab, icons */
  navy: '#1D3557',

  /** Light gray background */
  backgroundLight: '#F8F9FA',

  /** Pure white */
  white: '#FFFFFF',

  /** Text colors */
  textDark: '#333',
  textMuted: '#666',
  textLight: '#888',
  textPlaceholder: '#aaa',

  /** Borders */
  borderLight: '#e0e0e0',
  borderSubtle: '#e8e8e8',

  /** Semantic colors */
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  /** Gold — premium accents */
  gold: '#EFBF04',
  /** Orange — alerts, energetic accents */
  orange: '#F59E0B',
  /** Popular/Flame — vibrant call-to-action or badges */
  popular: '#FF5A00',
} as const;
