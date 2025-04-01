<template>
  <div class="email-view">
    <div class="email-sidebar">
      <div class="sidebar-header">
        <button class="compose-btn" @click="openComposeEmail">
          <span>새 메일 작성</span>
        </button>
      </div>
      
      <nav class="folder-nav">
        <ul>
          <li 
            v-for="folder in folders" 
            :key="folder.id"
            :class="{ active: currentFolder === folder.id }"
            @click="selectFolder(folder.id)"
          >
            <img v-if="folder.icon === 'inbox'" 
              src="@/assets/icons/mail.png" 
              alt="Inbox Icon" 
              class="folder-icon"
            />
            <img v-else-if="folder.icon === 'shield'" 
              src="@/assets/icons/shield.png" 
              alt="Spam Icon" 
              class="folder-icon"
            />
            <img v-else-if="folder.icon === 'trash'" 
              src="@/assets/icons/trash.png" 
              alt="Trash Icon" 
              class="folder-icon"
            />
            <span>{{ folder.name }}</span>
            <!-- 폴더에 이메일이 있는 경우에만 카운트 표시 -->
            <span v-if="folderCounts[folder.id] > 0" class="folder-count">
              {{ folderCounts[folder.id] }}
            </span>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-section">
        <h3>라벨</h3>
        <ul class="label-list">
          <li v-for="label in labels" :key="label.id" :style="{ color: label.color }">
            <span class="label-dot" :style="{ backgroundColor: label.color }"></span>
            <span>{{ label.name }}</span>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="email-list">
      <div class="email-list-header">
        <h2>{{ folderTitle }}</h2>
        <div class="email-controls">
          <div class="search-bar">
            <img src="@/assets/icons/search.png" alt="Search Icon" class="search-icon" />
            <input type="text" placeholder="메일 검색" v-model="searchQuery" />
          </div>
          <button class="refresh-icon" @click="refreshEmails">
            <img src="@/assets/icons/refresh.png" alt="Refresh Icon" class="refresh-icon" />
          </button>
        </div>
      </div>
      
      <div class="email-list-content">
        <div 
          v-for="email in filteredEmails" 
          :key="email.id" 
          class="email-item"
          :class="{ unread: !email.read, selected: selectedEmail === email.id }"
          @click="toggleEmailSelection(email.id)"
          @mousemove="updateMousePosition"
          @mouseenter="hoveredEmail = email.id"
          @mouseleave="hoveredEmail = null"
        >
          <div class="email-sender">
            <span class="sender-avatar">{{ email.sender.charAt(0) }}</span>
          </div>
          <div class="email-content">
            <div class="email-header">
              <span class="email-subject">{{ email.subject }}</span>
              <span class="email-time">{{ email.time }}</span>
            </div>
            <div class="email-sender-name">{{ email.sender }}</div>
            <div class="email-address">{{ email.email }}</div>
            <div class="email-preview">{{ email.preview }}</div>
          </div>
          
          <!-- AI Summary Tooltip -->
          <div 
            v-if="hoveredEmail === email.id && email.aiSummary" 
            class="ai-summary-tooltip"
            :style="{ top: mouseY + 'px', left: mouseX + 'px' }"
          >
            <div class="tooltip-header">
              <img src="@/assets/icons/ai.png" alt="AI Icon" class="tooltip-icon" />
              <span>AI 요약</span>
            </div>
            <p>{{ email.aiSummary }}</p>
          </div>
        </div>
        
        <div v-if="filteredEmails.length === 0" class="no-emails">
          <img src="@/assets/icons/noemail.png" alt="No Emails Icon" class="no-emails-icon" />
          <p>{{ noEmailsMessage }}</p>
        </div>
      </div>
    </div>
    
    <!-- Email Detail -->
    <div class="email-detail" v-if="currentEmail">
      <!-- 이메일 액션 버튼들 - 제목 위로 이동 -->
      <div class="email-actions">
        <!-- Not in Trash Can -->
        <template v-if="currentFolder !== 'trash'">
          <button class="action-btn reply-btn" @click="replyToCurrentEmail(currentEmail)">
            <img src="@/assets/icons/reply.png" alt="Reply Icon" class="action-icon" />
            <span>답장</span>
          </button>
          <button class="action-btn forward-btn">
            <img src="@/assets/icons/forward.png" alt="Forward Icon" class="action-icon" />
            <span>전달</span>
          </button>
          <button v-if="currentFolder === 'spam'" class="action-btn not-spam-btn" @click="markAsNotSpam(currentEmail.id)">
            <img src="@/assets/icons/shield.png" alt="Shield Icon" class="action-icon" />
            <span>스팸 아님</span>
          </button>
          <button v-else class="action-btn spam-btn" @click="markAsSpam(currentEmail.id)">
            <img src="@/assets/icons/report.png" alt="Report Icon" class="action-icon" />
            <span>스팸 신고</span>
          </button>
        </template>
        
        <!-- In Trash Can -->
        <template v-else>
          <button class="action-btn spam-btn" @click="markAsSpam(currentEmail.id)">
            <img src="@/assets/icons/report.png" alt="Report Icon" class="action-icon" />
            <span>스팸 신고</span>
          </button>
          <button class="action-btn restore-btn" @click="restoreEmail(currentEmail.id)">
            <img src="@/assets/icons/restore.png" alt="Restore Icon" class="action-icon" />
            <span>복구</span>
          </button>
        </template>
        
        <!-- 삭제 버튼은 모든 폴더에 표시 -->
        <button class="action-btn delete-btn" @click="deleteEmail(currentEmail.id)">
          <img src="@/assets/icons/trash.png" alt="Trash Icon" class="action-icon" />
          <span>{{ currentFolder === 'trash' ? '영구 삭제' : '삭제' }}</span>
        </button>
      </div>
      
      <div class="email-detail-header">
        <h2>{{ currentEmail.subject }}</h2>
      </div>
            
      <div class="email-detail-info">
        <div class="sender-info">
          <span class="sender-avatar large">{{ currentEmail.sender.charAt(0) }}</span>
          <div>
            <div class="sender-name">{{ currentEmail.sender }}</div>
            <div class="sender-email">{{ currentEmail.email }}</div>          
          </div>
        </div>
        <div class="email-date">{{ currentEmail.time }}</div>
      </div>
      
      <div class="email-body" v-html="currentEmail.html"></div>
          
      <div v-if="currentEmail.aiSummary" class="ai-summary">
        <h3>
          <img src="@/assets/icons/ai.png" alt="AI Icon" class="mail-control-icon" />
          AI 요약
        </h3>
        <p>{{ currentEmail.aiSummary }}</p>
      </div>
      
      <div v-if="currentFolder === 'spam'" class="spam-info">
        <h3>
          <img src="@/assets/icons/warning_red.png" alt="Warning Icon" class="warning-icon" />
          스팸 정보
        </h3>
        <div class="spam-details">
          <div class="spam-detail-item">
            <span class="detail-label">위험 수준:</span>
            <span class="detail-value high">높음</span>
          </div>
          <div class="spam-detail-item">
            <span class="detail-label">유형:</span>
            <span class="detail-value">피싱</span>
          </div>
          <div class="spam-detail-item">
            <span class="detail-label">신고 횟수:</span>
            <span class="detail-value">127회</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Compose Email Component -->
    <ComposeEmail 
      :isOpen="showComposeEmail" 
      :isReply="isReply"
      :replyTo="replyToEmail"
      @close="closeComposeEmail"
      @send="handleSendEmail"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ComposeEmail from '@/components/ComposeEmail.vue';
