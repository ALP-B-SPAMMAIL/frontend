<template>
  <div class="spam-info-view">
    <div class="section-header">
      <h1>스팸 정보 제공</h1>
      <p class="section-description">
        의심스러운 도메인을 검색하여 피싱 여부를 확인하거나 최근 유행하는 피싱 도메인을 확인하세요.
      </p>
    </div>

    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <img src="@/assets/icons/search.png" alt="Search Icon" class="search-icon" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="도메인 주소를 입력하세요 (예: example.com)" 
            class="search-input"
            @keyup.enter="searchDomain"
          />
        </div>
        <button class="search-button" @click="searchDomain">
          검색
        </button>
      </div>
    </div>

    <div v-if="searchResult" class="result-section">
      <div class="result-card" :class="{ 'danger': searchResult.riskLevel === '높음', 'warning': searchResult.riskLevel === '중간', 'safe': searchResult.riskLevel === '낮음' }">
        <div class="result-header">
          <h2>{{ searchResult.domain }}</h2>
          <div class="risk-badge" :class="{ 'danger': searchResult.riskLevel === '높음', 'warning': searchResult.riskLevel === '중간', 'safe': searchResult.riskLevel === '낮음' }">
            {{ searchResult.riskLevel }}
          </div>
        </div>
        
        <div class="result-details">
          <div class="detail-item">
            <div class="detail-label">
              <img 
                src="@/assets/icons/shield.png" 
                alt="Shield Icon" 
                width="16" 
                height="16"
              />
              <span>위험 수준:</span>
            </div>
            <div class="detail-value" :class="{ 'danger-text': searchResult.riskLevel === '높음', 'warning-text': searchResult.riskLevel === '중간', 'safe-text': searchResult.riskLevel === '낮음' }">
              {{ searchResult.riskLevel }}
            </div>
          </div>
          
          <!-- <div class="detail-item">
            <div class="detail-label">
              <img 
                src="@/assets/icons/clock.png" 
                alt="Clock Icon" 
                width="16" 
                height="16"
              />
              <span>최초 신고일:</span>
            </div>
            <div class="detail-value">{{ searchResult.firstReported }}</div>
          </div> -->
          
          <div class="detail-item">
            <div class="detail-label">
              <img 
                src="@/assets/icons/report.png" 
                alt="Report Icon" 
                width="16" 
                height="16"
              />
              <span>신고 횟수:</span>
            </div>
            <div class="detail-value">{{ searchResult.reportCount }}회</div>
          </div>
          
          <div class="detail-item">
            <div class="detail-label">
              <img 
                src="@/assets/icons/type.png" 
                alt="Type Icon" 
                width="16" 
                height="16"
              />
              <span>유형:</span>
            </div>
            <div class="detail-value">{{ searchResult.type }}</div>
          </div>
          
          <div class="detail-item">
            <div class="detail-label">
              <img 
                src="@/assets/icons/description.png" 
                alt="Description Icon" 
                width="16" 
                height="16"
              />
              <span>설명:</span>
            </div>
            <div class="detail-value description">{{ searchResult.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="top-domains-section">
      <div class="section-header">
        <h2>월간 TOP 5 피싱 도메인</h2>
        <p class="update-info">마지막 업데이트: {{ lastUpdated }}</p>
      </div>
      
      <div class="domains-grid">
        <div v-for="(domain, index) in topDomains" :key="domain.id" class="domain-card">
          <div class="domain-rank">{{ index + 1 }}</div>
          <div class="domain-content">
            <h3 class="domain-name">{{ domain.domain }}</h3>
            <div class="domain-stats">
              <div class="stat-item">
                <img 
                  src="@/assets/icons/shield.png" 
                  alt="Shield Icon" 
                  width="16" 
                  height="16"
                />
                <span>위험 수준: <strong>{{ domain.riskLevel }}</strong></span>
              </div>
              <div class="stat-item">
                <img 
                  src="@/assets/icons/report.png" 
                  alt="Report Icon" 
                  width="16" 
                  height="16"
                />
                <span>신고 횟수: <strong>{{ domain.reportCount }}회</strong></span>
              </div>
              <div class="stat-item">
                <img 
                  src="@/assets/icons/type.png" 
                  alt="Type Icon" 
                  width="16" 
                  height="16"
                />
                <span>유형: <strong>{{ domain.type }}</strong></span>
              </div>
            </div>
            <p class="domain-description">{{ domain.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';

const searchQuery = ref('');
const searchResult = ref(null);

const searchDomain = async () => {
  if (!searchQuery.value) return;

  try {
    const result = await api.getSpamInfo(searchQuery.value);
    searchResult.value = {
      domain: searchQuery.value,
      reportCount: result.count,
      type: result.topic,
      description: result.reason,
      riskLevel: '낮음'
    };

  } catch (error) {
    console.error('Error fetching spam info:', error);
  }
  
  // setTimeout(() => {
  //   if (searchQuery.value.includes('phishing') || searchQuery.value.includes('scam')) {
  //     searchResult.value = {
  //       domain: searchQuery.value,
  //       riskLevel: '높음',
  //       firstReported: '2023년 4월 15일',
  //       reportCount: 342,
  //       type: '피싱',
  //       description: '이 도메인은 금융 기관을 사칭하여 개인 정보 및 금융 정보를 탈취하려는 피싱 사이트로 확인되었습니다. 접속 시 개인정보 유출 위험이 매우 높습니다.'
  //     };
  //   } else if (searchQuery.value.includes('suspicious')) {
  //     searchResult.value = {
  //       domain: searchQuery.value,
  //       riskLevel: '중간',
  //       firstReported: '2023년 5월 3일',
  //       reportCount: 87,
  //       type: '의심',
  //       description: '이 도메인은 의심스러운 활동이 보고되었으나 명확한 피싱 증거는 확인되지 않았습니다. 주의가 필요합니다.'
  //     };
  //   } else {
  //     searchResult.value = {
  //       domain: searchQuery.value,
  //       riskLevel: '낮음',
  //       firstReported: '해당 없음',
  //       reportCount: 0,
  //       type: '안전',
  //       description: '이 도메인에 대한 위험 보고가 없습니다. 현재까지는 안전한 것으로 판단됩니다.'
  //     };
  //   }
  // }, 500);
};

// Top phishing domains data
const lastUpdated = '2025년 3월 31일';
const topDomains = [
  {
    id: 1,
    domain: 'fake-bank-secure.com',
    riskLevel: '높음',
    reportCount: 1247,
    type: '피싱',
    description: '주요 은행을 사칭하여 계좌 정보와 개인정보를 탈취하는 피싱 사이트입니다.'
  },
  {
    id: 2,
    domain: 'login-account-verify.net',
    riskLevel: '높음',
    reportCount: 983,
    type: '피싱',
    description: '소셜 미디어 계정 인증을 사칭하여 로그인 정보를 탈취하는 사이트입니다.'
  },
  {
    id: 3,
    domain: 'tax-refund-gov.co',
    riskLevel: '높음',
    reportCount: 876,
    type: '피싱',
    description: '세금 환급을 사칭하여 개인정보와 금융정보를 탈취하는 사이트입니다.'
  },
  {
    id: 4,
    domain: 'crypto-investment-quick.com',
    riskLevel: '높음',
    reportCount: 754,
    type: '사기',
    description: '가짜 암호화폐 투자 사이트로 투자금을 탈취합니다.'
  },
  {
    id: 5,
    domain: 'parcel-delivery-tracking.info',
    riskLevel: '높음',
    reportCount: 621,
    type: '피싱',
    description: '택배 배송 조회를 사칭하여 개인정보를 탈취하는 사이트입니다.'
  }
];
</script>

<style scoped>
.spam-info-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.section-header {
  margin-bottom: 2rem;
  text-align: center;
}

.section-header h1 {
  color: #1e3a8a;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.section-header h2 {
  color: #1e3a8a;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.update-info {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Search Section */
.search-section {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

.search-container {
  display: flex;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  gap: 0;
  align-items: stretch;
  flex-wrap: nowrap;
}

.search-input-wrapper {
  position: relative;
  flex: 1; /* 자동으로 크기 조절 */
  min-width: 0; /* 최대 너비를 제한 */
}

.search-icon {
  width: 16px;
  height: 16px;
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem 0 0 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #1e3a8a;
}

.search-button {
  flex: 0 0 auto;
  white-space: nowrap;
  padding: 0.75rem 1.5rem;
  min-width: 100px;
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 0 0.5rem 0.5rem 0;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #1e40af;
}

.result-section {
  margin-bottom: 3rem;
}

.result-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border-top: 4px solid #1e3a8a;
}

.result-card.danger {
  border-top-color: #dc2626;
}

.result-card.warning {
  border-top-color: #f59e0b;
}

.result-card.safe {
  border-top-color: #10b981;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.result-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
  word-break: break-all;
}

.risk-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
}

.risk-badge.danger {
  background-color: #fee2e2;
  color: #dc2626;
}

.risk-badge.warning {
  background-color: #fef3c7;
  color: #d97706;
}

.risk-badge.safe {
  background-color: #d1fae5;
  color: #059669;
}

.result-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.detail-item {
  margin-bottom: 1rem;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.detail-value {
  font-size: 1rem;
  color: #1e293b;
}

.detail-value.description {
  grid-column: 1 / -1;
  line-height: 1.6;
}

.danger-text {
  color: #dc2626;
  font-weight: 600;
}

.warning-text {
  color: #d97706;
  font-weight: 600;
}

.safe-text {
  color: #059669;
  font-weight: 600;
}

/* Top Domains Section */
.top-domains-section {
  margin-bottom: 2rem;
}

.domains-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.domain-card {
  display: flex;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.domain-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.domain-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  background-color: #1e3a8a;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.domain-content {
  flex: 1;
  padding: 1rem;
}

.domain-name {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: #1e293b;
  word-break: break-all;
}

.domain-stats {
  margin-bottom: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #64748b;
}

.stat-item img {
  color: #1e3a8a;
}

.domain-description {
  margin: 0;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
  }
  
  .search-input {
    border-radius: 0.5rem;
  }
  
  .search-button {
    margin-top: 0.5rem;
    border-radius: 0.5rem;
    padding: 0.75rem;
  }
  
  .result-details {
    grid-template-columns: 1fr;
  }
  
  .domains-grid {
    grid-template-columns: 1fr;
  }
}
</style>