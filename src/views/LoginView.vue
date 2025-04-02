<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-header">
        <div class="logo-container">
          <h1 class="logo-text">WhoWhoMail</h1>
        </div>
        <h2 class="login-title">로그인</h2>
        <p class="login-subtitle">계정에 로그인하여 이메일을 안전하게 관리하세요.</p>
      </div>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="id">아이디</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/id2.png" alt="ID Icon" class="input-icon" width="18" height="18" />
            <input 
              type="id" 
              id="id" 
              v-model="id" 
              placeholder="아이디를 입력하세요" 
              class="form-input" 
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <div class="label-with-link">
            <label for="password">비밀번호</label>
          </div>
          <div class="input-with-icon">
            <img src="@/assets/icons/lock.png" alt="Password Icon" class="input-icon" width="18" height="18" />
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password" 
              placeholder="비밀번호를 입력하세요" 
              class="form-input" 
              required
            />
            <button 
              type="button" 
              class="password-toggle" 
              @click="showPassword = !showPassword"
            >
              <img v-if="showPassword" src="@/assets/icons/showpw.png" alt="Show Password" width="18" height="18" />
              <img v-else src="@/assets/icons/hidepw.png" alt="Hide Password" width="18" height="18" />
            </button>
          </div>
        </div>
        
        <button type="submit" class="btn-primary btn-full">로그인</button>
      </form>
      
      <div class="login-footer">
        <p>계정이 없으신가요? <router-link to="/register" class="signup-link">회원가입</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const id = ref('');
const password = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  try {
    const response = await api.loginUser({
      userFigureId: id.value,
      password: password.value
    });
    
    // 토큰 저장
    if (response.data.accessToken) {
      userStore.setUserSession(
        id.value,
        response.data.accessToken,
        response.data.userId
      );
      const mailInitInfo = await api.getMailInfoInitialized(response.data.userId);
      if (!mailInitInfo.initialized) {
        alert("메일 권한 설정 페이지로 이동합니다.");
        router.push('/initialize');
      }
      else router.push('/inbox');
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
  }
};
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 450px;
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  margin: 1rem;
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
}

.login-subtitle {
  color: #64748b;
  margin: 0;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.label-with-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #1e3a8a;
  outline: none;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0;
}

.btn-primary {
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1e40af;
}

.btn-full {
  width: 100%;
  padding: 0.875rem;
}

.login-footer {
  text-align: center;
  color: #64748b;
}

.signup-link {
  color: #1e3a8a;
  font-weight: 500;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem;
  }
}
</style>