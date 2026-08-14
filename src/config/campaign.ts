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

/** Test account ID — bypasses the pre-launch date lock for internal testing only. */
export const TEST_USER_ID = "34c577d8-86d1-4d40-ac97-fb2825274e86";

/**
 * Returns true if the campaign is accessible (live, or the user is the test account).
 * Pass userId from auth store when available to enable test bypass.
 */
export function isCampaignAccessible(userId?: string | null): boolean {
  if (userId === TEST_USER_ID) return true;
  // Also check localStorage in case userId isn't passed (legacy call-sites)
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("namo-jinanam-auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.user?.id === TEST_USER_ID) return true;
      }
    } catch (_) {}
  }
  return isCampaignLive();
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
 * Returns true if certificate download is unlocked (final week).
 */
export function isCertificateDownloadUnlocked(): boolean {
  return new Date() >= CERTIFICATE_UNLOCK_DATE;
}
