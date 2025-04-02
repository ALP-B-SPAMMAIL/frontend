<template>
  <div class="settings-view">
    <!-- Settings Sidebar -->
    <div class="settings-sidebar">
      <h2 class="sidebar-title">설정</h2>
      <nav class="settings-nav">
        <ul>
          <li 
            v-for="section in settingsSections" 
            :key="section.id"
            :class="{ active: activeSection === section.id }"
            @click="activeSection = section.id"
          >
            <div class="nav-item">
              <span class="nav-icon">
                <img v-if="section.id === 'personal'" src="@/assets/icons/user2.png" alt="User Icon" width="18" height="18" />
                <img v-else-if="section.id === 'password'" src="@/assets/icons/lock.png" alt="Lock Icon" width="18" height="18" />
                <img v-else-if="section.id === 'permissions'" src="@/assets/icons/shield.png" alt="Shield Icon" width="18" height="18" />
                <img v-else-if="section.id === 'delete'" src="@/assets/icons/remove-user.png" alt="Trash Icon" width="18" height="18" />
              </span>
              <span>{{ section.name }}</span>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    
    <!-- Settings Content -->
    <div class="settings-content">
      <!-- Personal Info Section -->
      <div v-if="activeSection === 'personal'" class="settings-section">
        <h2 class="section-title">개인 정보 수정</h2>
        
        <div class="form-container">
          <div class="form-group">
            <label for="name">이름</label>
            <input type="text" id="name" v-model="personalInfo.name" class="form-input" />
          </div>
          
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" v-model="personalInfo.email" class="form-input" disabled />
            <p class="form-help">이메일은 변경할 수 없습니다.</p>
          </div>
          
          <div class="form-group">
            <label for="timezone">시간대</label>
            <select id="timezone" v-model="personalInfo.timezone" class="form-select">
              <option value="Asia/Seoul">서울 (GMT+9)</option>
              <option value="America/New_York">뉴욕 (GMT-5)</option>
              <option value="Europe/London">런던 (GMT+0)</option>
              <option value="Asia/Tokyo">도쿄 (GMT+9)</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button class="btn-secondary" @click="resetPersonalInfo">취소</button>
            <button class="btn-primary" @click="savePersonalInfo">저장</button>
          </div>
        </div>
      </div>
      
      <!-- Password Change Section -->
      <div v-if="activeSection === 'password'" class="settings-section">
        <h2 class="section-title">비밀번호 변경</h2>
        
        <div class="form-container">
          <div class="form-group">
            <label for="current-password">현재 비밀번호</label>
            <input type="password" id="current-password" v-model="passwordChange.current" class="form-input" />
          </div>
          
          <div class="form-group">
            <label for="new-password">새 비밀번호</label>
            <input type="password" id="new-password" v-model="passwordChange.new" class="form-input" />
            <p class="form-help">비밀번호는 8자 이상이어야 하며, 숫자와 특수문자를 포함해야 합니다.</p>
          </div>
          
          <div class="form-group">
            <label for="confirm-password">비밀번호 확인</label>
            <input type="password" id="confirm-password" v-model="passwordChange.confirm" class="form-input" />
          </div>
          
          <div class="password-strength" v-if="passwordChange.new">
            <div class="strength-label">비밀번호 강도:</div>
            <div class="strength-meter">
              <div 
                class="strength-value" 
                :style="{ width: passwordStrength + '%' }"
                :class="strengthClass"
              ></div>
            </div>
            <div class="strength-text" :class="strengthClass">{{ strengthText }}</div>
          </div>
          
          <div class="form-actions">
            <button class="btn-secondary" @click="resetPasswordForm">취소</button>
            <button class="btn-primary" @click="changePassword" :disabled="!isPasswordValid">변경</button>
          </div>
        </div>
      </div>
      
      <!-- Mail Permissions Section -->
      <div v-if="activeSection === 'permissions'" class="settings-section">
        <h2 class="section-title">메일 권한 설정</h2>
        <MailPermissionsForm 
          @save-settings="handleSaveMailSettings"
          :isLoading="isMailSettingsLoading"
          :error="mailSettingsError"
        />
      </div>
      
      <!-- Account Deletion Section -->
      <div v-if="activeSection === 'delete'" class="settings-section">
        <h2 class="section-title">회원 탈퇴</h2>
        
        <div class="warning-box">
          <div class="warning-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="warning-content">
            <h3>주의: 계정 삭제는 되돌릴 수 없습니다</h3>
            <p>계정을 삭제하면 모든 메일, 연락처, 설정이 삭제됩니다. 이 작업은 취소할 수 없습니다.</p>
          </div>
        </div>
        
        <div class="form-container">
          <div class="form-group">
            <label for="delete-reason">탈퇴 이유 (선택사항)</label>
            <select id="delete-reason" v-model="deleteAccount.reason" class="form-select">
              <option value="">선택하세요</option>
              <option value="not-using">더 이상 사용하지 않음</option>
              <option value="another-service">다른 서비스 이용</option>
              <option value="not-satisfied">서비스 불만족</option>
              <option value="privacy">개인정보 보호 우려</option>
              <option value="other">기타</option>
            </select>
          </div>
          
          <div class="form-group" v-if="deleteAccount.reason === 'other'">
            <label for="delete-reason-other">기타 이유</label>
            <textarea id="delete-reason-other" v-model="deleteAccount.otherReason" class="form-textarea" rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label for="delete-password">비밀번호 확인</label>
            <input type="password" id="delete-password" v-model="deleteAccount.password" class="form-input" />
            <p class="form-help">계정 삭제를 확인하려면 현재 비밀번호를 입력하세요.</p>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="deleteAccount.confirm">
              <span>계정 삭제의 결과를 이해했으며, 모든 데이터가 영구적으로 삭제된다는 것에 동의합니다.</span>
            </label>
          </div>
          
          <div class="form-actions">
            <button class="btn-secondary" @click="resetDeleteForm">취소</button>
            <button class="btn-danger" @click="confirmDelete" :disabled="!canDelete">계정 삭제</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import MailPermissionsForm from '@/components/MailPermissionsForm.vue';
