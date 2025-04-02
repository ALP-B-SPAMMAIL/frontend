const USER_ID = 'userId';
const TOKEN_KEY = 'token';
const USER_CODE = 'userCode';

export default {
  // 저장
  setUserSession(userId, token, userCode) {
    localStorage.setItem(USER_ID, userId);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_CODE, userCode);
  },

  // 불러오기
  getUserId() {
    return localStorage.getItem(USER_ID);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUserCode() {
    return localStorage.getItem(USER_CODE);
  },

  // 삭제
  clearUserSession() {
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_CODE);
  }
};
