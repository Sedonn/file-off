import { query } from 'express-validator';

import { getValidLang } from '../lang/main';

/**
 * Validates data on "lang" route.
 * @filename lang.routes.ts
 */
export const getLangSanitizer = [
    query('lang').customSanitizer((lang) => getValidLang(lang)),
];
