<template>
    <div class="compose-overlay" v-if="isOpen">
      <div class="compose-container" :class="{ 'minimized': isMinimized }">
        <div class="compose-header">
          <h3>{{ isReply ? '답장 작성' : '새 메일 작성' }}</h3>
          <div class="compose-actions">
            <button class="action-btn minimize-btn" @click="toggleMinimize">
                <img v-if="isMinimized" 
                    src="@/assets/icons/maximize.png" 
                    alt="Maximize" 
                    width="16" 
                    height="16" />
                <img v-else 
                    src="@/assets/icons/minimize.png" 
                    alt="Minimize" 
                    width="16" 
                    height="16" />
            </button>
            <button class="action-btn close-btn" @click="closeCompose">
              <img src="@/assets/icons/close_white.png" alt="Close" width="16" height="16"/>
            </button>
          </div>
        </div>
        
        <div class="compose-body" v-show="!isMinimized">
          <div class="compose-form">
            <div class="form-group">
              <label for="recipient">받는 사람</label>
              <div class="email-tags-input">
                <div v-for="(email, index) in recipients" :key="index" class="email-tag">
                  <span>{{ email }}</span>
                  <button type="button" @click="removeRecipient(index)" class="remove-tag">&times;</button>
                </div>
                <input 
                  type="text" 
                  id="recipient" 
                  v-model="recipientInput" 
                  placeholder="이메일 주소를 입력 후 Enter로 구분" 
                  class="tag-input"
                  @keydown.enter.prevent="addRecipient"
                  @keydown.backspace="handleBackspace"
                  @paste="handlePaste"
                />
              </div>
            </div>
            
            
            <div class="form-group">
              <label for="subject">제목</label>
              <div class="input-container">
                <input 
                  type="text" 
                  id="subject" 
                  v-model="subject" 
                  placeholder="제목을 입력하세요" 
                  class="form-input"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="message">내용</label>
              <div class="input-container">
                <textarea 
                  id="message" 
                  v-model="message" 
                  placeholder="메일 내용을 입력하세요" 
                  class="form-textarea"
                  rows="10"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <div class="compose-footer" v-show="!isMinimized">          
          <div class="compose-actions">
            <button class="btn-secondary" @click="closeCompose">취소</button>
            <button class="btn-primary" @click="sendEmail">보내기</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, watch } from 'vue';
  import api from '@/services/api';
  import { useUserStore } from '@/stores/user';
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false
    },
    isReply: {
      type: Boolean,
      default: false
    },
    replyTo: {
      type: Object,
      default: () => ({})
    }
  });
  
  const emit = defineEmits(['close', 'send']);
  
  const recipients = ref([]);
  const recipientInput = ref('');

  // 답장일 경우 초기 받는 사람 설정
  watch(() => props.isReply, (newVal) => {
    if (newVal && props.replyTo.email) {
      recipients.value = [props.replyTo.email];
    }
  }, { immediate: true });

  const subject = ref(props.isReply ? `Re: ${props.replyTo.subject || ''}` : '');
  const message = ref('');
  const isMinimized = ref(false);

  // 이메일 주소 추가 함수
  const addRecipient = () => {
    const email = recipientInput.value.trim();
    if (email && isValidEmail(email) && !recipients.value.includes(email)) {
      recipients.value.push(email);
      recipientInput.value = '';
    } else if (email && !isValidEmail(email)) {
      alert('유효한 이메일 주소를 입력해주세요.');
    }
  };

    // 이메일 주소 삭제 함수
  const removeRecipient = (index) => {
    recipients.value.splice(index, 1);
  };

const handleBackspace = (event) => {
  if (recipientInput.value === '' && recipients.value.length > 0) {
    recipients.value.pop();
  }
};

const handlePaste = (event) => {
  event.preventDefault();
  const pastedText = event.clipboardData.getData('text');
  const emails = pastedText.split(/[,;\s]+/);
  
  emails.forEach(email => {
    const trimmedEmail = email.trim();
    if (trimmedEmail && isValidEmail(trimmedEmail) && !recipients.value.includes(trimmedEmail)) {
      recipients.value.push(trimmedEmail);
    }
  });
};


