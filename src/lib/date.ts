import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns the current date in IST timezone as a YYYY-MM-DD string.
 * Regardless of where the user is in the world, this ensures they
 * are operating on India Standard Time for daily resets.
 */
export function getISTDateString(): string {
  const now = new Date();
  return formatInTimeZone(now, IST_TIMEZONE, 'yyyy-MM-dd');
}

/**
 * Parses a YYYY-MM-DD string as if it's midnight in IST,
 * returning a Date object. Useful for deterministic time calculations.
 */
export function getISTDateFromString(dateStr: string): Date {
  // Parse string as local, then zone it to IST midnight
  const localDate = new Date(`${dateStr}T00:00:00`);
  return toZonedTime(localDate, IST_TIMEZONE);
}
