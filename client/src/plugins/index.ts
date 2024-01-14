/** @fileoverview Setting up of the all used plugins. */

import vuetify from './vuetify';
import Vue3Toastify from 'vue3-toastify';
import { toastContainerOptions } from './toastify';
import pinia from '../store';
import router from '../router';
import i18n from './i18n';

import type { App } from 'vue';

export function registerPlugins(app: App) {
  app
    .use(i18n)
    .use(vuetify)
    .use(Vue3Toastify, toastContainerOptions)
    .use(router)
    .use(pinia);
}
