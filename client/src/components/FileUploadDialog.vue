<template>
  <v-dialog
    v-model="isOpen"
    max-width="530"
    :persistent="uiController.isLoading"
  >
    <v-card :loading="uiController.isLoading">
      <v-toolbar
        color="surface"
        :title="t('fileUploadDialog.title')"
        density="compact"
      >
        <v-btn icon="mdi-close" @click="close" />
      </v-toolbar>

      <v-divider thickness="2" class="border-opacity-100" />

      <v-form
        :disabled="uiController.isLoading"
        class="pa-3"
        validate-on="submit"
        @submit.prevent="onSubmit"
      >
        <v-file-input
          v-model="formData.file"
          :rules="fileFieldValidationRules"
          :label="t('fileUploadDialog.form.fileLabel')"
        />

        <v-text-field
          v-model="formData.receiverLogin"
          :rules="receiverFieldValidationRules"
          prepend-inner-icon="mdi-account"
          :label="t('fileUploadDialog.form.receiverLabel')"
        />

        <v-radio-group
          :label="t('fileUploadDialog.form.expirePeriod.label')"
          v-model="formData.expirePeriod"
        >
          <v-radio
            :label="t('fileUploadDialog.form.expirePeriod.option.week')"
            value="week"
          />
          <v-radio
            :label="t('fileUploadDialog.form.expirePeriod.option.month')"
            value="month"
          />
          <v-radio
            :label="t('fileUploadDialog.form.expirePeriod.option.year')"
            value="year"
          />
        </v-radio-group>

        <v-btn
          :disabled="uiController.isLoading"
          type="submit"
          color="success"
          block
          append-icon="mdi-upload"
          >{{ t('fileUploadDialog.form.submitButton') }}</v-btn
        >
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';

import { useUIController } from '@/store/ui';
import { uploadFile } from '@/API/fileAPI';
import {
  createEmptyFieldValidationRule,
  createEmptyFileFieldValidationRule,
} from '@/helpers/validation';

import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';

type FileUploadDialogEmits = {
  (event: 'fileUploaded', file: TUserUploadedFile): void;
};

type UploadFileFromData = {
  file: File[] | undefined;
  receiverLogin: string;
  expirePeriod: string;
};

const emit = defineEmits<FileUploadDialogEmits>();

const { t } = useI18n();
const uiController = useUIController();

const isOpen = ref<boolean>(false);

const formData = reactive<UploadFileFromData>({
  file: undefined,
  receiverLogin: '',
  expirePeriod: '',
});

const receiverFieldValidationRules = computed(() => [
  createEmptyFieldValidationRule(t('validationErrors.emptyField')),
]);

const fileFieldValidationRules = computed(() => [
  createEmptyFileFieldValidationRule(t('validationErrors.emptyFileField')),
]);

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

defineExpose({
  open,
  close,
});

const onSubmit = async (event: SubmitEventPromise) => {
  const { valid } = await event;

  if (!valid) {
    return;
  }

  const { file, receiverLogin, expirePeriod } = formData;
  const newFile = await uploadFile(file![0], receiverLogin, expirePeriod);

  close();
  toast.success(
    t('fileUploadDialog.snackbar.fileUploaded', { filename: newFile.filename }),
  );
  emit('fileUploaded', newFile);
};
</script>