import api from '@/services/api';
import localStorageUtil from '@/services/localStorage';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const isMailSettingsLoading = ref(false);
const mailSettingsError = ref(null);
const userStore = useUserStore();

const settingsSections = [
  // { id: 'personal', name: '개인 정보 수정' },
  { id: 'password', name: '비밀번호 변경' },
  { id: 'permissions', name: '메일 권한 설정' },
  { id: 'delete', name: '회원 탈퇴' }
];

// Active section
const activeSection = ref('personal');

// Personal info form (simplified)
const personalInfo = ref({
  name: '사용자',
  email: 'hong.gildong@example.com',
  timezone: 'Asia/Seoul'
});

const originalPersonalInfo = { ...personalInfo.value };

const resetPersonalInfo = () => {
  personalInfo.value = { ...originalPersonalInfo };
};

const savePersonalInfo = () => {
  // Save logic would go here
  alert('개인 정보가 저장되었습니다.');
};

// Password change form
const passwordChange = ref({
  current: '',
  new: '',
  confirm: ''
});

const passwordStrength = computed(() => {
  if (!passwordChange.value.new) return 0;
  
  let strength = 0;
  const password = passwordChange.value.new;
  
  // Length check
  if (password.length >= 8) strength += 25;
  
  // Contains number
  if (/\d/.test(password)) strength += 25;
  
  // Contains lowercase
  if (/[a-z]/.test(password)) strength += 25;
  
  // Contains uppercase or special char
  if (/[A-Z]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 25;
  
  return strength;
});

const strengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 50) return 'weak';
  if (strength < 75) return 'medium';
  return 'strong';
});

const strengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 50) return '약함';
  if (strength < 75) return '보통';
  return '강함';
});

const isPasswordValid = computed(() => {
  return (
    passwordChange.value.current && 
    passwordChange.value.new && 
    passwordChange.value.new === passwordChange.value.confirm &&
    passwordStrength.value >= 50
  );
});

const resetPasswordForm = () => {
  passwordChange.value = {
    current: '',
    new: '',
    confirm: ''
  };
};

const changePassword = () => {
  if (!isPasswordValid.value) return;
  // Password change logic would go here
  alert('비밀번호가 변경되었습니다.');
  resetPasswordForm();
};

// Account deletion
const deleteAccount = ref({
  reason: '',
  otherReason: '',
  password: '',
  confirm: false
});

