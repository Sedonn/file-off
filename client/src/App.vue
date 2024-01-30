<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onErrorCaptured } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue3-toastify';

import { AxiosError, AxiosResponse } from 'axios';

import { TAPIErrorCode } from './@types/vue-i18n';

type ErrorResponse = {
  errorCode: TAPIErrorCode[];
};

const { t, locale, getLocaleMessage } = useI18n();

onErrorCaptured((error: AxiosError<ErrorResponse> | Error) => {
  if (error instanceof AxiosError && error.response?.data.errorCode) {
    const { data } = error.response as AxiosResponse<ErrorResponse>;
    const { APIErrors } = getLocaleMessage(locale.value);

    for (const error of data.errorCode) {
      if (error in APIErrors) {
        toast.error(t(`APIErrors.${error}`));
      } else {
        console.error(error);
        toast.error(t(`APIErrors.UNKNOWN_ERROR`));
      }
    }

    return false;
  }

  if (error instanceof AxiosError) {
    console.error(error);
    toast.error(t(`APIErrors.UNKNOWN_NETWORK_ERROR`));

    return false;
  }

  if (error instanceof Error) {
    console.error(error);
    toast.error(t(`APIErrors.UNKNOWN_ERROR`));

    return false;
  }
});
</script>
