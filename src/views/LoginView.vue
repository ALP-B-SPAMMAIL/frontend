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
          <label for="email">이메일</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/mail.png" alt="Email Icon" class="input-icon" width="18" height="18" />
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="이메일 주소를 입력하세요" 
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

// Simple form state
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

// Simple login handler (no actual functionality as requested)
const handleLogin = () => {
  console.log('Login attempt with:', { email: email.value, password: password.value, rememberMe: rememberMe.value });
  // In a real app, this would call an API or authentication service
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

.logo {
  width: 2rem;
  height: 2rem;
  margin-right: 0.75rem;
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

.forgot-password {
  font-size: 0.875rem;
  color: #1e3a8a;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
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

.remember-me {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #1e293b;
  font-size: 0.875rem;
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

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #64748b;
  font-size: 0.875rem;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: #e2e8f0;
}

.divider span {
  padding: 0 1rem;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-google {
  background-color: #ffffff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}

.btn-google:hover {
  background-color: #f8fafc;
}

.btn-kakao {
  background-color: #fee500;
  color: #191919;
  border: none;
}

.btn-kakao:hover {
  background-color: #fada0a;
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