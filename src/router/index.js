import { createRouter, createWebHistory } from 'vue-router';

import EmailView from '@/views/EmailView.vue';
import SpamInfoView from '@/views/SpamInfoView.vue';
import SettingsView from '@/views/SettingsView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import WelcomeView from '@/views/WelcomeView.vue';

const routes = [
  {
    path: '/',
    redirect: '/inbox'
  },
  {
    path: '/inbox',
    name: 'Inbox',
    component: EmailView
  },
  {
    path: '/information',
    name: 'SpamInfo',
    component: SpamInfoView
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    //meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    // meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/inbox'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for authentication
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('user') !== null;
  
//   // If route requires authentication and user is not authenticated
//   if (to.matched.some(record => record.meta.requiresAuth !== false) && !isAuthenticated) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;