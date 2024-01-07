<template>
  <div v-if="!downloadableFiles" class="d-flex ga-2 flex-wrap">
    <v-skeleton-loader
      v-for="index in 3"
      :key="index"
      elevation="3"
      width="330"
      type="heading, paragraph@2, actions"
    />
  </div>
  <div
    v-else-if="!downloadableFiles.length"
    class="d-flex flex-column justify-center align-center h-100"
  >
    <div class="text-h4 text-surface">
      {{ t('userDownloadsPage.emptyDownloads') }}
    </div>
  </div>
  <div v-else class="d-flex ga-2 flex-wrap">
    <file-card
      v-for="file in downloadableFiles"
      :key="file._id"
      :file="file"
      @file-deleted="onFileDeleted"
    >
      <file-card-description-item
        :title="t('userDownloadsPage.fileCard.sender')"
        icon="mdi-account"
      >
        {{ file.sender.login }}
      </file-card-description-item>

      <template #actions="{ file }">
        <v-btn
          prepend-icon="mdi-download"
          class="bg-surface-white"
          block
          @click="onFileDownload(file)"
        >
          {{ t('userDownloadsPage.fileCard.actions.download') }}
        </v-btn>
      </template>
    </file-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

import FileCard from '@/components/FileCard.vue';
import FileCardDescriptionItem from '@/components/FileCardDescriptionItem.vue';

import { getDownloadableFiles, downloadFile } from '@/API/fileAPI';

const { t } = useI18n();

const downloadableFiles = ref<TUserDownloadableFile[]>();

onBeforeMount(async () => {
  downloadableFiles.value = await getDownloadableFiles();
});

const onFileDeleted = ({ _id }: TUserFile) => {
  const fileIndex = downloadableFiles.value!.findIndex(
    (file) => file._id === _id,
  );
  downloadableFiles.value!.splice(fileIndex, 1);
};

const onFileDownload = async (file: TUserFile) => {
  await downloadFile(file);

  // The file will be automaticly deleted after downloading
  onFileDeleted(file);
};
</script>
