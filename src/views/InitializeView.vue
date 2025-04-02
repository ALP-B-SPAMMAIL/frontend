<template>
    <div class="initialized-view">
      <div class="initialized-container">
        <div class="initialized-header">
          <div class="logo-container">
            <h1 class="logo-text">WhoWhoMail</h1>
          </div>
          <h2 class="initialized-title">메일 설정</h2>
          <p class="initialized-subtitle">WhoWhoMail을 사용하기 위한 메일 서버 설정을 완료해주세요.</p>
        </div>
        
        <div class="mail-permissions-form-container">
          <MailPermissionsForm 
            @save-settings="handleSaveSettings" 
            :isLoading="isLoading"
            :error="error"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user';
  import MailPermissionsForm from '@/components/MailPermissionsForm.vue';
  import api from '@/services/api';
  
  const router = useRouter();
  const userStore = useUserStore();
  const isLoading = ref(false);
  const error = ref(null);
  
  const handleSaveSettings = async (settings) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      await api.updateMailInfo({
        userId: userStore.userCode,
        ...settings
      });
      
      router.push('/inbox');
    } catch (err) {
      error.value = err.message || '메일 설정 저장 중 오류가 발생했습니다.';
      console.error('Error saving mail settings:', err);
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .initialized-view {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8fafc;
    padding: 1rem;
  }
  
  .initialized-container {
    width: 100%;
    max-width: 800px;
    background-color: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 2rem;
    box-sizing: border-box;
  }
  
  .initialized-header {
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
  
  .initialized-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem;
  }
  
  .initialized-subtitle {
    color: #64748b;
    margin: 0 0 1.5rem;
  }
  
  .mail-permissions-form-container {
    margin-bottom: 2rem;
  }
  
  .initialized-footer {
    text-align: center;
    color: #64748b;
  }
  
  .skip-link {
    color: #1e3a8a;
    font-weight: 500;
    text-decoration: none;
  }
  
  .skip-link:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    .initialized-container {
      padding: 1.5rem;
    }
  }
  </style>