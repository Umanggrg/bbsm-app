/**
 * BBSM Brand Colors — Apple-inspired design system
 *
 * System colors follow iOS human interface guidelines.
 * Brand colors derived from BBSM logo and Bhat-Bhateni building.
 */
export const Colors = {
  // ── Core Brand ───────────────────────────────────────────────────────────
  primary: '#E07830',        // BBSM orange — logo amber (primary brand color)
  primaryDark: '#B85F20',
  primaryLight: '#FFF2EA',

  red: '#C8102E',            // BBSM red — building signage (accent use only)
  redDark: '#A00D24',
  redLight: '#FFE5E9',

  orange: '#E07830',         // Alias kept for compatibility
  orangeDark: '#B85F20',
  orangeLight: '#FFF2EA',

  steelBlue: '#4A7FA0',      // Building glass facade
  steelBlueDark: '#346080',
  steelBlueLight: '#EBF4FA',
  mountainBlue: '#7BAFC8',   // Logo Himalayan peaks

  accent: '#D4A843',         // Gold — tiers, highlights
  accentLight: '#FBF3E0',

  // ── Apple iOS system colors ───────────────────────────────────────────────
  background: '#F5F5F7',         // Website cream — Publix-style warm neutral
  surface: '#FFFFFF',             // Cards, sheets
  surfaceElevated: '#FFFFFF',
  surfaceAlt: '#F5F5F7',

  textPrimary: '#1D1D1F',        // Apple label
  textSecondary: '#8E8E93',      // Apple secondary label
  textMuted: '#C7C7CC',          // Apple tertiary label
  textOnPrimary: '#FFFFFF',

  border: 'rgba(60, 60, 67, 0.12)',   // iOS separator
  borderLight: '#E5E5EA',              // iOS opaque separator

  // ── Status (Apple system) ────────────────────────────────────────────────
  success: '#34C759',
  warning: '#FF9F0A',
  error: '#FF3B30',
  info: '#007AFF',

  // ── Loyalty Tiers ────────────────────────────────────────────────────────
  tierSilver: '#8E8E93',
  tierGold: '#D4A843',
  tierPlatinum: '#5E5CE6',

  // ── Tab Bar ──────────────────────────────────────────────────────────────
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#E07830',
  tabBarInactive: '#8E8E93',

  // ── Overlay ──────────────────────────────────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.15)',
} as const;
