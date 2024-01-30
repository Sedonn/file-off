<template>
  <file-upload-dialog
    @file-uploaded="onFileUploaded"
    ref="fileUploadDialogRef"
  />

  <div
    v-if="!uploadedFiles"
    class="d-flex ga-2 flex-wrap"
  >
    <v-skeleton-loader
      v-for="index in 3"
      :key="index"
      elevation="3"
      width="330"
      type="heading, paragraph@2"
    />
  </div>
  <div
    v-else-if="!uploadedFiles.length"
    class="d-flex flex-column justify-center align-center h-100"
  >
    <div class="text-h4 text-surface">
      {{ t('userFilesPage.emptyUploads') }}
    </div>
  </div>
  <div
    v-else
    class="d-flex ga-2 flex-wrap"
  >
    <file-card
      v-for="file in uploadedFiles"
      :key="file._id"
      :file="file"
      @file-deleted="onFileDeleted"
    >
      <file-card-description-item
        :title="t('userFilesPage.fileCard.receiver')"
        icon="mdi-account"
      >
        {{ file.receiver.login }}
      </file-card-description-item>
    </file-card>
  </div>

  <v-btn
    class="ma-5"
    color="background"
    icon="mdi-plus"
    size="large"
    elevation="4"
    style="position: absolute; bottom: 0; right: 0"
    @click="openFileUploadDialog"
  />
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

import FileUploadDialog from '@/components/FileUploadDialog.vue';
import FileCard from '@/components/FileCard.vue';
import FileCardDescriptionItem from '@/components/FileCardDescriptionItem.vue';

import { getUploadedFiles } from '@/API/fileAPI';

const { t } = useI18n();

const fileUploadDialogRef = ref<InstanceType<typeof FileUploadDialog> | null>(
  null,
);

const openFileUploadDialog = () => fileUploadDialogRef.value?.open();

const uploadedFiles = ref<TUserUploadedFile[]>();

onBeforeMount(async () => {
  uploadedFiles.value = await getUploadedFiles();
});

const onFileUploaded = (file: TUserUploadedFile) =>
  uploadedFiles.value!.push(file);

const onFileDeleted = ({ _id }: TUserFile) => {
  const fileIndex = uploadedFiles.value!.findIndex((file) => file._id === _id);
  uploadedFiles.value!.splice(fileIndex, 1);
};
</script>
