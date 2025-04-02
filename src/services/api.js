import axios from 'axios';

// axios.defaults.withCredentials = true;
// const API_URL = 'http://172.30.1.45:8080';
const API_URL = 'http://whowhomail.kro.kr';
const MAIL_SERVER_URL = API_URL + '/mail'; //mail-server
const AUTH_SERVER_URL = 'http://4.230.154.202';

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

export default {
  async registerUser(userData) {
    try {
      const response = await authServerApi.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async loginUser(userData) {
    try {
      const response = await authServerApi.post('/auth/sign-in', userData);
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
      const response = await mailServerApi.get(`/mail/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getSpamMailList(userId, page) {
    try {
      const response = await mailServerApi.get(`/mail/spams/${userId}?page=${page}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getNormalMailList(userId, page) {
    try {
      const response = await mailServerApi.get(`/mail/normals/${userId}?page=${page}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteSpamFlag(mailId) {
    try {
      const response = await mailServerApi.delete(`/mail/spams/${mailId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  
};