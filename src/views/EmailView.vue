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
            <!-- <span v-if="folderCounts[folder.id] > 0" class="folder-count">
              {{ folderCounts[folder.id] }}
            </span> -->
          </li>
        </ul>
      </nav>
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
          v-for="email in paginatedEmails" 
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
      
      <!-- 페이지네이션 컨트롤 -->
      <div v-if="totalPages > 1" class="pagination-controls">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <span class="pagination-arrow">←</span>
        </button>
        
        <div class="pagination-pages">
          <button 
            v-for="page in displayedPages" 
            :key="page" 
            class="pagination-page" 
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <span class="pagination-arrow">→</span>
        </button>
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
          <button v-else class="action-btn spam-btn" @click="markAsSpam">
            <img src="@/assets/icons/report.png" alt="Report Icon" class="action-icon" />
            <span>스팸 신고</span>
          </button>
        </template>
        
        <!-- In Trash Can -->
        <template v-else>
          <button class="action-btn restore-btn" @click="restoreEmail(currentEmail.id)">
            <img src="@/assets/icons/restore.png" alt="Restore Icon" class="action-icon" />
            <span>복원</span>
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
      
      <div v-if="currentEmail.aiSummary" class="ai-summary">
        <div class="ai-summary-header">
          <img src="@/assets/icons/ai.png" alt="AI Icon" class="ai-icon" />
          <span class="ai-title">AI 요약</span>
        </div>
        <div class="ai-summary-content">
          <p>{{ currentEmail.aiSummary }}</p>
        </div>
      </div>
      
      <div class="sender-threat" :data-threat-level="getThreatLevelText()">
        <div class="sender-threat-content">
          <div class="threat-info-line">
            <div class="threat-level">
              <img src="@/assets/icons/shield.png" alt="Shield Icon" class="threat-icon" />
              <span>{{ getThreatLevelText() }}</span>
            </div>
            <div class="threat-stats">
              <span>신고: {{ getSenderReportCount() }}회</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="email-body" v-html="currentEmail.html"></div>
          
      <div v-if="currentFolder === 'spam' && spamInfo" class="spam-info">
        <h3>
          <img src="@/assets/icons/warning_red.png" alt="Warning Icon" class="warning-icon" />
          스팸 정보
        </h3>
        <div class="spam-details">
          <div class="spam-detail-item">
            <span class="detail-label">위험 수준:</span>
            <span class="detail-value" :class="spamInfo.riskLevel === '높음' ? 'high' : ''">
              {{ spamInfo.riskLevel }}
            </span>
          </div>
          <div class="spam-detail-item">
            <span class="detail-label">유형:</span>
            <span class="detail-value">{{ spamInfo.type }}</span>
          </div>
          <div class="spam-detail-item">
            <span class="detail-label">신고 횟수:</span>
            <span class="detail-value">{{ spamInfo.reportCount }}회</span>
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

    <!-- Spam Report Modal -->
    <SpamReportModal
      v-if="showSpamReportModal"
      :emailId="selectedEmail"
      @close="showSpamReportModal = false"
      @submit="handleSpamReport"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ComposeEmail from '@/components/ComposeEmail.vue';
import SpamReportModal from '@/components/SpamReportModal.vue';
import api from '@/services/api';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

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
  
  // 각 폴더별로 해당하는 메일 리스트만 카운트
  emails.value.forEach(email => {
    if (email.folder === 'inbox') {
      counts.inbox++;
    }
  });
  
  spamEmails.value.forEach(email => {
    if (email.folder === 'spam') {
      counts.spam++;
    }
  });

  trashEmails.value.forEach(email => {
    if (email.folder === 'trash') {
      counts.trash++;
    }
  });
  
  return counts;
});

const emails = ref([]);
const spamEmails = ref([]);
const trashEmails = ref([]);

// Reactive state
const currentFolder = ref('inbox');
const selectedEmail = ref(null);
const searchQuery = ref('');
const hoveredEmail = ref(null);
const mouseX = ref(0);
const mouseY = ref(0);
const showComposeEmail = ref(false);
const showSpamReportModal = ref(false);
const isReply = ref(false);
const replyToEmail = ref({});

