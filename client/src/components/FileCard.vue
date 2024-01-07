<template>
  <v-card width="330">
    <v-toolbar color="surface">
      <v-toolbar-title>{{ file.filename }}</v-toolbar-title>
      <template #append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props" />
          </template>

          <v-list>
            <v-list-item
              prepend-icon="mdi-delete"
              class="bg-surface-white"
              rounded
              @click="onFileDelete"
            >
              <v-list-item-title>{{
                t('fileCard.menu.deleteOption')
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-toolbar>

    <v-divider color="background" thickness="2" class="border-opacity-100" />

    <v-card-text class="pa-2">
      <div class="d-flex align-center">
        <v-icon icon="mdi-file" size="75" />

        <v-list density="compact">
          <file-card-description-item
            :title="t('fileCard.uploadDateLabel')"
            icon="mdi-calendar-month"
          >
            {{ file.uploadDate }}
          </file-card-description-item>

          <file-card-description-item
            :title="t('fileCard.expireAtLabel')"
            icon="mdi-calendar-clock"
          >
            {{ file.metadata.expireAt }}
          </file-card-description-item>

          <slot name="default" />
        </v-list>
      </div>
    </v-card-text>

    <v-card-actions v-if="$slots.actions">
      <slot name="actions" :file="file" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';

import FileCardDescriptionItem from './FileCardDescriptionItem.vue';

import { deleteFile } from '@/API/fileAPI';

type FileCardProps = {
  file: TUserFile;
};

type FileCardEmits = {
  (event: 'fileDeleted', file: TUserFile): void;
};

type FileCardSlots = {
  default(): void;
  actions(props: { file: TUserFile }): void;
};

const props = defineProps<FileCardProps>();

const emit = defineEmits<FileCardEmits>();

defineSlots<FileCardSlots>();

const { t } = useI18n();

const onFileDelete = async () => {
  await deleteFile(props.file._id);

  toast.success(
    t('fileCard.snackbar.fileDeleted', { filename: props.file.filename }),
  );
  emit('fileDeleted', props.file);
};
</script>
