import { query } from 'express-validator';

import { getValidLang } from '../lang/main';

export const getLangSanitizer = [
    query('lang').customSanitizer((lang) => getValidLang(lang)),
];
