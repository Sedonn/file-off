// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RouteMeta } from 'vue-router';

declare module 'vue-router' {
  export interface RouteMeta {
    /** The I18n language key, which contains the title. */
    pageTitleI18nKey: string;
  }
}
