<template>
  <div class="register-view">
    <div class="register-container">
      <div class="register-header">
        <div class="logo-container">
          <h1 class="logo-text">WhoWhoMail</h1>
        </div>
        <h2 class="register-title">회원가입</h2>
        <p class="register-subtitle">WhoWhoMail에 가입하여 안전한 이메일 서비스를 이용하세요.</p>
        
        <!-- Step indicator -->
        <div class="step-indicator">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="step" 
            :class="{ 'active': currentStep === index, 'completed': currentStep > index }"
            @click="goToStep(index)"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-label">{{ step }}</div>
          </div>
        </div>
      </div>
      
      <!-- Step 1: Basic Information -->
      <form v-if="currentStep === 0" class="register-form" @submit.prevent="nextStep">
        <div class="form-group">
          <label for="name">이름</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/user2.png" alt="User Icon" class="input-icon" width="18" height="18" />
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              placeholder="이름을 입력하세요" 
              class="form-input" 
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="id">아이디</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/id2.png" alt="Id Icon" class="input-icon" width="18" height="18" />
            <input 
              type="text" 
              id="id" 
              v-model="formData.id" 
              placeholder="아이디를 입력하세요" 
              class="form-input" 
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">비밀번호</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/lock.png" alt="Password Icon" class="input-icon" width="18" height="18" />
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="formData.password" 
              placeholder="비밀번호를 입력하세요" 
              class="form-input" 
              required
              @input="checkPasswordStrength"
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
          
          <!-- 비밀번호 강도 표시 -->
          <div class="password-strength" v-if="formData.password">
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
        </div>

        <div class="form-group">
          <label for="confirm-password">비밀번호 확인</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/lock.png" alt="Password Icon" class="input-icon" width="18" height="18" />
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              id="confirm-password" 
              v-model="formData.confirmPassword" 
              placeholder="비밀번호를 다시 입력하세요" 
              class="form-input" 
              required
              @input="checkPasswordMatch"
            />
            <button 
              type="button" 
              class="password-toggle" 
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <img v-if="showConfirmPassword" src="@/assets/icons/showpw.png" alt="Show Password" width="18" height="18" />
              <img v-else src="@/assets/icons/hidepw.png" alt="Hide Password" width="18" height="18" />
            </button>
          </div>
          <!-- 비밀번호 일치 여부 표시 -->
          <p v-if="formData.confirmPassword" class="password-match" :class="passwordsMatch ? 'match' : 'mismatch'">
            {{ passwordsMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
          </p>
        </div>
        <!-- <div class="form-group timezone-group">
          <label for="timezone">시간대</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/timezone.png" alt="Timezone Icon" class="input-icon" width="18" height="18" />
            <select id="timezone" v-model="formData.timezone" class="form-select">
              <option value="Asia/Seoul">서울 (GMT+9)</option>
              <option value="America/New_York">뉴욕 (GMT-5)</option>
              <option value="Europe/London">런던 (GMT+0)</option>
              <option value="Asia/Tokyo">도쿄 (GMT+9)</option>
            </select>
          </div>
        </div> -->
        
        <div class="form-group terms-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="formData.agreeTerms" required />
            <span>
              <a href="#" class="terms-link" @click.prevent="showTermsModal = true">이용약관</a>과 
              <a href="#" class="terms-link" @click.prevent="showPrivacyModal = true">개인정보처리방침</a>에 동의합니다.
            </span>
          </label>
        </div>
        
        <div class="form-navigation">
          <button type="submit" class="btn-primary btn-full">다음</button>
        </div>
      </form>
      
      <!-- Step 2: Personal Information -->
      <div v-if="currentStep === 1" class="register-form">
        <div class="form-group">
          <label for="birthdate">생년월일</label>
          <div class="date-select-group">
            <div class="date-select">
              <select v-model="birthYear" class="form-select date-part" @change="updateBirthdate">
                <option value="" disabled>년도</option>
                <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
              </select>
            </div>
            <div class="date-select">
              <select v-model="birthMonth" class="form-select date-part" @change="updateBirthdate">
                <option value="" disabled>월</option>
                <option v-for="month in 12" :key="month" :value="month.toString().padStart(2, '0')">
                  {{ month }}월
                </option>
              </select>
            </div>
            <div class="date-select">
              <select v-model="birthDay" class="form-select date-part" @change="updateBirthdate">
                <option value="" disabled>일</option>
                <option v-for="day in 31" :key="day" :value="day.toString().padStart(2, '0')">
                  {{ day }}일
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="gender">성별</label>
          <div class="gender-select">
            <select v-model="gender" class="form-select" @change="updateGender" id="gender">
              <option value="" disabled selected>성별을 선택하세요</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="occupation">직업</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/briefcase.png" alt="Briefcase Icon" class="input-icon" width="18" height="18" />
            <input 
              type="text" 
              id="occupation" 
              v-model="formData.personalInfo.occupation" 
              placeholder="직업을 입력하세요" 
              class="form-input" 
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="interests">관심사</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/heart.png" alt="Heart Icon" class="input-icon" width="18" height="18" />
            <input 
              type="text" 
              id="interests" 
              v-model="formData.personalInfo.interests" 
              placeholder="관심사를 입력하세요 (예: 여행, 독서, 음악)" 
              class="form-input" 
            />
          </div>
          <p class="form-help">
            여러 관심사는 쉼표(,)로 구분하여 입력하세요.
          </p>
        </div>
        
        <div class="form-navigation">
          <button type="button" class="btn-secondary" @click="prevStep">이전</button>
          <button type="button" class="btn-primary" @click="handleRegister">완료</button>
        </div>
      </div>
      
      <!-- Step 3: Mail Server Settings
      <div v-if="currentStep === 2" class="register-form">
        <div class="form-group">
          <label for="protocol">프로토콜</label>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                type="radio" 
                id="protocol-imaps" 
                name="protocol" 
                value="imaps" 
                v-model="formData.mailSettings.protocol"
              />
              <span>IMAPS</span>
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                id="protocol-pop3" 
                name="protocol" 
                value="pop3" 
                v-model="formData.mailSettings.protocol"
              />
              <span>POP3</span>
            </label>
          </div>
          <p class="form-help">
            <span v-if="formData.mailSettings.protocol === 'imaps'">IMAPS: 서버에 이메일을 보관하고 여러 기기에서 동기화합니다.</span>
            <span v-else-if="formData.mailSettings.protocol === 'pop3'">POP3: 이메일을 다운로드하고 서버에서 삭제합니다.</span>
            <span v-else>프로토콜을 선택하세요.</span>
          </p>
        </div>
        
        <div class="form-group">
          <label for="server">메일 서버 주소</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/server.png" alt="Server Icon" class="input-icon" width="18" height="18" />
            <input 
              type="text" 
              id="server" 
              v-model="formData.mailSettings.server" 
              placeholder="예: imap.gmail.com 또는 pop.gmail.com" 
              class="form-input"
            />
          </div>
          <p class="form-help">
            메일 서비스 제공자의 서버 주소를 입력하세요. (예: Gmail, Naver, Outlook 등)
          </p>
        </div>
        
        <div class="form-group">
          <label for="mail-email">이메일 주소</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/mail.png" alt="Email Icon" class="input-icon" width="18" height="18" />
            <input 
              type="email" 
              id="mail-email" 
              v-model="formData.mailSettings.email" 
              placeholder="이메일 주소를 입력하세요" 
              class="form-input"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="app-password">앱 비밀번호</label>
          <div class="input-with-icon">
            <img src="@/assets/icons/lock.png" alt="Password Icon" class="input-icon" width="18" height="18" />
            <input 
              :type="showAppPassword ? 'text' : 'password'" 
              id="app-password" 
              v-model="formData.mailSettings.password" 
              placeholder="앱 비밀번호를 입력하세요" 
              class="form-input"
            />
            <button 
              type="button" 
              class="password-toggle" 
              @click="showAppPassword = !showAppPassword"
            >
              <img v-if="showAppPassword" src="@/assets/icons/showpw.png" alt="Show Password" width="18" height="18" />
              <img v-else src="@/assets/icons/hidepw.png" alt="Hide Password" width="18" height="18" />
            </button>
          </div>
          <p class="form-help">
            일반 계정 비밀번호가 아닌 메일 서비스에서 제공하는 앱 비밀번호를 입력하세요.
            <a href="#" class="help-link" @click.prevent="showAppPasswordHelp = true">앱 비밀번호란?</a>
          </p>
        </div>
        
        <div class="form-navigation">
          <button type="button" class="btn-secondary" @click="prevStep">이전</button>
          <button type="button" class="btn-primary" @click="handleMailInfo">회원가입 완료</button>
        </div>
      </div>
       -->
      <div class="register-footer">
        <p>이미 계정이 있으신가요? <router-link to="/login" class="login-link">로그인</router-link></p>
      </div>
    </div>
    
    <!-- 이용약관 모달 -->
    <div v-if="showTermsModal" class="modal-overlay" @click="showTermsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>이용약관</h3>
          <button class="modal-close" @click="showTermsModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <h4>WhoWhoMail 서비스 이용약관</h4>
          <p>본 약관은 WhoWhoMail(이하 "회사")이 제공하는 서비스의 이용조건 및 절차를 규정하며, 회사와 이용자 간의 권리, 의무 및 책임사항을 명확히 하는 것을 목적으로 합니다. 본 서비스를 이용하려면 본 약관에 반드시 동의해야 합니다.</p>

          <h4>제1조 (목적)</h4>
          <p>본 약관은 회사가 제공하는 WhoWhoMail 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.</p>

          <h4>제2조 (용어의 정의)</h4>
          <p>본 약관에서 사용하는 주요 용어의 정의는 다음과 같습니다.</p>
          <p>1. <strong>"회원"</strong>이라 함은 본 약관에 동의하고 회원가입 절차를 완료하여 회사의 서비스를 이용하는 자를 말합니다.</p>
          <p>2. <strong>"서비스"</strong>라 함은 회사가 제공하는 이메일 보안 및 피싱 방지 관련 모든 서비스를 의미합니다.</p>
          <p>3. <strong>"개인정보"</strong>라 함은 회원이 서비스 이용을 위해 회사에 제공한 개인을 식별할 수 있는 정보를 의미합니다.</p>

          <h4>제3조 (회원가입)</h4>
          <p>회원은 회원가입 시 정확하고 최신의 정보를 제공하여야 하며, 허위 또는 부정확한 정보 입력으로 인해 발생하는 문제에 대한 모든 책임은 회원 본인에게 있습니다.</p>

          <h4>제4조 (개인정보 보호 및 관리)</h4>
          <p>회사는 회원의 개인정보 보호를 최우선으로 하며, 관련 법령을 준수하여 회원의 개인정보를 안전하게 관리합니다. 개인정보의 구체적인 관리 및 보호 사항은 별도의 개인정보 처리방침에서 규정합니다.</p>

          <h4>제5조 (서비스 이용의 제한)</h4>
          <p>회사는 회원이 다음 각 호의 행위를 하는 경우 사전 통지 없이 서비스 이용을 제한하거나 회원 자격을 박탈할 수 있습니다.</p>
          <p>1. 회원가입 시 허위 정보를 기재한 경우</p>
          <p>2. 타인의 개인정보 또는 계정 정보를 도용한 경우</p>
          <p>3. 회사의 서비스 운영을 고의로 방해하거나 회사의 명예를 훼손한 경우</p>
          <p>4. 본 약관 및 관련 법령에서 금지하거나 공서양속에 위반하는 행위를 한 경우</p>

          <h4>제6조 (서비스의 변경 및 중단)</h4>
          <p>회사는 운영상, 기술상 필요가 있는 경우 사전 공지 후 서비스를 변경하거나 일시 중단할 수 있으며, 이로 인해 발생한 회원의 손해에 대해 회사의 고의 또는 중대한 과실이 없는 한 책임지지 않습니다.</p>

          <h4>제7조 (책임 제한 및 면책)</h4>
          <p>회사는 천재지변, 전쟁, 서비스 장애, 이용자의 부주의 및 과실 등 회사의 책임 없는 사유로 인해 발생한 손해에 대해서는 책임을 지지 않습니다.</p>

          <h4>제8조 (약관의 개정)</h4>
          <p>회사는 관련 법령의 개정 및 서비스 운영상 필요에 따라 본 약관을 개정할 수 있습니다. 개정된 약관은 서비스 내 공지사항 또는 이메일을 통해 사전 통지하며, 회원이 개정된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.</p>

          <h4>제9조 (준거법 및 재판관할)</h4>
          <p>본 약관과 관련된 분쟁 발생 시 대한민국의 법령을 준거법으로 하며, 소송이 제기될 경우 관할법원은 회사의 소재지를 관할하는 법원으로 합니다.</p>

          <p><strong>본 약관은 2025년 3월 31일부터 시행됩니다.</strong></p>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" @click="showTermsModal = false">확인</button>
        </div>
      </div>
    </div>
    
    <!-- 개인정보처리방침 모달 -->
    <div v-if="showPrivacyModal" class="modal-overlay" @click="showPrivacyModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>개인정보처리방침</h3>
          <button class="modal-close" @click="showPrivacyModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <h4>WhoWhoMail 개인정보처리방침</h4>
          <p>WhoWhoMail(이하 "회사")은 이용자의 개인정보 보호를 중요하게 생각하며, 관련 법령에 따라 개인정보 처리방침을 다음과 같이 수립하여 운영합니다.</p>

          <h4>제1조 (개인정보 수집 항목 및 방법)</h4>
          <p>회사는 회원가입, 서비스 제공 등을 위해 아래와 같은 개인정보를 수집합니다.</p>
          <p>1. 수집항목: 이메일 주소, 비밀번호, 이름, 메일 접근 권한 등</p>
          <p>2. 수집방법: 서비스 가입 및 이용 시 이용자가 직접 입력하는 방식</p>

          <h4>제2조 (개인정보의 이용 목적)</h4>
          <p>회사는 수집한 개인정보를 다음과 같은 목적으로만 이용하며, 목적 이외의 용도로는 사용하지 않습니다.</p>
          <p>1. 서비스 제공 및 운영 관리</p>
          <p>2. 회원 관리 및 본인 확인</p>
          <p>3. 피싱 대응 및 이메일 보안 서비스 개선</p>
          <p>4. 서비스 관련 공지사항 안내 및 고객 문의 처리</p>

          <h4>제3조 (개인정보의 보유 및 이용기간)</h4>
          <p>회사는 이용자의 개인정보를 회원 가입일로부터 회원 탈퇴 시까지 보유 및 이용하며, 법령에 따라 필요한 경우 별도의 기간 동안 보관할 수 있습니다.</p>

          <h4>제4조 (개인정보의 제3자 제공)</h4>
          <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않으며, 아래의 경우에 한하여 예외적으로 제공합니다.</p>
          <p>1. 이용자가 사전에 동의한 경우</p>
          <p>2. 법률에 특별한 규정이 있는 경우 또는 법령상 의무 준수를 위해 불가피한 경우</p>

          <h4>제5조 (개인정보의 파기)</h4>
          <p>회사는 개인정보의 수집 및 이용 목적이 달성된 후 지체 없이 해당 개인정보를 파기하며, 파기 시 복구 불가능한 방법으로 처리합니다.</p>

          <h4>제6조 (이용자 및 법정대리인의 권리와 행사방법)</h4>
          <p>이용자는 언제든지 본인의 개인정보 열람, 정정, 삭제 및 처리정지를 요청할 수 있으며, 이러한 요청은 서비스 내 개인정보 관리 메뉴 또는 회사에 직접 연락하여 처리할 수 있습니다.</p>

          <h4>제7조 (개인정보의 안전성 확보 조치)</h4>
          <p>회사는 이용자의 개인정보 보호를 위해 다음과 같은 안전성 확보 조치를 시행하고 있습니다.</p>
          <p>1. 개인정보 암호화 및 보안서버 운영</p>
          <p>2. 개인정보 취급 직원의 최소화 및 정기적인 교육 실시</p>
          <p>3. 개인정보 처리 시스템 접근 제한 및 모니터링</p>

          <h4>제8조 (개인정보보호 책임자)</h4>
          <p>회사는 개인정보 보호 업무를 담당하는 개인정보보호 책임자를 지정하고 있으며, 이용자의 개인정보 관련 민원 및 문의사항을 신속하게 처리하겠습니다.</p>
          <p>- 개인정보보호 책임자: WhoWhoMail 개인정보보호팀</p>

          <h4>제9조 (개인정보 처리방침의 변경)</h4>
          <p>본 개인정보 처리방침은 법령 및 회사 정책의 변경에 따라 개정될 수 있으며, 개정 시 웹사이트 공지사항 또는 이메일을 통해 사전 안내합니다.</p>

          <p><strong>본 개인정보 처리방침은 2025년 3월 31일부터 시행됩니다.</strong></p>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" @click="showPrivacyModal = false">확인</button>
        </div>
      </div>
    </div>
    
    <!-- 앱 비밀번호 도움말 모달 -->
    <div v-if="showAppPasswordHelp" class="modal-overlay" @click="showAppPasswordHelp = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>앱 비밀번호란?</h3>
          <button class="modal-close" @click="showAppPasswordHelp = false">&times;</button>
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
        <div class="modal-footer">
          <button class="btn-primary" @click="showAppPasswordHelp = false">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
// import { useUserStore } from '@/stores/user';

const router = useRouter();
// const userStore = useUserStore();

// Step management
const steps = ['기본 정보', '추가 정보'];
// const steps = ['기본 정보', '추가 정보', '메일 서버 설정'];
const currentStep = ref(0);

// Form data
const formData = ref({
  name: '',
  id: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
  
  mailSettings: {
    protocol: 'imaps',
    server: '',
    email: '',
    password: ''
  },
  
  personalInfo: {
    birthdate: '',
    gender: '',
    occupation: '',
    interests: ''
  }
});

// UI state
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showAppPassword = ref(false);
const showTermsModal = ref(false);
const showPrivacyModal = ref(false);
const showAppPasswordHelp = ref(false);
const birthYear = ref('');
const birthMonth = ref('');
const birthDay = ref('');
const gender = ref('');
const userCode = ref(0);

const passwordStrength = ref(0);
const strengthClass = ref('');
const strengthText = ref('');
const passwordsMatch = ref(true);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

const checkPasswordStrength = () => {
  const password = formData.value.password;
  
  if (!password) {
    passwordStrength.value = 0;
    strengthClass.value = '';
    strengthText.value = '';
    return;
  }
  
  let strength = 0;
  
  if (password.length >= 8) strength += 25;
  
  if (/\d/.test(password)) strength += 25;
  
  if (/[a-z]/.test(password)) strength += 25;
  
  if (/[A-Z]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 25;
  
  passwordStrength.value = strength;
  
  if (strength < 50) {
    strengthClass.value = 'weak';
    strengthText.value = '약함';
  } else if (strength < 75) {
    strengthClass.value = 'medium';
    strengthText.value = '보통';
  } else {
    strengthClass.value = 'strong';
    strengthText.value = '강함';
  }
  
  // 비밀번호가 변경되면 일치 여부도 체크
  if (formData.value.confirmPassword) {
    checkPasswordMatch();
  }
};

// 비밀번호 일치 여부 체크 함수
const checkPasswordMatch = () => {
  if (!formData.value.confirmPassword) {
    passwordsMatch.value = true;
    return;
  }
  
  passwordsMatch.value = formData.value.password === formData.value.confirmPassword;
};

const updateBirthdate = () => {
  if (birthYear.value && birthMonth.value && birthDay.value) {
    formData.value.personalInfo.birthdate = `${birthYear.value}${birthMonth.value}${birthDay.value}`;
  }
};

if (formData.value.personalInfo.birthdate) {
  const birthdate = formData.value.personalInfo.birthdate;
  // YYYYMMDD 형식일 경우
  if (birthdate.length === 8) {
    birthYear.value = birthdate.substring(0, 4);
    birthMonth.value = birthdate.substring(4, 6);
    birthDay.value = birthdate.substring(6, 8);
  } 
  // YYYY-MM-DD 형식일 경우 (기존 데이터 호환)
  else if (birthdate.includes('-')) {
    const [y, m, d] = birthdate.split('-');
    birthYear.value = y;
    birthMonth.value = m;
    birthDay.value = d;
  }
}

const updateGender = () => {
  formData.value.personalInfo.gender = gender.value;
};

if (formData.value.personalInfo.gender) {
  gender.value = formData.value.personalInfo.gender;
}

// Navigation methods
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
    window.scrollTo(0, 0);
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    window.scrollTo(0, 0);
  }
};

const goToStep = (step) => {
  // Only allow going to steps that have been completed or the current step
  if (step <= currentStep.value) {
    currentStep.value = step;
    window.scrollTo(0, 0);
  }
};

const handleRegister = async () => {
  try {
    if (formData.value.password !== formData.value.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const payload = {
      userFigureId: formData.value.id,
      name: formData.value.name,
      job: formData.value.personalInfo.occupation,
      gender: formData.value.personalInfo.gender,
      birthDate: formData.value.personalInfo.birthdate,
      password: formData.value.password,
      interest: formData.value.personalInfo.interests,
    };

    console.log('전송 데이터:', payload);

    const result = await api.registerUser(payload);
    console.log('회원가입 성공:', result);
    userCode.value = result.userId;
    alert('회원가입이 완료되었습니다.');
    router.push('/login');
    // 회원가입 성공 시 Step 3로 이동
    // currentStep.value = 2;
  } catch (error) {
    console.error('회원가입 실패:', error);
    alert(`회원가입 실패: ${error.message || '서버 오류'}`);
    // 회원가입 실패 시 Step 1로 이동
    currentStep.value = 0;
  }
};

const handleMailInfo = async () => {
  try {
    const mailInfoPayload = {
      userId: userCode.value,
      protocolType: formData.value.mailSettings.protocol,
      serverAddress: formData.value.mailSettings.server,
      emailAddress: formData.value.mailSettings.email,
      emailPassword: formData.value.mailSettings.password,
    };

    console.log('메일 서버 설정 데이터:', mailInfoPayload);

    const result = await api.updateMailInfo(mailInfoPayload);
    console.log('메일 서버 설정 성공:', result);

    // 메일 서버 설정 성공 후 로그인 페이지로 이동
    router.push('/login');
  } catch (error) {
    console.error('메일 서버 설정 실패:', error);
    alert(`메일 서버 설정 실패: ${error.message || '서버 오류'}`);
  }
}
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  padding: 1rem;
}

.register-container {
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  box-sizing: border-box;
}

.register-header {
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

.register-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
}

.register-subtitle {
  color: #64748b;
  margin: 0 0 1.5rem;
}

/* Step indicator */
.step-indicator {
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
  position: relative;
}

.step-indicator::before {
  content: "";
  position: absolute;
  top: 14px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e2e8f0;
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  cursor: pointer;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background-color: #1e3a8a;
  color: white;
}

.step.completed .step-number {
  background-color: #10b981;
  color: white;
}

.step-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.step.active .step-label {
  color: #1e3a8a;
  font-weight: 600;
}

.step.completed .step-label {
  color: #10b981;
}

.register-form {
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

.password-strength {
  margin-top: 0.5rem;
}

.strength-label {
  font-size: 0.75rem;
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
  font-size: 0.75rem;
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

/* 비밀번호 일치 여부 */
.password-match {
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.password-match.match {
  color: #10b981;
}

.password-match.mismatch {
  color: #ef4444;
}

.date-select-group {
  display: flex;
  gap: 0.5rem;
}

.date-select {
  flex: 1;
}

.date-part {
  padding-left: 0.75rem;
  text-align: center;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  border-color: #1e3a8a;
  outline: none;
}

.form-help {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
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

.terms-group {
  margin-top: 2rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  color: #1e293b;
  font-size: 0.875rem;
}

.checkbox-label input {
  margin-top: 0.25rem;
}

.terms-link {
  color: #1e3a8a;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.help-link {
  color: #1e3a8a;
  text-decoration: none;
  margin-left: 0.5rem;
}

.help-link:hover {
  text-decoration: underline;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 100px;
}

.btn-primary:hover {
  background-color: #1e40af;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #1e293b;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.btn-full {
  width: 100%;
  padding: 0.875rem;
}

.register-footer {
  text-align: center;
  color: #64748b;
}

.login-link {
  color: #1e3a8a;
  font-weight: 500;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

/* 모달 스타일 */
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
  z-index: 100;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  line-height: 1.6;
}

.modal-body h4 {
  color: #1e293b;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.modal-body h4:first-child {
  margin-top: 0;
}

.modal-body p {
  color: #4b5563;
  margin: 0.75rem 0;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
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

@media (max-width: 480px) {
  .register-container {
    padding: 1.5rem;
  }
  
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }
  
  .form-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .step-label {
    display: none;
  }
}
</style>