import api from '@/services/api';

// Sample data
const folders = [
  { id: 'inbox', name: '받은 메일함', icon: 'inbox'},
  { id: 'spam', name: '스팸 메일함', icon: 'shield'},
  { id: 'trash', name: '휴지통', icon: 'trash' }
];

const folderCounts = computed(() => {
  const counts = {
    inbox: 0,
    spam: 0,
    trash: 0
  };
  
  // 각 폴더의 이메일 수 계산
  emails.value.forEach(email => {
    if (counts[email.folder] !== undefined) {
      counts[email.folder]++;
    }
  });
  
  return counts;
});

const labels = [
  { id: 'work', name: '업무', color: '#2563eb' },
  { id: 'personal', name: '개인', color: '#10b981' },
  { id: 'important', name: '중요', color: '#ef4444' },
  { id: 'bills', name: '청구서', color: '#f59e0b' }
];

const emails = ref([]);

// Reactive state
const currentFolder = ref('inbox');
const selectedEmail = ref(null);
const searchQuery = ref('');
const hoveredEmail = ref(null);
const mouseX = ref(0);
const mouseY = ref(0);
const showComposeEmail = ref(false);
const isReply = ref(false);
const replyToEmail = ref({});

const refreshEmails = () => {
  fetchEmails();
};

