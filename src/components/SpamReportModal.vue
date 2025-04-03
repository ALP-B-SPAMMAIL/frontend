<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>스팸 신고</h3>
        <button class="modal-close" @click="$emit('close')">
          <img src="@/assets/icons/close.png" alt="Close Icon" class="close-icon" width="18" height="18"/>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="spam-reason">스팸 신고 사유</label>
          <select id="spam-reason" v-model="reportReason" class="form-select">
            <option value="">선택하세요</option>
            <option value="피싱">피싱 메일</option>
            <option value="광고">광고성 메일</option>
            <option value="악성코드">악성코드 포함</option>
            <option value="성희롱/괴롭힘">성희롱/괴롭힘</option>
            <option value="other">기타</option>
          </select>
        </div>
        
        <div class="form-group" v-if="reportReason === 'other'">
          <label for="other-reason">기타 사유</label>
          <textarea 
            id="other-reason" 
            v-model="otherReason" 
            class="form-textarea" 
            rows="3"
            placeholder="구체적인 사유를 입력해주세요"
          ></textarea>
        </div>
        
        <div class="warning-box">
          <img src="@/assets/icons/warning_red.png" alt="Warning Icon" class="warning-icon" width="24" height="24"/>
          <p class="warning-text">스팸 신고 시 해당 메일은 스팸 메일함으로 이동되며, 향후 비슷한 메일이 차단될 수 있습니다.</p>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">취소</button>
        <button 
          class="btn-danger" 
          @click="handleSubmit"
          :disabled="!isValid"
        >
          신고하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  emailId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['close', 'submit']);

const reportReason = ref('');
const otherReason = ref('');

const isValid = computed(() => {
  if (reportReason.value === 'other') {
    return otherReason.value.trim().length > 0;
  }
  return reportReason.value !== '';
});

const handleSubmit = () => {
  if (!isValid.value) return;
  
  emit('submit', {
    emailId: props.emailId,
    reason: reportReason.value === 'other' ? otherReason.value : reportReason.value
  });
};
</script>

<style scoped>
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1e293b;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #1e293b;
  background-color: #ffffff;
}

.form-textarea {
  width: 95%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #1e293b;
  background-color: #ffffff;
  resize: vertical;
}

.warning-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #fff1f2;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
}

.warning-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.warning-text {
  color: #9f1239;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
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

.btn-danger:hover:not(:disabled) {
  background-color: #fecaca;
}

.btn-danger:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>