import { defineStore } from 'pinia';
import localStorage from '@/stores/localStorage';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: localStorage.getUserId() || '',
    token: localStorage.getToken() || '',
    userCode: localStorage.getUserCode() || ''
  }),

  getters: {
    isLoggedIn() {
      return !!this.token && !!this.userId;
    },
    getUserId() {
      return this.userId;
    },
    getToken() {
      return this.token;
    },
    getUserCode() {
      return this.userCode;
    }
  },

  actions: {
    setUserSession(userId, token, userCode) {
      this.userId = userId;
      this.token = token;
      this.userCode = userCode;
      localStorage.setUserSession(userId, token, userCode);
    },

    clearUser() {
      this.userId = '';
      this.token = '';
      this.userCode = '';
      localStorage.clearUserSession();
    },

    logout() {
      this.clearUser();
    }
  }
}); 