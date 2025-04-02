import { createRouter, createWebHistory } from 'vue-router';
import WelcomeView from '@/views/WelcomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import EmailView from '@/views/EmailView.vue';
import SpamInfoView from '@/views/SpamInfoView.vue';
import SettingsView from '@/views/SettingsView.vue';
import InitailizeView from '@/views/InitializeView.vue';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/welcome'
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: WelcomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/initialize',
      name: 'Initialize',
      component: InitailizeView
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
    {
      path: '/inbox',
      name: 'Inbox',
      component: EmailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/information',
      name: 'SpamInfo',
      component: SpamInfoView,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView,
      meta: { requiresAuth: true }
    }
  ]
});

// 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !userStore.isLoggedIn) {
    // 인증이 필요한 페이지에 접근하려고 하는데 로그인하지 않은 경우
    next('/login');
  } else if (userStore.isLoggedIn && (to.name === 'Login' || to.name === 'Register')) {
    // 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하려는 경우
    next('/inbox');
  } else {
    next();
  }
});

export default router;