import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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
  (error) => {
    const uiController = useUIController();
    uiController.stopLoading();

    return Promise.reject(error);
  },
);

APIService.interceptors.response.use(
  (response: AxiosResponse) => {
    const userStore = useUserStore();
    const uiController = useUIController();

    uiController.stopLoading();

    if (response.status === 401) {
      userStore.logout();
    }

    return response;
  },
  (error) => {
    const uiController = useUIController();
    uiController.stopLoading();

    return Promise.reject(error);
  },
);
