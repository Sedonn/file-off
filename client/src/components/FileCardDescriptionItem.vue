<template>
  <v-list-item class="pa-1">
    <template #prepend>
      <v-avatar variant="text">
        <v-icon size="large" :icon="props.icon" />
      </v-avatar>
    </template>
    <v-list-item-title>{{ props.title }}</v-list-item-title>
    <v-list-item-subtitle style="opacity: 0.9">
      <slot />
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script setup lang="ts">
type FileCardDescriptionItemProps = {
  title: string;
  icon: string;
};

const props = defineProps<FileCardDescriptionItemProps>();
</script>
