/**
 * router/index.ts
 *
 * Automatic routes for ./src/pages/*.vue
 *
 * @description: Automatically generated routes from ./src/pages/*.vue. New pages are automatically added to the router requiring authentication.
 * New public routes that do not require authentication should set the `allowAnonymous` meta field within the `*.vue` file.
 *
 * @example:
 * <route lang="yaml">
 * meta:
 *   allowAnonymous: true
 * </route>
 */

import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import { routes } from 'vue-router/auto-routes';
import { useAuthentication } from '@/core/authentication';

const checkAuthStatus = async (to: RouteLocationNormalized) => {
  if (!to.meta.allowAnonymous) {
    const { isAuthenticated } = useAuthentication();
    if (!(await isAuthenticated())) {
      return '/login';
    }
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(checkAuthStatus);

export default router;