// 페이지네이션 관련 상태
const currentPage = ref(1);
const itemsPerPage = 10;

// 폴더나 검색어가 변경되면 첫 페이지로 이동
watch([currentFolder, searchQuery], () => {
  currentPage.value = 1;
});

const refreshEmails = () => {
  fetchEmails();
};

onMounted(() => {
  fetchEmails();
});

const folderTitle = computed(() => {
  const folder = folders.find(f => f.id === currentFolder.value);
  return folder ? folder.name : '';
});

const filteredEmails = computed(() => {
  let emailList;
  switch (currentFolder.value) {
    case 'spam':
      emailList = spamEmails.value;
      break;
    case 'trash':
      emailList = trashEmails.value;
      break;
    default:
      emailList = emails.value;
  }
  
  if (!emailList) return [];
  
  return emailList.filter(email => {
    if (!searchQuery.value) return true;
    const query = searchQuery.value.toLowerCase();
    return (
      (email.sender?.toLowerCase() || '').includes(query) ||
      (email.subject?.toLowerCase() || '').includes(query) ||
      (email.email?.toLowerCase() || '').includes(query)
    );
  });
});

const paginatedEmails = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredEmails.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(filteredEmails.value.length / itemsPerPage);
});

// 표시할 페이지 번호 계산
const displayedPages = computed(() => {
  if (totalPages.value <= 5) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }
  
  // 현재 페이지 주변 페이지 표시
  let start = Math.max(currentPage.value - 2, 1);
  let end = Math.min(start + 4, totalPages.value);
  
  // 끝에 가까울 때 조정
  if (end === totalPages.value) {
    start = Math.max(end - 4, 1);
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const currentEmail = computed(() => {
  if (!selectedEmail.value) return null;
  
  let emailList;
  switch (currentFolder.value) {
    case 'spam':
      emailList = spamEmails.value;
      break;
    case 'trash':
      emailList = trashEmails.value;
      break;
    default:
      emailList = emails.value;
  }
  
  if (!emailList) return null;
  
  return emailList.find(email => email.id === selectedEmail.value) || null;
});

const spamInfo = ref(null);
const threatInfo = ref(null);

const fetchThreatInfo = async (email) => {
  if (!email || !email.email) return;
  try {
    const result = await api.getSpamInfo(email.email);
    const reportCount = result.count || 0;
    
    // 신고 횟수에 따른 위협 수준 결정
    let level = '정보 없음';
    if (reportCount > 0) {
      if (reportCount >= 50) {
        level = '높음';
      } else if (reportCount >= 10) {
        level = '중간';
      } else {
        level = '낮음';
      }
    }
    
    threatInfo.value = {
      level: level,
      reportCount: reportCount,
    };
  } catch (error) {
    console.error('Error fetching threat info:', error);
    threatInfo.value = null;
  }
};

// Selected Email Threat Info 가져오기
watch(selectedEmail, async (newEmailId) => {
  if (newEmailId) {
    const email = currentEmail.value;
    if (email) {
      await fetchThreatInfo(email);
    }
  } else {
    threatInfo.value = null;
  }
});

const noEmailsMessage = computed(() => {
  if (searchQuery.value) {
    return '검색 결과가 없습니다.';
  }
  return currentFolder.value === 'inbox' ? '받은 메일이 없습니다.' : '스팸 메일이 없습니다.';
});

// 위협 수준 관련 메서드 수정
const getThreatLevelText = () => {
  if (!threatInfo.value) return '정보 없음';
  return threatInfo.value.level;
};

const getSenderReportCount = () => {
  if (!threatInfo.value) return 0;
  return threatInfo.value.reportCount;
};

const selectFolder = (folderId) => {
  currentFolder.value = folderId;
  selectedEmail.value = null;
};

const parseMailSender = (mailSender) => {
  if (!mailSender) return { name: 'Unknown Sender', email: '' };
  
  // "이름" <이메일>
  const quotedMatch = mailSender.match(/^"([^"]+)"\s*<(.+)>$/);
  if (quotedMatch) {
    return {
      name: quotedMatch[1],
      email: quotedMatch[2]
    };
  }
  
  // 이름 <이메일>
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
    // Normal Mail
    const normalMailResponse = await api.getNormalMailList(userStore.userCode, 0);
    if (!normalMailResponse) {
      console.error('Invalid response format');
      return;
    }

    const allNormalMails = [];
    for (let page = 0; page < normalMailResponse.totalPages; page++) {
      const response = await api.getNormalMailList(userStore.userCode, page);
      if (response && response.content) {
        allNormalMails.push(...response.content);
      }
    }

    emails.value = allNormalMails.map(mail => {
      const senderInfo = parseMailSender(mail.mailSender);
      const formattedSummary = mail.mailSummarize 
        ? mail.mailSummarize.split('-').map(item => item.trim()).filter(item => item).join('\n- ')
        : null;
      
      return {
        id: mail.mailId,
        sender: senderInfo.name,
        email: senderInfo.email,
        subject: mail.mailTitle || '제목 없음',
        preview: mail.mailContent?.slice(0, 100).replace(/\r\n|\n/g, ' ') || '미리보기 없음',
        html: mail.mailHtmlContent || '본문 없음',
        time: formatArrivedAt(mail.arrivedAt) || '시간 정보 없음',
        folder: 'inbox',
        read: false,
        aiSummary: formattedSummary
      };
    });

    // Spam Mail
    const spamMailResponse = await api.getSpamMailList(userStore.userCode, 0);
    if (!spamMailResponse) {
      console.error('Invalid response format');
      return;
    }

    const allSpamMails = [];
    for (let page = 0; page < spamMailResponse.totalPages; page++) {
      const response = await api.getSpamMailList(userStore.userCode, page);
      if (response && response.content) {
        allSpamMails.push(...response.content);
      }
    }

    spamEmails.value = allSpamMails.map(mail => {
      const senderInfo = parseMailSender(mail.mailSender);
      const formattedSummary = mail.mailSummarize 
        ? mail.mailSummarize.split('-').map(item => item.trim()).filter(item => item).join('\n- ')
        : null;
      
      return {
        id: mail.mailId,
        sender: senderInfo.name,
        email: senderInfo.email,
        subject: mail.mailTitle || '제목 없음',
        preview: mail.mailContent?.slice(0, 100).replace(/\r\n|\n/g, ' ') || '미리보기 없음',
        html: mail.mailHtmlContent || '본문 없음',
        time: formatArrivedAt(mail.arrivedAt) || '시간 정보 없음',
        folder: 'spam',
        read: false,
        aiSummary: formattedSummary
      };
    });

    // Trash Mail
    const trashMailResponse = await api.getTrashcanMails(userStore.userCode, 0);
    if (trashMailResponse) {
      const allTrashMails = [];
      for (let page = 0; page < trashMailResponse.totalPages; page++) {
        const response = await api.getTrashcanMails(userStore.userCode, page);
        if (response && response.content) {
          allTrashMails.push(...response.content);
        }
      }

      trashEmails.value = allTrashMails.map(mail => {
        const senderInfo = parseMailSender(mail.mailSender);
        const formattedSummary = mail.mailSummarize 
          ? mail.mailSummarize.split('-').map(item => item.trim()).filter(item => item).join('\n- ')
          : null;
        
        return {
          id: mail.mailId,
          sender: senderInfo.name,
          email: senderInfo.email,
          subject: mail.mailTitle || '제목 없음',
          preview: mail.mailContent?.slice(0, 100).replace(/\r\n|\n/g, ' ') || '미리보기 없음',
          html: mail.mailHtmlContent || '본문 없음',
          time: formatArrivedAt(mail.arrivedAt) || '시간 정보 없음',
          folder: 'trash',
          read: false,
          aiSummary: formattedSummary
        };
      });
    }
  } catch (error) {
    console.error('Error fetching emails:', error);
    emails.value = [];
    spamEmails.value = [];
    trashEmails.value = [];
  }
};

