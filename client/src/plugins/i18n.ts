/** @fileoverview Configuration of the vue-i18n library. */

import { I18nOptions, createI18n } from 'vue-i18n';

import en from '@/locales/en.json';
import ru from '@/locales/ru.json';

export type TAvailableLocales = 'en' | 'ru';

/**
 * Save a last selected locale to the local storage.
 * @param locale
 */
export const saveLastSelectedLocale = (locale: TAvailableLocales) =>
  localStorage.setItem('locale', locale);

/** Get a last selected locale from the local storage. */
export const getLastSelectedLocale = () =>
  localStorage.getItem('locale') ?? 'en';

const options = {
  legacy: false,
  locale: getLastSelectedLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    ru,
  },
} satisfies I18nOptions;

export default createI18n<false, typeof options>(options);
