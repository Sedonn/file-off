<template>
  <v-navigation-drawer v-model="uiController.isSidebarOpen" elevation="5">
    <div class="d-flex justify-center my-2">
      <v-img src="@/assets/logo-white.png" width="159" height="79" />
    </div>

    <v-divider class="border-opacity-100" thickness="3" />

    <v-list class="mx-3" density="compact">
      <v-list-item
        v-for="{ name, path, meta } in dashboardRoutes.children"
        :key="name"
        :to="path"
        :active="$route.path === path"
        class="bg-surface-white text-center mt-1"
        rounded
      >
        <v-list-item-title class="text-h6">{{
          t(meta.pageTitleI18nKey)
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useUIController } from '@/store/ui';
import { dashboardRoutes } from '@/router';

const { t } = useI18n();
const uiController = useUIController();
</script>
