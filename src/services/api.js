import axios from 'axios';
import { useUserStore } from '@/stores/user';

const API_URL = 'https://whowhomail.kro.kr';
const MAIL_SERVER_URL = API_URL + '/mail'; //mail-server
const AUTH_SERVER_URL = API_URL + '/auth'; //auth-server
const MONITORING_SERVER_URL = API_URL + '/monitoring'; //monitoring-server
const USER_SERVER_URL = API_URL + '/user'; //user-server
const SPAM_SERVER_URL = API_URL + '/spam'; //spam-server
const userServerApi = axios.create({
  baseURL: USER_SERVER_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

userServerApi.interceptors.request.use(
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

const spamServerApi = axios.create({
  baseURL: SPAM_SERVER_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

spamServerApi.interceptors.request.use(
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

  async getMailInfoInitialized(userId) {
    try {
      const response = await monitoringServerApi.get(`/${userId}`);
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

  async deleteUser(userId) {
    try {
      const response = await userServerApi.delete(`/delete/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getMailList(userId) {
    try {
      const response = await mailServerApi.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getSpamMailList(userId, page) {
    try {
      const response = await mailServerApi.get(`/users/${userId}/spams?page=${page}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getNormalMailList(userId, page) {
    try {
      const response = await mailServerApi.get(`/users/${userId}/normals?page=${page}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async reportSpam(mailId, reason) {
    try {
      const response = await mailServerApi.get(`report?mailId=${mailId}&reason=${reason}`);
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
  
  async getSpamInfo(query) {
    try {
      const response = await spamServerApi.post('/search', { sender: query });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async sendMail(fromUserId, sendMailDto) {
    try {
      const response = await mailServerApi.get(`/users/${fromUserId}/send`, {
        params: {
          to: sendMailDto.to,
          subject: sendMailDto.subject,
          content: sendMailDto.content
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getTrashcanMails(userId, page) {
    try {
      const response = await mailServerApi.get(`/users/${userId}/trashcan?page=${page}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteMail(mailId) {
    try {
      const response = await mailServerApi.delete(`/trashcan/${mailId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async permanentlyDeleteMail(mailId) {
    try {
      const response = await mailServerApi.delete(`/mails/${mailId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async restoreMail(mailId) {
    try {
      const response = await mailServerApi.get(`/trashcan/${mailId}/restore`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getTopSpam() {
    try {
      const response = await spamServerApi.get('/top/spam');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
};  