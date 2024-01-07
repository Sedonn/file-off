import { I18nOptions, createI18n } from 'vue-i18n';

import en from '@/locales/en.json';
import ru from '@/locales/ru.json';

export type TAvailableLocales = 'en' | 'ru';

export const saveLastSelectedLocale = (locale: TAvailableLocales) =>
  localStorage.setItem('locale', locale);

export const getLastSeletedLocale = () =>
  localStorage.getItem('locale') ?? 'en';

const options = {
  legacy: false,
  locale: getLastSeletedLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    ru,
  },
} satisfies I18nOptions;

export default createI18n<false, typeof options>(options);
