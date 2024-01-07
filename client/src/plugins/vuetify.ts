/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import { useI18n } from 'vue-i18n';

import i18n from './i18n';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaults: {
    VDivider: {
      color: 'surface-white',
    },

    VTextField: {
      variant: 'solo',
      bgColor: 'surface-white',
      VLabel: {
        class: 'font-weight-medium',
      },
    },

    VCardText: {
      class: 'font-weight-medium',
    },

    VCheckbox: {
      baseColor: 'surface-white',
      color: 'surface-white',
      density: 'comfortable',
      VLabel: {
        class: 'font-weight-medium text-surface-white',
        style: 'opacity: 1',
      },
    },

    VRadioGroup: {
      VLabel: {
        class: 'font-weight-medium text-surface-white',
        style: 'opacity: 1',
      },
    },

    VFileInput: {
      variant: 'solo',
      bgColor: 'surface-white',
      VLabel: {
        class: 'font-weight-medium',
      },
    },
  },

  theme: {
    themes: {
      light: {
        colors: {
          background: '#eae7dc',
          primary: '#e98074',
          surface: '#e98074',
          'surface-white': '#eae7dc',
        },
      },
    },
  },

  locale: {
    adapter: createVueI18nAdapter({
      i18n,
      useI18n,
    }),
  },
});
