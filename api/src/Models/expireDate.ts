/** @fileoverview Methods for managing expire dates of the file storage. */

import type { ExpirePeriod, ExpirePeriods } from '@/@types/index.d.ts';

/** All available expire date calculators. */
const expirePeriods = {
  year: (date: Date) => new Date(date.setFullYear(date.getFullYear() + 1)),
  month: (date: Date) => new Date(date.setMonth(date.getMonth() + 1)),
  week: (date: Date) => new Date(date.setDate(date.getDate() + 7)),
} satisfies ExpirePeriods;

/**
 * Verifies that the {@link period} is a valid kind of the expire period.
 * @param period
 */
export const isValidExpirePeriod = (period: string): boolean => period in expirePeriods;

/**
 * Calculate expire date between today's date and expire period kind.
 * @param period
 */
export const createExpireDate = (period: ExpirePeriod): Date => expirePeriods[period](new Date());
