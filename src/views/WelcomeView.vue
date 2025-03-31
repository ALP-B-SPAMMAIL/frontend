<template>
    <div class="welcome-view">
      <header class="welcome-header">
        <div class="logo-container">
          <img src="@/assets/kt_logo.png" alt="KT Logo" class="logo" />
          <h1 class="logo-text">WhoWhoMail</h1>
        </div>
        <div class="header-actions">
          <router-link to="/login" class="btn-secondary">로그인</router-link>
          <router-link to="/register" class="btn-primary">회원가입</router-link>
        </div>
      </header>
  
      <main class="welcome-content">
        <section class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">안전한 이메일 환경을 위한<br />최고의 선택</h1>
            <p class="hero-description">
              WhoWhoMail은 AI 기반 스팸 필터링과 피싱 방지 기술로<br />
              당신의 이메일을 안전하게 보호합니다.
            </p>
            <div class="hero-actions">
              <router-link to="/register" class="btn-primary btn-large">무료로 시작하기</router-link>
              <a href="#features" class="btn-text">기능 알아보기</a>
            </div>
          </div>
          <div class="hero-image">
            <img src="@/assets/backimage.png" alt="Email Security" />
          </div>
        </section>
  
        <section id="features" class="features-section">
          <h2 class="section-title">주요 기능</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <img src="@/assets/icons/filter.png" alt="Spam Filter Icon" width="24" height="24"/>
              </div>
              <h3 class="feature-title">자동 스팸 필터링</h3>
              <p class="feature-description">
                최신 AI 기술을 활용하여 스팸 메일을 정확하게 식별하고 분류합니다.
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <img src="@/assets/icons/warning.png" alt="Phishing Protection Icon" width="24" height="24"/>
              </div>
              <h3 class="feature-title">피싱 방지</h3>
              <p class="feature-description">
                의심스러운 링크와 첨부 파일을 감지하여 피싱 공격으로부터 보호합니다.
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <img src="@/assets/icons/ai.png" alt="AI Summary Icon" width="24" height="24"/>
              </div>
              <h3 class="feature-title">AI 메일 요약</h3>
              <p class="feature-description">
                긴 이메일 내용을 AI가 자동으로 요약하여 중요한 정보를 빠르게 파악할 수 있습니다.
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <img src="@/assets/icons/lock.png" alt="Security Icon" width="24" height="24"/>
              </div>
              <h3 class="feature-title">강력한 보안</h3>
              <p class="feature-description">
                엔드투엔드 암호화로 이메일 내용을 안전하게 보호하고 개인정보를 지킵니다.
              </p>
            </div>
          </div>
        </section>
  
        <section class="stats-section">
          <div class="stat-item">
            <div class="stat-number">98.8%</div>
            <div class="stat-label">스팸 차단율</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">5만+</div>
            <div class="stat-label">사용자</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">고객 지원</div>
          </div>
        </section>
  
        <section class="cta-section">
          <h2 class="cta-title">지금 바로 시작하세요</h2>
          <p class="cta-description">
            WhoWhoMail와 함께 더 안전한 이메일 환경을 경험해보세요.
          </p>
          <router-link to="/register" class="btn-primary btn-large">무료로 가입하기</router-link>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  // Simple setup script, no complex functionality as requested
  </script>
  
  <style scoped>
  .welcome-view {
    min-height: 100vh;
    background-color: #f8fafc;
    color: #1e293b;
  }
  
  /* Header */
  .welcome-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .logo-container {
    display: flex;
    align-items: center;
  }
  
  .logo {
    width: auto;
    height: 2rem;
    margin-right: 0.75rem;
  }
  
  .logo-text {
    position: relative;
    top: 1px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e3a8a;
    margin: 0;
    line-height: inherit;
  }
  
  .header-actions {
    display: flex;
    gap: 1rem;
  }
  
  /* Buttons */
  .btn-primary,
  .btn-secondary,
  .btn-text {
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
    display: inline-block;
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
  
  .btn-text {
    color: #1e3a8a;
    padding: 0.75rem 0;
  }
  
  .btn-text:hover {
    text-decoration: underline;
  }
  
  .btn-large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
  
  /* Main Content */
  .welcome-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  /* Hero Section */
  .hero-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0;
  }
  
  .hero-content {
    flex: 1;
  }
  
  .hero-title {
    font-size: 3rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }
  
  .hero-description {
    font-size: 1.25rem;
    color: #64748b;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .hero-actions {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }
  
  .hero-image {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  
  .hero-image img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  /* Features Section */
  .features-section {
    padding: 4rem 0;
  }
  
  .section-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .feature-card {
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
  }
  
  .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background-color: #e0f2fe;
    color: #0369a1;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .feature-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
  }
  
  .feature-description {
    color: #64748b;
    line-height: 1.6;
  }
  
  /* Stats Section */
  .stats-section {
    display: flex;
    justify-content: space-around;
    padding: 4rem 0;
    background-color: #1e3a8a;
    border-radius: 0.5rem;
    margin: 0 0;
  }
  
  .stat-item {
    text-align: center;
    color: white;
  }
  
  .stat-number {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 1.125rem;
    opacity: 0.9;
  }
  
  /* CTA Section */
  .cta-section {
    text-align: center;
    padding: 4rem 0;
  }
  
  .cta-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }
  
  .cta-description {
    font-size: 1.25rem;
    color: #64748b;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  </style>