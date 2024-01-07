<template>
  <register-complete-dialog ref="registerCompleteDialogRef" />

  <site-header />

  <v-card
    class="my-9 pa-5 d-flex flex-column"
    rounded="xl"
    min-width="350"
    :loading="uiController.isLoading"
  >
    <div class="d-flex justify-end">
      <change-language-button color="surface-white" />
    </div>

    <v-card-title class="text-h2 pa-10 text-center">{{
      t('registerPage.title')
    }}</v-card-title>

    <v-form
      :disabled="uiController.isLoading"
      ref="formRef"
      validate-on="submit"
      @submit.prevent="onSubmit"
    >
      <v-sheet>
        <v-text-field
          v-model="newUser.name"
          :rules="validationRules"
          :label="t('registerPage.form.nameLabel')"
        />
        <v-text-field
          v-model="newUser.surname"
          :rules="validationRules"
          :label="t('registerPage.form.surnameLabel')"
        />
        <v-text-field
          v-model="newUser.login"
          :rules="validationRules"
          :label="t('registerPage.form.loginLabel')"
        />
        <v-text-field
          v-model="newUser.email"
          :rules="validationRules"
          :label="t('registerPage.form.emailLabel')"
        />
        <v-text-field
          type="password"
          v-model="newUser.password"
          :rules="validationRules"
          :label="t('registerPage.form.passwordLabel')"
        />
        <v-text-field
          type="password"
          v-model="confirmPassword"
          :rules="validationRules"
          :error-messages="confirmPasswordErrors"
          :label="t('registerPage.form.confirmPasswordLabel')"
        />
        <v-btn
          :disabled="uiController.isLoading"
          type="submit"
          class="bg-surface-white w-100"
          append-icon="mdi-account-plus"
          >{{ t('registerPage.form.submitButtonLabel') }}</v-btn
        >
      </v-sheet>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { VForm } from 'vuetify/lib/components/index.mjs';

import SiteHeader from '@/components/SiteHeader.vue';
import RegisterCompleteDialog from '@/components/RegisterCompleteDialog.vue';

import { useUIController } from '@/store/ui';
import { registerUser } from '@/API/userAPI';
import { createEmptyFieldValidationRule } from '@/helpers/validation';

import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';
import ChangeLanguageButton from '@/components/ChangeLanguageButton.vue';

const { t } = useI18n();
const uiController = useUIController();

const formRef = ref<InstanceType<typeof VForm>>();
const registerCompleteDialogRef =
  ref<InstanceType<typeof RegisterCompleteDialog>>();

const newUser = reactive<TUser>({
  name: '',
  surname: '',
  login: '',
  email: '',
  password: '',
});

const confirmPassword = ref<string>();
const confirmPasswordErrors = ref<string[] | null>(null);

const validationRules = computed(() => [
  createEmptyFieldValidationRule(t('validationErrors.emptyField')),
]);

const onSubmit = async (event: SubmitEventPromise) => {
  const { valid } = await event;

  if (!valid) {
    return;
  }

  if (newUser.password !== confirmPassword.value) {
    confirmPasswordErrors.value = [
      t('registerPage.form.errors.passwordsMismatch'),
    ];
    return;
  }

  confirmPasswordErrors.value = null;

  await registerUser(newUser);
  registerCompleteDialogRef.value?.open();
  formRef.value?.reset();
};
</script>
