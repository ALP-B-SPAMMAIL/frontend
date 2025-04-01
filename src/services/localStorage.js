const USER_ID_KEY = 'userId';
const TOKEN_KEY = 'token';

export default {
  // 저장
  setUserSession(userId, token) {
    localStorage.setItem(USER_ID_KEY, userId);
    localStorage.setItem(TOKEN_KEY, token);
  },

  // 불러오기
  getUserId() {
    return localStorage.getItem(USER_ID_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // 삭제
  clearUserSession() {
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
};
