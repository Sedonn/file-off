import { ExpirePeriod, ExpirePeriods } from '../@types';

/**
 * Functions for calculation of expire dates.
 * @type {ExpirePeriods}
 */
const expirePeriods: ExpirePeriods = {
  year: (date) => new Date(date.setFullYear(date.getFullYear() + 1)),
  month: (date) => new Date(date.setMonth(date.getMonth() + 1)),
  week: (date) => new Date(date.setDate(date.getDate() + 7)),
};

/**
 * Function for validation of expire periods.
 * @param {string} period - Period key text.
 * @returns {boolean} - Result of validation.
 */
export const isValidExpirePeriod = (period: string): boolean => period in expirePeriods;

/**
 * Function for creation of expire dates.
 * @param {keyof ExpirePeriods} period - Period key.
 * @returns {Date} - Result of calculating expire date.
 */
export const createExpireDate = (period: ExpirePeriod): Date => expirePeriods[period](new Date());
