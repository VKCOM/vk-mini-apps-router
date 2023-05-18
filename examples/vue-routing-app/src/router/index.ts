import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import bridge from '@vkontakte/vk-bridge';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/persik/:emotion?',
    name: 'persik',
    component: () => import(/* webpackChunkName: "persik" */ '../views/PersikView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  if (to.query?.vk_app_id && from.fullPath === '/') {
    return { path: to.hash.replace('#', '') || '/', replace: true };
  }
});
router.afterEach((to) => {
  bridge.send('VKWebAppSetLocation', {
    location: to.fullPath,
    replace_state: true,
  });
});
bridge.subscribe((event) => {
  if (event.detail.type === 'VKWebAppChangeFragment') {
    router.replace(event.detail.data.location);
  }
});

export default router;
