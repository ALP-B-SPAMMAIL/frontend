<template>
  <div class="app-container">
    <header class="header" v-if="!isSpecialPage">
      <div class="nav-container">
        <div class="logo-container">
          <img src="@/assets/kt_logo.png" alt="KT Logo" class="kt-logo" />
          <h1 class="logo">WhoWhoMail</h1>
        </div>
        <nav class="main-nav">
          <ul>
            <li><router-link to="/inbox">메일</router-link></li>
            <li><router-link to="/information">스팸정보제공</router-link></li>
          </ul>
        </nav>
      </div>
      <div class="user-controls">
        <div class="user-info" @click="toggleUserMenu">
          <span class="user-name">{{ userName }}</span>
          <span class="user-avatar">
            <img src="@/assets/icons/user.png" alt="User Icon" class="user-icon" />
          </span>
          <div class="user-menu" v-if="showUserMenu">
            <ul>
              <li><router-link to="/settings">설정</router-link></li>
              <li><button @click="logout" class="logout-btn">로그아웃</button></li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content" :class="{'no-header': isSpecialPage}">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const userName = ref('사용자');
const showUserMenu = ref(false);

const isSpecialPage = computed(() => {
  const specialRoutes = ['Welcome', 'Login', 'Register'];
  return specialRoutes.includes(route.name);
});

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const logout = () => {
  // Handle logout logic
  showUserMenu.value = false;
  // Redirect to login page after logout
  router.push('/welcome');
};

// Close user menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const userControls = document.querySelector('.user-controls');
    if (userControls && !userControls.contains(event.target)) {
      showUserMenu.value = false;
    }
  });
});
</script>

<style scoped>
.kt-logo {
  width: 32px;
  height: 20px;
  margin-right: 8px;
  display: block;
}
.logo-container {
  display: flex;
  align-items: center;
}
.logo {
  color: #1e3a8a;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  display: flex;
  align-items: center;
}

.logo-container {
  margin-right: 2rem;
}

.logo {
  color: #1e3a8a;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.main-nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.main-nav li {
  margin-right: 1.5rem;
}

.main-nav a {
  color: #1e3a8a;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
}

.main-nav a:hover {
  color: #2563eb;
}

.main-nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #2563eb;
  transition: width 0.3s;
}

.main-nav a:hover::after {
  width: 100%;
}

.user-controls {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 0.375rem;
}

.user-info:hover {
  background-color: #f1f5f9;
}

.user-name {
  margin-right: 0.5rem;
  font-weight: 500;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  background-color: #e2e8f0;
  border-radius: 50%;
}

.user-icon {
  color: #1e3a8a;
  width: 1rem;
  height: 1rem;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 10rem;
  background-color: #ffffff;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-top: 0.5rem;
  z-index: 10;
}

.user-menu ul {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.user-menu li {
  padding: 0;
}

.user-menu a,
.user-menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: #1e293b;
  text-decoration: none;
}

.user-menu a:hover,
.user-menu button:hover {
  background-color: #f1f5f9;
}

.logout-btn {
  color: #dc2626 !important;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  background-color: #f8fafc;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    padding: 0.75rem;
  }
  
  .nav-container {
    width: 100%;
    margin-bottom: 0.75rem;
  }
  
  .main-nav ul {
    flex-wrap: wrap;
  }
  
  .main-nav li {
    margin-right: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .user-controls {
    align-self: flex-end;
  }
}
.no-header {
  padding: 0; /* 헤더가 없을 때는 패딩 제거 */
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  background-color: #f8fafc;
}

.main-content.no-header {
  padding: 0;
}

</style>