onMounted(() => {
  fetchEmails();
});

// Computed properties
const folderTitle = computed(() => {
  const folder = folders.find(f => f.id === currentFolder.value);
  return folder ? folder.name : '';
});

const filteredEmails = computed(() => {
  if (!emails.value) return [];
  return emails.value
    .filter(email => email.folder === currentFolder.value)
    .filter(email => {
      if (!searchQuery.value) return true;
      const query = searchQuery.value.toLowerCase();
      return (
        (email.sender?.toLowerCase() || '').includes(query) ||
        (email.subject?.toLowerCase() || '').includes(query) ||
        (email.preview?.toLowerCase() || '').includes(query)
      );
    });
});

const currentEmail = computed(() => {
  if (!selectedEmail.value || !emails.value) return null;
  return emails.value.find(email => email.id === selectedEmail.value) || null;
});

const noEmailsMessage = computed(() => {
  if (searchQuery.value) {
    return '검색 결과가 없습니다.';
  }
  return currentFolder.value === 'inbox' ? '받은 메일이 없습니다.' : '스팸 메일이 없습니다.';
});

// Methods
const selectFolder = (folderId) => {
  currentFolder.value = folderId;
  selectedEmail.value = null;
};

const parseMailSender = (mailSender) => {
  if (!mailSender) return { name: 'Unknown Sender', email: '' };
  
  // "이름" <이메일> 형식 파싱 (따옴표가 있는 경우)
  const quotedMatch = mailSender.match(/^"([^"]+)"\s*<(.+)>$/);
  if (quotedMatch) {
    return {
      name: quotedMatch[1],
      email: quotedMatch[2]
    };
  }
  
  // 이름 <이메일> 형식 파싱 (따옴표가 없는 경우)
  const unquotedMatch = mailSender.match(/^([^<]+)\s*<(.+)>$/);
  if (unquotedMatch) {
    return {
      name: unquotedMatch[1].trim(),
      email: unquotedMatch[2]
    };
  }
  
  // 이메일만 있는 경우
  if (mailSender.includes('@')) {
    return {
      name: mailSender.split('@')[0],
      email: mailSender
    };
  }
  
  // 이름만 있는 경우
  return {
    name: mailSender,
    email: ''
  };
};