const formatArrivedAt = (arrivedAt) => {
  if (!arrivedAt) return '시간 정보 없음';
  
  try {
    const date = new Date(arrivedAt);
    if (isNaN(date.getTime())) return '시간 정보 없음';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '시간 정보 없음';
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    const emailListContent = document.querySelector('.email-list-content');
    if (emailListContent) {
      emailListContent.scrollTop = 0;
    }
  }
};

const toggleEmailSelection = (emailId) => {
  if (selectedEmail.value === emailId) {
    selectedEmail.value = null;
  } else {
    selectedEmail.value = emailId;
    let email;
    switch (currentFolder.value) {
      case 'spam':
        email = spamEmails.value.find(e => e.id === emailId);
        break;
      case 'trash':
        email = trashEmails.value.find(e => e.id === emailId);
        break;
      default:
        email = emails.value.find(e => e.id === emailId);
    }
    if (email) {
      email.read = true;
    }
  }
};

// Track mouse position for tooltip
const updateMousePosition = (event) => {
  mouseX.value = event.clientX + 10;
  mouseY.value = event.clientY + 10;
};

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
  showComposeEmail.value = false;
  alert('이메일이 성공적으로 발송되었습니다.');
};

const markAsSpam = () => {
  showSpamReportModal.value = true;
};

