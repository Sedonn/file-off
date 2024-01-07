<template>
  <site-header />
  <v-card class="mt-9 pa-5" rounded="xl" width="350">
    <v-card-title class="text-h1 pa-10 text-center">404</v-card-title>
    <v-card-text class="text-h5 mt-5 text-center">{{
      t('notFoundPage.title')
    }}</v-card-text>

    <v-btn
      class="mt-5"
      color="surface-white"
      prepend-icon="mdi-arrow-left"
      block
      @click="$router.back()"
    >
      {{ t('notFoundPage.returnBackLabel') }}
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import SiteHeader from '@/components/SiteHeader.vue';

const { t } = useI18n();
</script>