const fetchEmails = async () => {
  try {
    const rawMails = await api.getMailList(1);
    if (!rawMails) {
      console.error('Invalid response format');
      return;
    }

    emails.value = rawMails.map(mail => {
      const senderInfo = parseMailSender(mail.mailSender);
      return {
        id: mail.mailId,
        sender: senderInfo.name,
        email: senderInfo.email,
        subject: mail.mailTitle || '제목 없음',
        preview: mail.mailContent?.slice(0, 100).replace(/\r\n|\n/g, ' ') || '미리보기 없음',
        html: mail.mailHtmlContent || '본문 없음',
        time: formatArrivedAt(mail.arrivedAt) || '시간 정보 없음',
        folder: 'inbox',
        read: false
      };
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    emails.value = [];
  }
};

const formatArrivedAt = (arrivedAt) => {
  if (!arrivedAt || arrivedAt.length < 6) return '시간 정보 없음';
  const [y, m, d, h, min] = arrivedAt;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')} ${h}:${min}`;
};

const extractSubjectFromHtml = (html) => {
  // 예: <div style="font-size: 24px;">로그인에 사용되는 앱 비밀번호가 삭제됨 </div>
  const match = html?.match(/<div[^>]*font-size:\s*24px[^>]*>(.*?)<\/div>/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return '(제목 없음)';
};

// Updated to toggle email selection
const toggleEmailSelection = (emailId) => {
  // If the email is already selected, deselect it
  if (selectedEmail.value === emailId) {
    selectedEmail.value = null;
  } else {
    // Otherwise select it and mark as read
    selectedEmail.value = emailId;
    const email = emails.value.find(e => e.id === emailId);
    if (email) {
      email.read = true;
    }
  }
};

// Track mouse position for tooltip
const updateMousePosition = (event) => {
  // Offset from the cursor to prevent covering it
  mouseX.value = event.clientX + 10;
  mouseY.value = event.clientY + 10;
};

// Compose email methods
const openComposeEmail = () => {
  isReply.value = false;
  replyToEmail.value = {};
  showComposeEmail.value = true;
};

const replyToCurrentEmail = (email) => {
  isReply.value = true;
  replyToEmail.value = email;
  showComposeEmail.value = true;
};

const closeComposeEmail = () => {
  showComposeEmail.value = false;
};

const handleSendEmail = (emailData) => {
  console.log('Sending email:', emailData);
  // Here you would typically send the email via an API
  // For now, we'll just log it and close the compose window
  showComposeEmail.value = false;
  
  // You could add a notification here to show the email was sent
  alert('이메일이 성공적으로 발송되었습니다.');
};

const markAsSpam = (emailId) => {
  const email = emails.value.find(e => e.id === emailId);
  if (email) {
    email.folder = 'spam';
    
    // 선택 해제
    if (selectedEmail.value === emailId) {
      selectedEmail.value = null;
    }
  }
};

const markAsNotSpam = (emailId) => {
  const email = emails.value.find(e => e.id === emailId);
  if (email) {
    email.folder = 'inbox';
    
    // 선택 해제
    if (selectedEmail.value === emailId) {
      selectedEmail.value = null;
    }
  }
};

const deleteEmail = (emailId) => {
  const index = emails.value.findIndex(e => e.id === emailId);
  if (index !== -1) {
    const email = emails.value[index];
    if (email.folder === 'trash') {
      // 완전히 삭제
      emails.value.splice(index, 1);
    } else {
      // 휴지통으로 이동
      email.folder = 'trash';
    }
    
    // 선택 해제
    if (selectedEmail.value === emailId) {
      selectedEmail.value = null;
    }
  }
};

const restoreEmail = (emailId) => {
  const email = emails.value.find(e => e.id === emailId);
  if (email && email.folder === 'trash') {
    email.folder = 'inbox';
    
    // 선택 해제
    if (selectedEmail.value === emailId) {
      selectedEmail.value = null;
    }
  }
};
</script>

<style scoped>
.email-view {
  display: grid;
  grid-template-columns: 240px 1fr 2fr;
  gap: 1px;
  height: calc(100vh - 5rem);
  background-color: #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
}

/* Email Sidebar */
.email-sidebar {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.compose-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.compose-btn:hover {
  background-color: #1e40af;
}

.compose-icon {
  margin-right: 0.5rem;
}

.folder-nav {
  padding: 1rem 0;
}

.folder-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.folder-nav li {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: #475569;
  transition: background-color 0.2s;
}

.folder-nav li:hover {
  background-color: #f1f5f9;
}

.folder-nav li.active {
  background-color: #e2e8f0;
  color: #1e3a8a;
  font-weight: 500;
}

.folder-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.75rem;
  vertical-align: middle;
}

.folder-count {
  margin-left: auto;
  background-color: #1e3a8a;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 1rem;
}

.sidebar-section {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

.sidebar-section h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 0.75rem 0;
}

.label-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.label-list li {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.label-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-right: 0.5rem;
}

/* Email List */
.email-list {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
  max-width: 450px;
}

.email-list-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.email-list-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.email-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
}

.search-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.search-bar input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
  color: #1e293b;
}

.refresh-icon {
  width: 16px; /* 원하는 크기로 설정 */
  height: 16px;
  vertical-align: middle;
  border: none; /* 테두리 제거 */
  background: transparent; /* 배경 제거 */
}

.refresh-icon:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.email-list-content {
  flex: 1;
  overflow-y: auto;
}

.email-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative; /* Added for tooltip positioning */
}

