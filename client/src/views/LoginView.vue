<template>
  <site-header />
  <v-card
    class="mt-9 pa-5"
    rounded="xl"
    width="350"
    :loading="uiController.isLoading"
  >
    <div class="d-flex justify-end">
      <change-language-button color="surface-white" />
    </div>

    <v-card-title class="text-h2 pa-10 text-center">
      {{ t('loginPage.title') }}
    </v-card-title>

    <v-form
      validate-on="submit"
      @submit.prevent="onSubmit"
      :disabled="uiController.isLoading"
    >
      <v-sheet>
        <v-text-field
          prepend-inner-icon="mdi-account"
          v-model="userCredentials.login"
          :rules="validationRules"
          :label="t('loginPage.form.loginLabel')"
        />
        <v-text-field
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          v-model="userCredentials.password"
          :rules="validationRules"
          :type="passwordVisible ? 'text' : 'password'"
          :label="t('loginPage.form.passwordLabel')"
          @click:append-inner="passwordVisible = !passwordVisible"
        />
        <v-checkbox
          v-model="userCredentials.remember"
          :label="t('loginPage.form.rememberLabel')"
        />
        <v-btn
          :disabled="uiController.isLoading"
          type="submit"
          class="bg-surface-white w-100"
          append-icon="mdi-login"
        >
          {{ t('loginPage.form.submitButtonLabel') }}
        </v-btn>
      </v-sheet>
    </v-form>
    <v-card-text class="text-body-1 text-center">
      {{ t('loginPage.registerMessage.text') }}
      <router-link
        class="text-white"
        to="/register"
      >
        {{ t('loginPage.registerMessage.link') }}
      </router-link>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import SiteHeader from '@/components/SiteHeader.vue';
import ChangeLanguageButton from '@/components/ChangeLanguageButton.vue';

import { useUserStore } from '@/store/user';
import { useUIController } from '@/store/ui';
import { loginUser } from '@/API/userAPI';
import { createEmptyFieldValidationRule } from '@/helpers/validation';

import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';

const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const uiController = useUIController();

const passwordVisible = ref(false);

const userCredentials = reactive<TUserCredentials>({
  login: '',
  password: '',
  remember: false,
});

const validationRules = computed(() => [
  createEmptyFieldValidationRule(t('validationErrors.emptyField')),
]);

const onSubmit = async (event: SubmitEventPromise) => {
  const { valid } = await event;

  if (!valid) {
    return;
  }

  try {
    const token = await loginUser(userCredentials);
    const { login, remember } = userCredentials;
    userStore.save(token, login, remember);

    router.push({ name: 'UserFiles' });
  } catch (error: unknown) {
    userCredentials.password = '';

    throw error;
  }
};
</script>
