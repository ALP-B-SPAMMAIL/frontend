import axios from 'axios';
import { useUserStore } from '@/stores/user';

// axios.defaults.withCredentials = true;
// const API_URL = 'http://172.30.1.45:8080';
const API_URL = 'https://whowhomail.kro.kr';
const MAIL_SERVER_URL = API_URL + '/mail'; //mail-server
const AUTH_SERVER_URL = API_URL + '/auth'; //auth-server
const MONITORING_SERVER_URL = API_URL + '/monitoring'; //monitoring-server

const authServerApi = axios.create({
    baseURL: AUTH_SERVER_URL,
    headers: {
      'Content-Type': 'application/json'
    },
  });

const mailServerApi = axios.create({
  baseURL: MAIL_SERVER_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

// mailServerApi 요청 인터셉터 추가
mailServerApi.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const monitoringServerApi = axios.create({
  baseURL: MONITORING_SERVER_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

monitoringServerApi.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  async registerUser(userData) {
    try {
      const response = await authServerApi.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateMailInfo(mailData) {
    try {
      const response = await monitoringServerApi.post(`/monitoring`, mailData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async loginUser(userData) {
    try {
      const response = await authServerApi.post('/sign-in', userData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteUser(userId, userData) {
    try {
      const response = await authServerApi.delete(`/user/delete/${userId}`, {
        data: userData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getMailList(userId) {
    try {
      const response = await mailServerApi.get(`/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getSpamMailList(userId, page) {
    try {
      const response = await mailServerApi.get(`/spams/${userId}?page=${page}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getNormalMailList(userId, page) {
    try {
      const response = await mailServerApi.get(`/normals/${userId}?page=${page}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteSpamFlag(mailId) {
    try {
      const response = await mailServerApi.delete(`/spams/${mailId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  
};  