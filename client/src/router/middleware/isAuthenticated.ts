import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { useUserStore } from '@/store/user';

export const isAuthenticated = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const userStore = useUserStore();

  if (!userStore.isAuthenticated) {
    return next({ name: 'Login' });
  }

  return next();
};
