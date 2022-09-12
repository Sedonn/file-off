import fs from 'fs';
import path from 'path';

import { Lang, Langs } from '../@types/file-off/lang';

// Setting the available languages
const LANGS = ['en', 'ru'];
// Setting the default language
const DEFAULT_LANG = 'en';

/**
 * Function for loading language from .json file from this directory by language key.
 * @param {string} key - Language key. 
 * @returns {Lang} - Language text.
 */
const loadLang = (key: string): Lang => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, `${key}.json`), 'utf-8'));
};

/**
 * Function for validating language key.
 * If lang not finded returns default language.
 * @param {string} lang - Language key text. 
 * @returns {keyof Langs} - Validated language key.
 */
export const getValidLang = (lang: string): keyof Langs => {
    return (LANGS.includes(lang) ? lang : DEFAULT_LANG) as keyof Langs;
};

/**
 * Function for loading all available languages.
 * @returns {Langs}
 */
export const langsInit = (): Langs => {
    return Object.assign({}, ...LANGS.map((lang) => ({ [lang]: loadLang(lang) })));
};