const handleSpamReport = async (reportData) => {
  try {
    await api.reportSpam(reportData.emailId, reportData.reason);
    fetchEmails();
    showSpamReportModal.value = false;
    alert('스팸 신고가 완료되었습니다.');
  } catch (error) {
    alert('스팸 신고 중 오류가 발생했습니다.');
  }
};

const markAsNotSpam = async (emailId) => {
  try {
    await api.deleteSpamFlag(emailId);
    await fetchEmails();
    
    if (selectedEmail.value === emailId) {
      selectedEmail.value = null;
    }
  } catch (error) {
    alert('오류가 발생했습니다.');
  }
};

const deleteEmail = async (emailId) => {
  try {
    if (currentFolder.value === 'trash') {
      await api.permanentlyDeleteMail(emailId);
      await fetchEmails();
    } else {
      await api.deleteMail(emailId);
      await fetchEmails();
    }
    
    if (selectedEmail.value === emailId) {
      selectedEmail.value = null;
    }
  } catch (error) {
    alert('메일 삭제 중 오류가 발생했습니다.');
  }
};

const restoreEmail = async (emailId) => {
  try {
    await api.restoreMail(emailId);
    await fetchEmails();
    
    if (selectedEmail.value === emailId) {
      selectedEmail.value = null;
    }
  } catch (error) {
    alert('메일 복구 중 오류가 발생했습니다.');
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
}

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

/* Email List */
.email-list {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
  max-width: 450px;
  height: 100%;
  overflow-y: auto;
}

.email-list-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-shrink: 0;
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
  width: 16px;
  height: 16px;
  vertical-align: middle;
  border: none;
  background: transparent;
}

.refresh-icon:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.email-list-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.email-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  min-height: 4rem;
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
  align-items: center;
  margin-bottom: 0.25rem;
}

.email-subject {
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-right: 1rem;
}

.email-time {
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
}

.email-sender-name {
  font-size: 0.875rem;
  color: #475569;
  margin-bottom: 0.125rem;
}

.email-address {
  font-size: 0.75rem;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f1f5f9;
  color: #1e293b;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-arrow {
  font-size: 1rem;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.pagination-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-page:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.pagination-page.active {
  background-color: #1e3a8a;
  color: #ffffff;
  border-color: #1e3a8a;
}

.ai-summary-tooltip {
  position: fixed;
  width: 320px;
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.15);
  border-left: 5px solid #3b82f6;
  padding: 0;
  z-index: 100;
  animation: fadeIn 0.2s ease-in-out;
  overflow: hidden;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.tooltip-header {
  background-color: rgba(59, 130, 246, 0.15);
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.tooltip-icon {
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
}

.tooltip-header span {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1d4ed8;
  letter-spacing: 0.01em;
}

.ai-summary-tooltip p {
  margin: 0;
  padding: 1.25rem;
  font-size: 0.9rem;
  color: #1e40af;
  line-height: 1.6;
  position: relative;
  font-weight: 500;
  background-color: #ffffff;
  white-space: pre-line;
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

.email-detail {
  background-color: #ffffff;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
}

.email-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
  padding-bottom: 0.25rem;
}

.email-detail-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  word-break: break-word;
}

.email-detail-actions {
  display: flex;
  gap: 0.5rem;
}

.action-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.375rem;
  vertical-align: middle;
}

