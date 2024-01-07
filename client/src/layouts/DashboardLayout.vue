<template>
  <v-app>
    <dashboard-sidebar />
    <v-main class="d-flex flex-column h-screen">
      <dashboard-app-bar />
      <div class="pa-2 overflow-auto h-100">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import DashboardSidebar from './DashboardSidebar.vue';
import DashboardAppBar from './DashboardAppBar.vue';
</script>
