import { ExpirePeriods } from "../@types/file-off";

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

export const isValidExpirePeriod = (period: string) => {
    return period in expirePeriods;
}

export const createExpireDate = (period: keyof ExpirePeriods) => {
    return expirePeriods[period]();
};