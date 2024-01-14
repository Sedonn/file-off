/** @fileoverview Store that controls all UI. */

import { defineStore } from 'pinia';

import { ref } from 'vue';

export const useUIController = defineStore('ui', () => {
  const isSidebarOpen = ref<boolean>(true);
  const isLoading = ref<boolean>(false);

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const startLoading = () => {
    isLoading.value = true;
  };

  const stopLoading = () => {
    isLoading.value = false;
  };

  return { isSidebarOpen, isLoading, toggleSidebar, startLoading, stopLoading };
});
