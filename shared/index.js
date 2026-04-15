/**
 * shared/index.js
 *
 * Shared constants and type definitions used across the backend, admin
 * dashboard, and mobile app. Phase 1 — JS constants only.
 * TypeScript interfaces will be added when the admin and mobile workspaces
 * are bootstrapped.
 */

'use strict';

// ── Loyalty tiers ─────────────────────────────────────────────────────────
const TIERS = Object.freeze({
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
});

// ── Points ledger entry types ─────────────────────────────────────────────
const POINT_TYPES = Object.freeze({
  EARN: 'earn',
  BURN: 'burn',
  ADJUST: 'adjust',
  EXPIRE: 'expire',
});

// ── Notification target types ─────────────────────────────────────────────
const NOTIFICATION_TARGETS = Object.freeze({
  ALL: 'all',
  TIER: 'tier',
  STORE: 'store',
  USER: 'user',
});

// ── Discount types ────────────────────────────────────────────────────────
const DISCOUNT_TYPES = Object.freeze({
  FLAT: 'flat',
  PERCENT: 'percent',
});

// ── User statuses ─────────────────────────────────────────────────────────
const USER_STATUSES = Object.freeze({
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
});

// ── Supported languages ───────────────────────────────────────────────────
const LANGUAGES = Object.freeze({
  ENGLISH: 'en',
  NEPALI: 'ne',
});

// ── Points expiry ─────────────────────────────────────────────────────────
// Points earned expire 12 months after the earn date.
const POINTS_EXPIRY_MONTHS = 12;

// ── Nepal provinces ───────────────────────────────────────────────────────
const PROVINCES = Object.freeze([
  'Koshi',
  'Madhesh',
  'Bagmati',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudurpashchim',
]);

module.exports = {
  TIERS,
  POINT_TYPES,
  NOTIFICATION_TARGETS,
  DISCOUNT_TYPES,
  USER_STATUSES,
  LANGUAGES,
  POINTS_EXPIRY_MONTHS,
  PROVINCES,
};
