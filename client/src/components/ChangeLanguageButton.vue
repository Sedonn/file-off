<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" :color="color">
        <v-badge color="transparent">
          <template #badge>
            <span :class="localeIconClass" style="width: 18px; height: 18px" />
          </template>
          <v-icon icon="mdi-web" size="x-large" />
        </v-badge>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="locale in $i18n.availableLocales"
        :key="locale"
        class="em bg-surface-white"
        rounded
        @click="onLanguageChange(locale as TAvailableLocales)"
      >
        <template #prepend>
          <span
            class="mr-2"
            :class="getLocaleIconClass(locale as TAvailableLocales)"
          />
        </template>
        <v-list-item-title class="text-uppercase">{{
          locale
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { saveLastSelectedLocale, type TAvailableLocales } from '@/plugins/i18n';

import { VBtn } from 'vuetify/lib/components/index.mjs';

type ChangeLanguageButtonProps = {
  color?: string | undefined;
};

defineProps<ChangeLanguageButtonProps>();

const { locale } = useI18n();

const localeIconClass = computed(() =>
  getLocaleIconClass(locale.value as TAvailableLocales),
);

const getLocaleIconClass = (localeKey: TAvailableLocales) => {
  const iconConfig = {
    en: 'fi-gb',
    ru: 'fi-ru',
  } satisfies Record<TAvailableLocales, string>;

  return ['fi', iconConfig[localeKey]];
};

const onLanguageChange = (changedLocale: TAvailableLocales) => {
  locale.value = changedLocale;
  saveLastSelectedLocale(changedLocale);
};
</script>
