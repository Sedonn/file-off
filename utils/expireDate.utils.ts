import { ExpirePeriods } from "../@types/file-off";

/**
 * Functions for calculate expire dates with different expire periods.
 * @type {ExpirePeriods}
 */
const expirePeriods: ExpirePeriods = {
    year: () => {
        const now = new Date();
        return new Date(now.setFullYear(now.getFullYear() + 1));
    },
    month: () => {
        const now = new Date();
        return new Date(now.setMonth(now.getMonth() + 1));
    },
    week: () => {
        const now = new Date();
        return new Date(now.setDate(now.getDate() + 7));
    },
};

/**
 * Function for validating expire periods.
 * @param {string} period - Period key text.
 * @returns {boolean} - Result of validation.
 */
export const isValidExpirePeriod = (period: string): boolean => {
    return period in expirePeriods;
}

/**
 * Function for creating expire date through specific period.
 * @param {keyof ExpirePeriods} period - Period key.
 * @returns {Date} - Result of calculating expire date.
 */
export const createExpireDate = (period: keyof ExpirePeriods): Date => {
    return expirePeriods[period]();
};