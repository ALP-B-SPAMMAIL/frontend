<template>
    <div class="mail-permissions-form">
      <div class="form-header">
        <h3>메일 서버 연결 설정</h3>
        <p class="form-description">
          외부 메일 서버에 연결하여 이메일을 수신하고 관리할 수 있습니다.
        </p>
      </div>
      
      <div class="form-container">
        <div class="form-group">
          <label for="protocol">프로토콜</label>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                type="radio" 
                id="protocol-imaps" 
                name="protocol" 
                value="imaps" 
                v-model="mailSettings.protocol"
              />
              <span>IMAPS</span>
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                id="protocol-pop3" 
                name="protocol" 
                value="pop3" 
                v-model="mailSettings.protocol"
              />
              <span>POP3</span>
            </label>
          </div>
          <p class="form-help">
            <span v-if="mailSettings.protocol === 'imaps'">IMAPS: 서버에 이메일을 보관하고 여러 기기에서 동기화합니다.</span>
            <span v-else-if="mailSettings.protocol === 'pop3'">POP3: 이메일을 다운로드하고 서버에서 삭제합니다.</span>
            <span v-else>프로토콜을 선택하세요.</span>
          </p>
        </div>
        
        <div class="form-group">
          <label for="server">메일 서버 주소</label>
          <div class="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
              <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
              <path d="M22 6l-10 7L2 6"></path>
            </svg>
            <input 
              type="text" 
              id="server" 
              v-model="mailSettings.server" 
              placeholder="예: imap.gmail.com 또는 pop.gmail.com" 
              class="form-input"
            />
          </div>
          <p class="form-help">
            메일 서비스 제공자의 서버 주소를 입력하세요. (예: Gmail, Naver, Outlook 등)
          </p>
        </div>
        
        <div class="form-group">
          <label for="email">이메일 주소</label>
          <div class="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input 
              type="email" 
              id="email" 
              v-model="mailSettings.email" 
              placeholder="이메일 주소를 입력하세요" 
              class="form-input"
            />
          </div>
          <p class="form-help">
            메일 서비스를 제공받을 이메일 주소를 입력하세요.
          </p>
        </div>
        
        <div class="form-group">
          <label for="app-password">앱 비밀번호</label>
          <div class="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="app-password" 
              v-model="mailSettings.password" 
              placeholder="앱 비밀번호를 입력하세요" 
              class="form-input"
            />
            <button 
              type="button" 
              class="password-toggle" 
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
          <p class="form-help">
            일반 계정 비밀번호가 아닌 메일 서비스에서 제공하는 앱 비밀번호를 입력하세요.
            <a href="#" class="help-link" @click.prevent="showAppPasswordHelp = true">앱 비밀번호란?</a>
          </p>
        </div>
        
        <div class="form-actions">
          <button class="btn-secondary" @click="resetForm">취소</button>
          <button class="btn-primary" @click="saveSettings" :disabled="!isFormValid">저장</button>
        </div>
      </div>
      

      <div class="modal-overlay" v-if="showAppPasswordHelp" @click="showAppPasswordHelp = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>앱 비밀번호란?</h3>
            <button class="modal-close" @click="showAppPasswordHelp = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p>앱 비밀번호는 메일 서비스 제공자(Gmail, Naver 등)가 제공하는 특별한 비밀번호로, 보안이 강화된 계정에서 외부 앱이 메일에 접근할 수 있도록 합니다.</p>
            
            <h4>앱 비밀번호 생성 방법:</h4>
            
            <div class="provider-info">
              <h5>Gmail</h5>
              <ol>
                <li>Google 계정 관리 페이지에 접속</li>
                <li>보안 탭 선택</li>
                <li>2단계 인증 활성화</li>
                <li>'앱 비밀번호' 선택</li>
                <li>앱 이름 입력 후 생성</li>
              </ol>
            </div>
            
            <div class="provider-info">
              <h5>Naver</h5>
              <ol>
                <li>네이버 메일 설정에 접속</li>
                <li>POP3/IMAP 설정 선택</li>
                <li>'메일 앱 비밀번호' 생성</li>
              </ol>
            </div>
            
            <p class="warning-text">주의: 앱 비밀번호는 일반 비밀번호와 달리 노출되어도 계정 접근이 제한적이지만, 안전하게 보관하세요.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // Mail settings form data
  const mailSettings = ref({
    protocol: 'imaps',
    server: '',
    email: '',
    password: ''
  });
  
  const originalSettings = { ...mailSettings.value };
  const showPassword = ref(false);
  const showAppPasswordHelp = ref(false);
  
  // Form validation
  const isFormValid = computed(() => {
    return (
      mailSettings.value.protocol &&
      mailSettings.value.server &&
      mailSettings.value.email &&
      mailSettings.value.password
    );
  });
  
  // Methods
  const resetForm = () => {
    mailSettings.value = { ...originalSettings };
  };
  
  const saveSettings = () => {
    if (!isFormValid.value) return;
    
    // Here you would typically save the settings to your backend
    console.log('Saving mail settings:', mailSettings.value);
    
    // Show success message
    alert('메일 서버 설정이 저장되었습니다.');
    
    // Update original settings to reflect saved state
    originalSettings.protocol = mailSettings.value.protocol;
    originalSettings.server = mailSettings.value.server;
    originalSettings.email = mailSettings.value.email;
    originalSettings.password = mailSettings.value.password;
  };
  </script>
  
  <style scoped>
  .mail-permissions-form {
    width: 100%;
    max-width: 800px;
    margin: 0 auto; 
  }
  
  .form-header {
    margin-bottom: 2rem;
    text-align: left; 
    padding: 0 0.5rem; 
  }
  
  .form-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }
  
  .form-description {
    color: #64748b;
    margin: 0;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #f8fafc;
    border-radius: 0.5rem;
    padding: 1.75rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .form-group {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    align-items: center;
  }

  .form-label-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    }
  
  .form-group label {
    font-weight: 500;
    color: #1e293b;
  }
  
  .radio-group {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.25rem;
  }
  
  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
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
    background-color: #ffffff;
    box-sizing: border-box;
    height: 2.75rem;
  }
  
  .form-input:focus {
    border-color: #1e3a8a;
    outline: none;
    box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.1);
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
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .form-help {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0.25rem 0 0;
  }
  
  .help-link {
    color: #1e3a8a;
    text-decoration: none;
    margin-left: 0.5rem;
    font-weight: 500;
  }
  
  .help-link:hover {
    text-decoration: underline;
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
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 100px; 
    text-align: center;
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
    opacity: 0.7;
  }
  
  .btn-secondary {
    background-color: #f1f5f9;
    color: #1e293b;
  }
  
  .btn-secondary:hover {
    background-color: #e2e8f0;
  }
  
  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #ffffff;
    border-radius: 0.5rem;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }
  
  .modal-close {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
  }
  
  .modal-close:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .provider-info {
    margin-bottom: 1.5rem;
  }
  
  .provider-info h5 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
  }
  
  .provider-info ol {
    margin: 0;
    padding-left: 1.5rem;
  }
  
  .provider-info li {
    margin-bottom: 0.25rem;
  }
  
  .warning-text {
    color: #dc2626;
    font-size: 0.875rem;
    margin-top: 1.5rem;
  }
  
  @media (min-width: 768px) {
    .form-group {
        grid-template-columns: 180px 1fr;
        align-items: center;
    }
    
    .form-help {
        grid-column: 2;
        margin-top: 0.25rem;
    }
    .form-group label {
        padding-top: 0;
        line-height: 1.5;
    }
    
    .form-group:has(.radio-group) {
        align-items: start;
    }
    }

    @media (max-width: 768px) {
    .radio-group {
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .form-actions {
        flex-direction: column-reverse; /* 모바일에서는 버튼 순서 반대로 */
    }
    
    .btn-primary, 
    .btn-secondary {
        width: 100%; /* 모바일에서는 버튼 전체 너비 */
    }
}
  </style>