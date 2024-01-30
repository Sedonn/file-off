/** @fileoverview Configuration of the general API service. */

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { useUserStore } from '@/store/user';
import { API_URL } from '@/config';
import { useUIController } from '@/store/ui';

export const APIService = axios.create({
  baseURL: API_URL,
});

APIService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore();
    const uiController = useUIController();

    uiController.startLoading();

    config.headers.Authorization = userStore.isAuthenticated
      ? `Bearer ${userStore.token}`
      : undefined;

    return config;
  },
  (error: AxiosError) => {
    const uiController = useUIController();
    uiController.stopLoading();

    return Promise.reject(error);
  },
);

APIService.interceptors.response.use(
  (response: AxiosResponse) => {
    const uiController = useUIController();

    uiController.stopLoading();

    return response;
  },
  (error: AxiosError) => {
    const userStore = useUserStore();
    const uiController = useUIController();
    uiController.stopLoading();

    if (error.response?.status === 401) {
      userStore.logout();
    }

    return Promise.reject(error);
  },
);