const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const closeCompose = () => {
  emit('close');
};

const resetForm = () => {
  recipients.value = [];
  recipientInput.value = '';
  subject.value = '';
  message.value = '';
};

const sendEmail = async () => {
  try {
    const userStore = useUserStore();
    const fromUserId = userStore.userCode;
    console.log('User ID from store:', fromUserId);
    
    if (!fromUserId) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    if (recipients.value.length === 0) {
      alert('받는 사람을 입력해주세요.');
      return;
    }
    
    if (!subject.value.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!message.value.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    
    // SendMailDto 형식에 맞게 데이터 구성
    const sendMailDto = {
      to: recipients.value[0], // 단일 수신자로 변경
      subject: subject.value,
      content: message.value
    };
    
    try {
      await api.sendMail(fromUserId, sendMailDto);
      emit('send', sendMailDto);
      alert('메일이 성공적으로 전송되었습니다.');
      closeCompose();
      resetForm();
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('메일 전송에 실패했습니다. 다시 시도해주세요.');
      resetForm();
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    alert('메일 전송에 실패했습니다. 다시 시도해주세요.');
    resetForm();
  }
};

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
};
</script>
  
<style scoped>
.compose-overlay {
  position: fixed;
  bottom: 0;
  right: 2rem;
  z-index: 1000;
}

.compose-container {
  width: 600px;
  background-color: #ffffff;
  border-radius: 0.5rem 0.5rem 0 0;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.compose-container.minimized {
  width: 300px;
}

.compose-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #1e3a8a;
  color: white;
  border-radius: 0.5rem 0.5rem 0 0;
}

.compose-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.compose-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.compose-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.compose-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
}

.input-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.375rem;
  gap: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: #ffffff;
  transition: border-color 0.2s;
}

.input-container:focus-within {
  border-color: #1e3a8a;
}

.form-input,
.form-textarea {
  width: 100%;
  border: none;
  outline: none;
  font-size: 0.875rem;
  padding: 0.375rem 0;
  background: transparent;
}

.form-textarea {
  resize: vertical;
  min-height: 150px;
}

.attachment-section {
  margin-top: 1rem;
}

.attachment-section h4 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.attachment-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attachment-size {
  color: #64748b;
  margin: 0 0.75rem;
}

.remove-attachment {
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

.remove-attachment:hover {
  color: #dc2626;
  background-color: #fee2e2;
}

.compose-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.compose-tools {
  display: flex;
  gap: 1rem;
}

.attachment-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #f1f5f9;
  border-radius: 0.375rem;
  color: #1e293b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.attachment-btn:hover {
  background-color: #e2e8f0;
}

.hidden-input {
  display: none;
}

.ai-assist-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #f0f9ff;
  border: none;
  border-radius: 0.375rem;
  color: #0369a1;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ai-assist-btn:hover {
  background-color: #e0f2fe;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #1e3a8a;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #1e40af;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #1e293b;
  border: none;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

@media (max-width: 768px) {
  .compose-overlay {
    right: 0;
    left: 0;
  }
  
  .compose-container {
    width: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
  }
  
  .compose-container.minimized {
    width: 100%;
  }
}
.email-tags-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.375rem;
  gap: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: #ffffff;
  transition: border-color 0.2s;
}

.email-tags-input:focus-within {
  border-color: #1e3a8a;
}

.email-tag {
  display: flex;
  align-items: center;
  background-color: #e0f2fe;
  color: #0284c7;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.remove-tag {
  background: none;
  border: none;
  color: #0284c7;
  margin-left: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-tag:hover {
  color: #dc2626;
}

.tag-input {
  flex: 1;
  min-width: 100px;
  border: none;
  outline: none;
  font-size: 0.875rem;
  padding: 0.375rem 0;
}
</style>