.email-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding-bottom: 0.5rem;
  margin-bottom: 0.25rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.625rem;
  background-color: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

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
  padding: 0.25rem 0;
  margin-bottom: 0.5rem;
}

.sender-info {
  display: flex;
  align-items: center;
}

.sender-avatar.large {
  width: 2rem;
  height: 2rem;
  font-size: 0.875rem;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sender-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
}

.sender-email {
  font-size: 0.75rem;
  color: #64748b;
}

.email-date {
  font-size: 0.75rem;
  color: #64748b;
}

.email-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #334155;
}

.ai-summary {
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.15);
  border-left: 5px solid #3b82f6;
  overflow: hidden;
  animation: pulse 2s infinite alternate;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(3, 105, 161, 0.15);
  }
  100% {
    box-shadow: 0 8px 24px rgba(3, 105, 161, 0.25);
  }
}

.ai-summary-header {
  background-color: rgba(59, 130, 246, 0.15);
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  border-bottom: 0.5px solid rgba(59, 130, 246, 0.2);
}

.ai-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}

.ai-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1d4ed8;
  letter-spacing: 0.01em;
}

.ai-summary-content {
  padding: 0.75rem;
  position: relative;
}

.ai-summary-content p {
  margin: 0;
  font-size: 0.8rem;
  color: #1e40af;
  line-height: 1.6;
  position: relative;
  font-weight: 500;
  white-space: pre-line;
}

.sender-threat {
  background-color: #f8fafc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0.75rem;
  border-left: 3px solid #e2e8f0;
}

.sender-threat-content {
  display: flex;
  align-items: center;
}

.threat-info-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 0.875rem;
}

.threat-level {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.threat-level.low {
  color: #059669;
}

.threat-level.medium {
  color: #d97706;
}

.threat-level.high {
  color: #dc2626;
}

.threat-level.noinfo {
  color: #64748b;
}

.threat-icon {
  width: 16px;
  height: 16px;
}

.threat-stats {
  display: flex;
  gap: 1rem;
  color: #64748b;
}

.threat-stats span {
  font-size: 0.75rem;
}

.sender-threat[data-threat-level="높음"] {
  background-color: #fef2f2;
  border-left-color: #dc2626;
}

.sender-threat[data-threat-level="중간"] {
  background-color: #fffbeb;
  border-left-color: #f59e0b;
}

.sender-threat[data-threat-level="낮음"] {
  background-color: #f0fdf4;
  border-left-color: #10b981;
}

.sender-threat[data-threat-level="정보 없음"] {
  background-color: #f8fafc;
  border-left-color: #64748b;
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

.email-list-content::-webkit-scrollbar {
  width: 8px;
}

.email-list-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.email-list-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.email-list-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 1200px) {
  .email-view {
    grid-template-columns: 240px 1fr;
  }
  
  .email-list {
    max-width: 350px;
  }
  
  .email-detail {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: calc(100% - 590px);
    z-index: 200;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    transform: translateX(0);
    transition: transform 0.3s ease;
  }
}

@media (max-width: 768px) {
  .email-view {
    grid-template-columns: 1fr;
    padding: 0;
  }

  .email-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 240px;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .email-sidebar.active {
    transform: translateX(0);
  }

  .email-list {
    width: 100%;
    max-width: none;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .email-detail {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 50;
    overflow-y: auto;
    transform: translateX(0);
    transition: transform 0.3s ease;
  }

  .email-detail-header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .email-detail-content {
    padding: 1rem;
  }

  .email-detail-actions {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 1rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .action-button {
    flex: 1;
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .action-button:first-child {
    flex: 2;
  }
}

@media (max-width: 480px) {
  .email-item {
    padding: 0.75rem;
  }

  .email-sender {
    font-size: 0.875rem;
  }

  .email-subject {
    font-size: 0.875rem;
  }

  .email-preview {
    font-size: 0.75rem;
  }

  .email-time {
    font-size: 0.75rem;
  }

  .email-detail-header h2 {
    font-size: 1.25rem;
  }

  .email-detail-meta {
    font-size: 0.875rem;
  }

  .email-detail-content {
    font-size: 0.875rem;
  }
}
</style>