const canDelete = computed(() => {
  return deleteAccount.value.password && deleteAccount.value.confirm;
});

const resetDeleteForm = () => {
  deleteAccount.value = {
    reason: '',
    otherReason: '',
    password: '',
    confirm: false
  };
};

const confirmDelete = async () => {
  if (!canDelete.value) return;
  
  if (confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    try {
      // 로그인 시 localStorage 연결?
      const userId = localStorageUtil.getUserId();
      
      await api.deleteUser(userId, {
        password: deleteAccount.value.password
      });
      
      alert('계정이 성공적으로 삭제되었습니다.');
      
      // 로그아웃 처리 (로컬 스토리지 정리)
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      
      router.push('/welcome');
    } catch (error) {
      alert('계정 삭제에 실패했습니다: ' + (error.message || '알 수 없는 오류가 발생했습니다'));
      console.error('계정 삭제 오류:', error);
    }
  }
};

const handleSaveMailSettings = async (settings) => {
  try {
    isMailSettingsLoading.value = true;
    mailSettingsError.value = null;
    
    // const userId = userStore.userCode;
    
    // API 호출하여 메일 설정 저장
    await api.updateMailInfo({
      userId: userStore.userCode,
      ...settings
    });
    
    alert('메일 설정이 성공적으로 저장되었습니다.');
  } catch (err) {
    mailSettingsError.value = err.message || '메일 설정 저장 중 오류가 발생했습니다.';
    console.error('Error saving mail settings:', err);
  } finally {
    isMailSettingsLoading.value = false;
  }
};
</script>

<style scoped>
.settings-view {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1px;
  height: calc(100vh - 5rem);
  background-color: #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
}

/* Settings Sidebar */
.settings-sidebar {
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 1.5rem 0;
}

.sidebar-title {
  padding: 0 1.5rem 1.5rem;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
}

.settings-nav ul {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
}

.settings-nav li {
  cursor: pointer;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #64748b;
  transition: background-color 0.2s, color 0.2s;
}

.nav-item:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.settings-nav li.active .nav-item {
  background-color: #e2e8f0;
  color: #1e3a8a;
  font-weight: 500;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

/* Settings Content */
.settings-content {
  background-color: #ffffff;
  padding: 2rem;
  overflow-y: auto;
}

.settings-section {
  max-width: 800px;
}

.section-title {
  margin: 0 0 2rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #1e293b;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #1e3a8a;
  outline: none;
}

.form-input:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-help {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #1e3a8a;
  color: white;
}

.btn-primary:hover {
  background-color: #1e40af;
}

.btn-primary:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #1e293b;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.btn-danger {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn-danger:hover {
  background-color: #fecaca;
}

.btn-danger:disabled {
  background-color: #fef2f2;
  color: #ef4444;
  cursor: not-allowed;
}

/* Password Strength Meter */
.password-strength {
  margin-top: 0.5rem;
}

.strength-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.strength-meter {
  height: 0.5rem;
  background-color: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.strength-value {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s;
}

.strength-value.weak {
  background-color: #ef4444;
}

.strength-value.medium {
  background-color: #f59e0b;
}

.strength-value.strong {
  background-color: #10b981;
}

.strength-text {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  text-align: right;
}

.strength-text.weak {
  color: #ef4444;
}

.strength-text.medium {
  color: #f59e0b;
}

.strength-text.strong {
  color: #10b981;
}

/* Empty Section */
.empty-section {
  min-height: 200px;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  margin-top: 0.25rem;
}

/* Warning Box */
.warning-box {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #fff1f2;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.warning-icon {
  color: #dc2626;
  flex-shrink: 0;
}

.warning-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #dc2626;
}

.warning-content p {
  margin: 0;
  color: #9f1239;
}

@media (max-width: 768px) {
  .settings-view {
    grid-template-columns: 1fr;
  }
  
  .settings-sidebar {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 0;
  }
  
  .sidebar-title {
    padding: 0 1rem 1rem;
  }
  
  .settings-nav ul {
    display: flex;
    overflow-x: auto;
    padding: 0 1rem;
  }
  
  .nav-item {
    white-space: nowrap;
    padding: 0.5rem 1rem;
  }
  
  .settings-content {
    padding: 1.5rem;
  }
}
</style>