.email-item:hover {
  background-color: #f8fafc;
}

.email-item.unread {
  background-color: #f0f9ff;
}

.email-item.selected {
  background-color: #e0f2fe;
}

.email-sender {
  margin-right: 1rem;
}

.sender-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #1e3a8a;
  color: white;
  border-radius: 50%;
  font-weight: 500;
}

.email-content {
  flex: 1;
  min-width: 0;
}

.email-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.email-sender-name {
  font-weight: 350;
  color: #1e293b;
}

.email-time {
  font-size: 0.75rem;
  color: #64748b;
}

.email-subject {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email-preview {
  font-size: 0.875rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* AI Summary Tooltip */
.ai-summary-tooltip {
  position: fixed; /* Changed from absolute to fixed for better positioning */
  width: 280px;
  background-color: #f0f9ff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  z-index: 100;
  border-left: 3px solid #0369a1;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.tooltip-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #0369a1;
}

.tooltip-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
}

.ai-summary-tooltip p {
  margin: 0;
  font-size: 0.875rem;
  color: #0c4a6e;
  line-height: 1.5;
}

.no-emails {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  padding: 2rem;
  text-align: center;
}

.no-emails-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
}

/* Email Detail */
.email-detail {
  background-color: #ffffff;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.email-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.email-detail-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  word-break: break-word;
}

.email-detail-actions {
  display: flex;
  gap: 0.5rem;
}

.action-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
  vertical-align: middle;
}

/* Redesigned Email Actions */
.email-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-bottom: 1.25rem;
  margin-bottom: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1rem;
  background-color: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 기본 상태는 무색 */
.reply-btn:hover {
  background-color: #f0f9ff;
  color: #0369a1;
  border-color: #e0f2fe;
}

.forward-btn:hover {
  background-color: #f0fdf4;
  color: #16a34a;
  border-color: #dcfce7;
}

.spam-btn:hover {
  background-color: #fef9c3;
  color: #ca8a04;
  border-color: #fef08a;
}

.not-spam-btn:hover {
  background-color: #f0f9ff;
  color: #0369a1;
  border-color: #e0f2fe;
}

.delete-btn:hover {
  background-color: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

.restore-btn:hover {
  background-color: #e0f2fe;
  color: #0284c7;
  border-color: #bae6fd;
}

.email-detail-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.sender-info {
  display: flex;
  align-items: center;
}

.sender-avatar.large {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sender-name {
  font-weight: 500;
  color: #1e293b;
}

.sender-email {
  font-size: 0.875rem;
  color: #64748b;
}

.email-date {
  font-size: 0.875rem;
  color: #64748b;
}

.email-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: #334155;
}

.ai-summary {
  background-color: #f0f9ff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.ai-summary h3 {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: #0369a1;
  margin: 0 0 0.75rem 0;
}

.ai-summary h3 svg {
  margin-right: 0.5rem;
}

.ai-summary p {
  margin: 0;
  font-size: 0.875rem;
  color: #0c4a6e;
  line-height: 1.6;
}

.spam-info {
  background-color: #fff1f2;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.spam-info h3 {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: #be123c;
  margin: 0 0 0.75rem 0;
}

.warning-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
}

.spam-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.spam-detail-item {
  display: flex;
  font-size: 0.875rem;
}

.detail-label {
  width: 6rem;
  font-weight: 500;
  color: #9f1239;
}

.detail-value {
  color: #be123c;
}

.detail-value.high {
  color: #dc2626;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .email-view {
    grid-template-columns: 240px 1fr;
  }
  
  .email-detail {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 60%;
    z-index: 200;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }
  
  .email-detail.active {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .email-view {
    grid-template-columns: 1fr;
  }
  
  .email-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 240px;
    z-index: 200;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .email-sidebar.active {
    transform: translateX(0);
  }
  
  .email-detail {
    width: 100%;
  }
  
  .email-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-btn {
    width: 100%;
  }
  
  /* Ensure tooltip stays within viewport on mobile */
  .ai-summary-tooltip {
    max-width: 80vw;
  }
}
</style>