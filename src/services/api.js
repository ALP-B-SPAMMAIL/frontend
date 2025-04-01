import axios from 'axios';

const API_URL = 'http://172.30.1.45:8080';

const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    },
  });

  export default {
    async registerUser(userData) {
        try {
          const response = await api.post('/register', userData);
          return response.data;
        } catch (error) {
          throw error.response?.data || error;
        }
      }
  };