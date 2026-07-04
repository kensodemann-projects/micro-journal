import { useAuthentication } from '@/core/authentication';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { Router } from 'vue-router';

vi.mock('@/core/authentication');

vi.mock('vue-router', async (importOriginal) => {
  const vueRouter = await importOriginal<typeof import('vue-router')>();
  return {
    ...vueRouter,
    createWebHistory: vueRouter.createMemoryHistory,
  };
});

vi.mock('vue-router/auto-routes', () => ({
  routes: [
    {
      path: '/',
      name: 'home',
      component: { template: '<div>Home</div>' },
      meta: {},
    },
    {
      path: '/login',
      name: 'login',
      component: { template: '<div>Login</div>' },
      meta: { allowAnonymous: true },
    },
  ],
}));

const loadRouter = async (): Promise<Router> => {
  return (await import('@/router/index')).default;
};

describe('router auth guard', () => {
  let router: Router;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('unauthenticated user', () => {
    const { isAuthenticated } = useAuthentication();

    beforeEach(async () => {
      (isAuthenticated as Mock).mockResolvedValue(false);
      router = await loadRouter();
    });

    it('redirects from a protected route to /login', async () => {
      await router.push('/');
      expect(isAuthenticated).toHaveBeenCalledOnce();
      expect(router.currentRoute.value.path).toBe('/login');
    });

    it('allows navigation to /login', async () => {
      await router.push('/login');
      expect(isAuthenticated).not.toHaveBeenCalled();
      expect(router.currentRoute.value.path).toBe('/login');
    });
  });

  describe('authenticated user', () => {
    const { isAuthenticated } = useAuthentication();

    beforeEach(async () => {
      (isAuthenticated as Mock).mockResolvedValue(true);
      router = await loadRouter();
    });

    it('allows navigation to a protected route', async () => {
      await router.push('/');
      expect(isAuthenticated).toHaveBeenCalledOnce();
      expect(router.currentRoute.value.path).toBe('/');
    });

    it('allows navigation to /login', async () => {
      await router.push('/login');
      expect(isAuthenticated).not.toHaveBeenCalled();
      expect(router.currentRoute.value.path).toBe('/login');
    });
  });
});
