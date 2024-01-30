<template>
  <v-toolbar class="bg-surface-white" elevation="5" style="z-index: 1">
    <v-btn icon="mdi-menu" @click="uiController.toggleSidebar" />

    <v-toolbar-title>
      <span class="text-surface text-decoration-underline">{{
        t($route.meta.pageTitleI18nKey)
      }}</span>
    </v-toolbar-title>

    <v-spacer />

    <div class="mr-3">
      <change-language-button />
    </div>

    <v-divider
      class="border-opacity-100"
      color="surface"
      thickness="2"
      vertical
    />

    <v-sheet class="mr-4 bg-surface-white d-flex align-center">
      <v-avatar size="48" class="ma-3">
        <v-icon size="48" icon="mdi-account-circle" />
      </v-avatar>
      <div>{{ userStore.login }}</div>
    </v-sheet>

    <v-divider
      class="border-opacity-100"
      color="surface"
      thickness="3"
      vertical
    />

    <v-btn icon="mdi-logout" class="ml-2" @click="userStore.logout" />
  </v-toolbar>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import ChangeLanguageButton from '@/components/ChangeLanguageButton.vue';

import { useUserStore } from '@/store/user';
import { useUIController } from '@/store/ui';

const { t } = useI18n();
const userStore = useUserStore();
const uiController = useUIController();
</script>
