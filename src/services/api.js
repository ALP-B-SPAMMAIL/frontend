import axios from 'axios';

// const API_URL = 'http://172.30.1.45:8080';
const API_URL = 'http://localhost:8083';

const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    },
  });

  export default {
    async registerUser(userData) {
      try {
        const response = await api.post('/user/register', userData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    async deleteUser(userId, userData) {
      try {
        const response = await api.delete(`/user/delete/${userId}`, {
          data: userData
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    async getMailList(userId) {
      try {
        const response = await api.get(`/mail/${userId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    async getSpamMailList(userId, page) {
      try {
        const response = await api.get(`/mail/spams/${userId}?page=${page}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    async getNormalMailList(userId, page) {
      try {
        const response = await api.get(`/mail/normals/${userId}?page=${page}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    async deleteSpamFlag(mailId) {
      try {
        const response = await api.delete(`/mail/spams/${mailId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    
  };