<template>
  <v-dialog ref="testRef" v-model="isDialogOpen" max-width="530" persistent>
    <v-card color="background">
      <v-toolbar
        color="surface"
        :title="t('registerCompleteDialog.title')"
        density="compact"
      >
        <v-btn icon="mdi-close" @click="close" />
      </v-toolbar>

      <div class="d-flex pa-2">
        <v-icon icon="mdi-check" color="success" size="150" />
        <div class="d-flex flex-column">
          <v-card-title>{{
            t('registerCompleteDialog.subtitle')
          }}</v-card-title>
          <v-card-text>
            {{ t('registerCompleteDialog.description') }}
          </v-card-text>
        </div>
      </div>
      <v-card-actions>
        <v-btn class="bg-surface" @click="close" block>OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { t } = useI18n();

const isDialogOpen = ref<boolean>(false);

const open = () => {
  isDialogOpen.value = true;
};

const close = () => {
  isDialogOpen.value = false;
  router.push({ name: 'Login' });
};

defineExpose({ open, close });
</script>
