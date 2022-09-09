import fs from 'fs';
import path from 'path';

import { Lang, Langs } from '../@types/file-off/lang';

const LANGS = ['en', 'ru'];
const DEFAULT_LANG = 'en';

const loadLang = (name: string): Lang => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, `${name}.json`), 'utf-8'));
};

export const getValidLang = (lang: string) => {
    return LANGS.includes(lang) ? lang : DEFAULT_LANG;
};

export const langsInit = (): Langs => {
    return Object.assign({}, ...LANGS.map((lang) => ({ [lang]: loadLang(lang) })));
};