import { createRouter, createWebHistory } from 'vue-router';

import type { RouteRecordRaw } from 'vue-router';

import { isAuthenticated } from './middleware/isAuthenticated';
import { redirectAuthenticatedUser } from './middleware/redirectAuthenticatedUser';

export const dashboardRoutes = {
  path: '/user',
  component: () => import('@/layouts/DashboardLayout.vue'),
  beforeEnter: isAuthenticated,
  children: [
    {
      path: '/user',
      name: 'UserFiles',
      component: () => import('@/views/UserFilesView.vue'),
      meta: {
        pageTitleI18nKey: 'userFilesPage.title',
      },
    },
    {
      path: '/user/downloads',
      name: 'UserDownloads',
      component: () => import('@/views/UserDownloadsView.vue'),
      meta: {
        pageTitleI18nKey: 'userDownloadsPage.title',
      },
    },
  ],
} satisfies RouteRecordRaw;

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/BaseLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        beforeEnter: [redirectAuthenticatedUser],
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue'),
      },
    ],
  },
  dashboardRoutes,
] satisfies RouteRecordRaw[];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
