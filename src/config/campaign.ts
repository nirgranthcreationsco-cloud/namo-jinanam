// ─────────────────────────────────────────────────────────────
// Campaign Configuration
// Single source of truth for all campaign dates.
// Update these values — no other code changes needed.
// ─────────────────────────────────────────────────────────────

/**
 * The date the campaign officially begins (IST midnight).
 * All protected routes are locked until this date.
 */
export const CAMPAIGN_START = new Date("2026-08-19T00:00:00+05:30");

/**
 * The date the campaign officially ends (IST midnight).
 */
export const CAMPAIGN_END = new Date("2026-10-19T00:00:00+05:30");

/**
 * Returns true if the campaign has started.
 * Safe to call in both server and client components.
 */
export function isCampaignLive(): boolean {
  return new Date() >= CAMPAIGN_START;
}

/**
 * Client-only: returns true if Developer Test Mode is enabled via localStorage.
 * Must never be stored in Supabase or affect server behaviour.
 */
export function isTestModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("campaign_test_mode") === "true";
}

/**
 * Client-only: Combined check — campaign is accessible either when it's live
 * or when developer test mode is explicitly enabled.
 */
export function isCampaignAccessible(): boolean {
  return isCampaignLive() || isTestModeEnabled();
}

// Display strings for UI
export const CAMPAIGN_START_DISPLAY_HI = "19 अगस्त 2026";
export const CAMPAIGN_START_DISPLAY_EN = "19 August 2026";
export const CAMPAIGN_END_DISPLAY_HI = "19 अक्टूबर 2026";
export const CAMPAIGN_END_DISPLAY_EN = "19 October 2026";

/**
 * The date the certificate download unlocks (final week of campaign).
 */
export const CERTIFICATE_UNLOCK_DATE = new Date("2026-10-12T00:00:00+05:30");
export const CERTIFICATE_UNLOCK_DISPLAY_HI = "12 अक्टूबर 2026";
export const CERTIFICATE_UNLOCK_DISPLAY_EN = "12 October 2026";

/**
 * Returns true if certificate download is unlocked (final week or test mode).
 */
export function isCertificateDownloadUnlocked(): boolean {
  return new Date() >= CERTIFICATE_UNLOCK_DATE || isTestModeEnabled();
}
